import { useEffect, useMemo, useRef, useState } from "react";
import { createVoiceGuide } from "./voiceGuide.js";

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
  const [transientTranscript, setTransientTranscript] = useState("");
  const voiceGuide = useMemo(() => createVoiceGuide({ voiceEnabled }), [voiceEnabled]);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!active || !task) {
      setFallbackVisible(false);
      setTransientTranscript("");
      return undefined;
    }

    let cancelled = false;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    async function speakAndListen() {
      setFallbackVisible(false);
      setTransientTranscript("");
      onCaptionChange?.(task.lumaLine);
      onMoodChange?.(task.mood || "thinking");
      onVoiceActivityChange?.("orb-speaking");

      await voiceGuide.startSession({
        world,
        level,
        task,
        mood: task.mood || "thinking",
        recentEvent: "task-start"
      });
      await voiceGuide.playGuidePrompt(task.lumaLine, { mood: task.mood || "thinking" });
      if (cancelled || runIdRef.current !== runId) return;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        onMoodChange?.("listening");
        onVoiceActivityChange?.("listening");
        const result = await voiceGuide.listenForAnswer({ timeoutMs: 9000 });
        if (cancelled || runIdRef.current !== runId) return;

        const transcript = result.transcript || "";
        setTransientTranscript(transcript);

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
          onCorrect?.({
            provider: result.provider,
            transientTranscript: transcript,
            matched: evaluation.matched
          });
          return;
        }

        onGentleMiss?.({ ...result, evaluation });
        if (attempt === 0) {
          const hintLine = `Good try. ${task.gentleHint}`;
          onCaptionChange?.(hintLine);
          onMoodChange?.("sad");
          onVoiceActivityChange?.("orb-speaking");
          await voiceGuide.playGuidePrompt(hintLine, { mood: "sad" });
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
      voiceGuide.stopSession();
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
    voiceGuide.stopSession();
    setFallbackVisible(false);
    setTransientTranscript("");
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
