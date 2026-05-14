import { useEffect, useMemo, useRef, useState } from "react";
import { createVoiceGuide, getVoiceCompatibilityNote, QUIET_VOICE_MESSAGE } from "./voiceGuide.js";

export function VoiceInterface({
  active,
  world,
  level,
  task,
  voiceEnabled,
  onMoodChange,
  onVoiceActivityChange,
  onCaptionChange,
  onCorrect,
  onGentleMiss
}) {
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const voiceGuide = useMemo(() => createVoiceGuide({ voiceEnabled }), [voiceEnabled]);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!active || !task) {
      setFallbackVisible(false);
      return undefined;
    }

    let cancelled = false;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    async function speakAndListen() {
      const displayPrompt = task.lumaLine;
      const spokenPrompt = task.spokenLine || task.lumaLine;
      setFallbackVisible(false);
      onCaptionChange?.(displayPrompt);
      onMoodChange?.(task.mood || "thinking");
      onVoiceActivityChange?.("orb-speaking");

      await voiceGuide.startSession({
        world,
        level,
        task,
        mood: task.mood || "thinking",
        recentEvent: "task-start"
      });
      const promptVoice = await voiceGuide.playGuidePrompt(spokenPrompt, { mood: task.mood || "thinking" });
      if (cancelled || runIdRef.current !== runId) return;
      if (!promptVoice.spoken) {
        const compatibilityNote = getVoiceCompatibilityNote();
        onCaptionChange?.(compatibilityNote ? `${QUIET_VOICE_MESSAGE} ${compatibilityNote}` : QUIET_VOICE_MESSAGE);
        await new Promise((resolve) => window.setTimeout(resolve, 850));
        if (cancelled || runIdRef.current !== runId) return;
      }

      for (let attempt = 0; attempt < 2; attempt += 1) {
        onCaptionChange?.(task.listeningLine || "Your turn, ELI.");
        onMoodChange?.("listening");
        onVoiceActivityChange?.("listening");
        const result = await voiceGuide.listenForAnswer({ timeoutMs: 9000, taskId: task.id });
        if (cancelled || runIdRef.current !== runId) return;

        const transcript = result.transcript || "";

        if (!transcript) {
          onGentleMiss?.(result);
          setFallbackVisible(true);
          onMoodChange?.("thinking");
          onVoiceActivityChange?.("fallback");
          return;
        }

        const evaluation = voiceGuide.evaluateAnswer({
          transcript,
          targetWords: task.targetWords
        });

        if (evaluation.correct) {
          setFallbackVisible(false);
          onMoodChange?.("proud");
          onVoiceActivityChange?.("reward");
          voiceGuide.stopSession("task-success");
          onCorrect?.({
            provider: result.provider,
            matched: evaluation.matched
          });
          return;
        }

        onGentleMiss?.({ ...result, evaluation });
        if (attempt === 0) {
          const heardPrefix = evaluation.matched?.length ? `I heard ${evaluation.matched[0]}.` : "Good try.";
          const hintLine = `${heardPrefix} ${task.gentleHint}`;
          const hintVoiceLine = task.gentleHintSpoken || hintLine.replace(/\bELI\b/g, "Ellie");
          onCaptionChange?.(hintLine);
          onMoodChange?.(evaluation.matched?.length ? "thinking" : "sad");
          onVoiceActivityChange?.(evaluation.matched?.length ? "heard-you" : "unclear");
          await new Promise((resolve) => window.setTimeout(resolve, 260));
          if (cancelled || runIdRef.current !== runId) return;
          onVoiceActivityChange?.("orb-speaking");
          const hintVoice = await voiceGuide.playGuidePrompt(hintVoiceLine, { mood: evaluation.matched?.length ? "thinking" : "sad" });
          if (!hintVoice.spoken) {
            const compatibilityNote = getVoiceCompatibilityNote();
            onCaptionChange?.(compatibilityNote ? `${QUIET_VOICE_MESSAGE} ${compatibilityNote}` : QUIET_VOICE_MESSAGE);
            await new Promise((resolve) => window.setTimeout(resolve, 850));
          }
          if (cancelled || runIdRef.current !== runId) return;
        } else {
          setFallbackVisible(true);
          onMoodChange?.("thinking");
          onVoiceActivityChange?.("fallback");
          return;
        }
      }
    }

    speakAndListen();

    return () => {
      cancelled = true;
      voiceGuide.stopSession("voice-interface-cleanup");
      onVoiceActivityChange?.("idle");
    };
  }, [
    active,
    task?.id,
    voiceEnabled,
    world?.id,
    level?.id,
    voiceGuide,
    onCaptionChange,
    onCorrect,
    onGentleMiss,
    onMoodChange,
    onVoiceActivityChange,
    task,
    world,
    level
  ]);

  function completeWithFallback() {
    if (!task) return;
    voiceGuide.stopSession("fallback-tap");
    setFallbackVisible(false);
    onMoodChange?.("proud");
    onVoiceActivityChange?.("reward");
    onCorrect?.(voiceGuide.fallbackToTap({ expected: task.expectedAnswer }));
  }

  if (!fallbackVisible) return null;

  return (
    <button className="voice-fallback-chip" type="button" onClick={completeWithFallback}>
      Say it aloud, then tap to continue.
    </button>
  );
}
