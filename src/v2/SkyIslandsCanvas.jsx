import { Float, Html, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { orbMoods } from "./skyIslandsData.js";

function usePulse(ref, active, speed = 3.4, amount = 0.06) {
  useFrame((state) => {
    if (!ref.current) return;
    const pulse = active ? Math.sin(state.clock.elapsedTime * speed) * amount : 0;
    ref.current.scale.setScalar(1 + pulse);
  });
}

function MagicSparkle({ sparkle, color = "#fff0a8", active = true }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime + sparkle.phase;
    const lift = active ? Math.sin(elapsed * sparkle.speed) * sparkle.float : 0;
    mesh.current.position.set(
      sparkle.x + Math.sin(elapsed * 0.7) * 0.025,
      sparkle.y + lift,
      sparkle.z + Math.cos(elapsed * 0.8) * 0.025
    );
    mesh.current.rotation.z += 0.018;
    mesh.current.scale.setScalar(sparkle.scale * (active ? 1 + Math.sin(elapsed * 2.2) * 0.18 : 0.72));
  });

  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} transparent opacity={active ? 0.86 : 0.28} depthWrite={false} />
    </mesh>
  );
}

function SparkleCluster({ active, color = "#fff0a8", count = 7, radius = 0.5 }) {
  const sparkles = useMemo(() => Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius * (0.5 + (index % 3) * 0.16),
      y: 0.28 + (index % 4) * 0.08,
      z: Math.sin(angle) * radius * 0.6,
      phase: index * 0.83,
      speed: 1.3 + (index % 4) * 0.18,
      scale: 0.035 + (index % 3) * 0.01,
      float: 0.12 + (index % 2) * 0.06
    };
  }), [count, radius]);

  if (!active) return null;
  return sparkles.map((sparkle) => (
    <MagicSparkle key={sparkle.phase} sparkle={sparkle} color={color} active={active} />
  ));
}

function CloudPuff({ position, scale = 1, opacity = 0.7 }) {
  return (
    <group position={position} scale={scale}>
      <mesh scale={[1.15, 0.32, 0.78]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity} roughness={0.86} />
      </mesh>
      <mesh position={[0.42, 0.03, 0.04]} scale={[0.72, 0.38, 0.58]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#f4fbff" transparent opacity={opacity * 0.86} roughness={0.88} />
      </mesh>
      <mesh position={[-0.42, 0.02, 0]} scale={[0.68, 0.34, 0.52]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={opacity * 0.82} roughness={0.88} />
      </mesh>
    </group>
  );
}

function OrbParticle({ particle, mood }) {
  const mesh = useRef(null);
  const moodConfig = orbMoods[mood] || orbMoods.happy;

  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime;
    const speed = mood === "listening" ? particle.speed * 1.8 : particle.speed;
    const angle = elapsed * speed + particle.phase;
    mesh.current.position.set(
      Math.cos(angle) * particle.radius,
      Math.sin(angle * 1.3) * 0.25,
      Math.sin(angle) * particle.radius
    );
    mesh.current.scale.setScalar(0.035 + Math.sin(elapsed * 2.4 + particle.phase) * 0.01);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={moodConfig.glow} transparent opacity={0.72} />
    </mesh>
  );
}

function ExpressiveOrbMesh({ mood = "happy", introStage = "corner" }) {
  const group = useRef(null);
  const material = useRef(null);
  const light = useRef(null);
  const moodConfig = orbMoods[mood] || orbMoods.happy;
  const particles = useMemo(() => Array.from({ length: 14 }, (_, index) => ({
    radius: 0.62 + (index % 4) * 0.08,
    speed: 0.5 + (index % 5) * 0.08,
    phase: index * 0.74
  })), []);

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    const target = introStage === "center"
      ? new THREE.Vector3(0, 1.25, 1.6)
      : introStage === "flying"
        ? new THREE.Vector3(-3.3, 1.95, 1.1)
        : new THREE.Vector3(-4.25, 1.7, 0.6);
    group.current.position.lerp(target, 0.055);
    group.current.position.y += Math.sin(elapsed * 1.8) * 0.004;
    group.current.rotation.y += mood === "thinking" ? 0.012 : 0.006;
    const pulse = Math.sin(elapsed * (mood === "listening" ? 5.4 : 2.8)) * 0.04;
    group.current.scale.setScalar((moodConfig.scale || 1) + pulse);
    if (material.current) {
      material.current.color.lerp(new THREE.Color(moodConfig.color), 0.08);
      material.current.emissive.lerp(new THREE.Color(moodConfig.glow), 0.08);
      material.current.emissiveIntensity = mood === "listening" ? 2.45 : 1.7;
    }
    if (light.current) {
      light.current.color.lerp(new THREE.Color(moodConfig.glow), 0.08);
      light.current.intensity = mood === "listening" ? 4.1 : 3.1;
    }
  });

  return (
    <group ref={group} position={[0, 1.25, 1.6]}>
      <pointLight ref={light} position={[0, 0.8, 0.2]} intensity={3} color={moodConfig.glow} distance={4.4} />
      <mesh>
        <sphereGeometry args={[0.46, 36, 36]} />
        <meshStandardMaterial ref={material} color={moodConfig.color} emissive={moodConfig.glow} emissiveIntensity={1.7} roughness={0.25} />
      </mesh>
      {particles.map((particle) => (
        <OrbParticle key={particle.phase} particle={particle} mood={mood} />
      ))}
      <Html center transform distanceFactor={7} position={[0, 0, 0.47]}>
        <div className="orb-face-3d" data-mouth={moodConfig.expression?.mouth}>
          <span className={`orb-brow left ${moodConfig.expression?.brow || ""}`} />
          <span className={`orb-brow right ${moodConfig.expression?.brow || ""}`} />
          <span className={`orb-eye left ${moodConfig.expression?.eyes || ""}`} />
          <span className={`orb-eye right ${moodConfig.expression?.eyes || ""}`} />
          <span className={`orb-mouth ${moodConfig.expression?.mouth || "smile"}`} />
        </div>
      </Html>
    </group>
  );
}

function FloatingCloud({ config, voiceActivity }) {
  const group = useRef(null);
  const listening = voiceActivity === "listening" || voiceActivity === "fallback";
  const reward = voiceActivity === "reward";

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    const speed = listening ? 0.85 : reward ? 1.15 : 0.32;
    group.current.position.x = config.x + Math.sin(elapsed * speed + config.phase) * (listening ? 0.34 : 0.18);
    group.current.position.y = config.y + Math.sin(elapsed * 0.55 + config.phase) * (reward ? 0.2 : 0.11);
    group.current.rotation.y = Math.sin(elapsed * 0.24 + config.phase) * 0.16;
  });

  return (
    <group ref={group} position={[config.x, config.y, config.z]} scale={config.scale}>
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={listening ? "#f9fdff" : "#ffffff"} roughness={0.78} transparent opacity={0.86} />
      </mesh>
      <mesh position={[0.42, -0.04, 0.03]} scale={[0.74, 0.58, 0.62]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#f4fbff" roughness={0.8} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.45, -0.05, 0.02]} scale={[0.62, 0.48, 0.58]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} transparent opacity={0.78} />
      </mesh>
    </group>
  );
}

function FloatingClouds({ voiceActivity }) {
  const clouds = useMemo(() => [
    { x: -5.2, y: 1.8, z: -2.9, scale: 0.7, phase: 0.1 },
    { x: -3.3, y: 2.45, z: 0.4, scale: 0.52, phase: 1.9 },
    { x: -0.2, y: 2.1, z: -3.25, scale: 0.66, phase: 3.1 },
    { x: 2.65, y: 2.6, z: -2.35, scale: 0.58, phase: 4.4 },
    { x: 5.2, y: 1.85, z: -0.95, scale: 0.74, phase: 5.3 }
  ], []);

  return clouds.map((config) => (
    <FloatingCloud key={config.phase} config={config} voiceActivity={voiceActivity} />
  ));
}

function BridgeSegment({ start, end, built, building }) {
  const mesh = useRef(null);
  const material = useRef(null);
  const { midpoint, length, quaternion } = useMemo(() => {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(b, a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.clone().normalize());
    return {
      midpoint: a.clone().add(b).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: q
    };
  }, [start, end]);

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const targetScale = built ? 1 : building ? Math.min(1, 0.18 + ((state.clock.elapsedTime * 0.42) % 1)) : 0.18;
    mesh.current.scale.x += (targetScale - mesh.current.scale.x) * 0.08;
    material.current.opacity = built || building ? 0.94 : 0.18;
    material.current.emissiveIntensity = building ? 1.7 + Math.sin(state.clock.elapsedTime * 8) * 0.4 : built ? 0.95 : 0.16;
  });

  return (
    <group position={midpoint} quaternion={quaternion}>
      <mesh ref={mesh} scale={[built ? 1 : 0.18, 1, 1]}>
        <boxGeometry args={[length, 0.09, 0.18]} />
        <meshStandardMaterial
          ref={material}
          color={built || building ? "#fff0a8" : "#dbe5ef"}
          emissive={built || building ? "#ffd45c" : "#9db3c7"}
          emissiveIntensity={0.4}
          transparent
          opacity={0.72}
          roughness={0.45}
        />
      </mesh>
      {[0.2, 0.38, 0.56, 0.74].map((fraction, index) => {
        const visible = built || building || index === 0;
        return (
          <mesh key={fraction} position={[length * (fraction - 0.5), 0.08, 0]} scale={visible ? 1 : 0.7}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial
              color={built || building ? "#ffffff" : "#dbe5ef"}
              emissive={built || building ? "#fff0a8" : "#9db3c7"}
              emissiveIntensity={visible ? 1.1 : 0.18}
              transparent
              opacity={visible ? 0.92 : 0.2}
              roughness={0.28}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function MapLandmark({ level, unlocked, complete }) {
  const materialColor = complete ? "#fff2a6" : unlocked ? level.color : "#d8e2eb";
  const glow = complete ? "#ffd45c" : unlocked ? "#baf6ff" : "#b6c6d4";

  if (level.sceneType === "picnic-island") {
    return (
      <group position={[0, 0.83, 0]}>
        <mesh scale={[0.52, 0.08, 0.38]}>
          <cylinderGeometry args={[1, 1, 1, 18]} />
          <meshStandardMaterial color={materialColor} emissive={glow} emissiveIntensity={unlocked ? 0.25 : 0.06} roughness={0.52} />
        </mesh>
        <mesh position={[0.12, 0.17, 0.04]} scale={[0.18, 0.16, 0.18]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#fff0b8" emissive={glow} emissiveIntensity={unlocked ? 0.35 : 0.08} />
        </mesh>
      </group>
    );
  }

  if (level.sceneType === "star-observatory") {
    return (
      <group position={[0, 0.78, 0]}>
        <mesh scale={[0.44, 0.28, 0.44]}>
          <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#eef8ff" emissive={glow} emissiveIntensity={unlocked ? 0.32 : 0.08} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0.12, 0]} scale={[0.06, 0.24, 0.06]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      </group>
    );
  }

  if (level.sceneType === "cloud-stage") {
    return (
      <group position={[0, 0.78, 0]}>
        <mesh scale={[0.52, 0.11, 0.34]}>
          <cylinderGeometry args={[1, 1, 1, 20]} />
          <meshStandardMaterial color={materialColor} emissive={glow} emissiveIntensity={unlocked ? 0.24 : 0.06} />
        </mesh>
        <mesh position={[0, 0.24, 0]} scale={[0.13, 0.28, 0.13]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshStandardMaterial color="#ffffff" emissive={glow} emissiveIntensity={unlocked ? 0.7 : 0.12} />
        </mesh>
      </group>
    );
  }

  if (level.sceneType === "london-gate") {
    return (
      <group position={[0, 0.72, 0]}>
        <mesh position={[-0.2, 0.14, 0]} scale={[0.08, 0.42, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" emissive={glow} emissiveIntensity={unlocked ? 0.2 : 0.06} />
        </mesh>
        <mesh position={[0.2, 0.14, 0]} scale={[0.08, 0.42, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" emissive={glow} emissiveIntensity={unlocked ? 0.2 : 0.06} />
        </mesh>
        <mesh position={[0, 0.42, 0]} scale={[0.38, 0.08, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>
      </group>
    );
  }

  if (level.sceneType === "storm-citadel") {
    return (
      <group position={[0, 0.73, 0]}>
        <mesh scale={[0.5, 0.42, 0.5]}>
          <coneGeometry args={[0.62, 0.86, 5]} />
          <meshStandardMaterial color={materialColor} emissive={glow} emissiveIntensity={unlocked ? 0.22 : 0.07} roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.48, 0]} scale={[0.24, 0.08, 0.24]}>
          <cylinderGeometry args={[1, 1, 1, 5]} />
          <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 0.8 : 0.16} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0.76, 0]}>
      <mesh scale={[0.16, 0.16, 0.16]}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshStandardMaterial emissive={glow} emissiveIntensity={unlocked ? 1.8 : 0.45} color="#ffffff" />
      </mesh>
      <mesh position={[0, -0.24, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.54, 0.54, 0.54]}>
        <torusGeometry args={[0.62, 0.025, 8, 36]} />
        <meshBasicMaterial color={glow} transparent opacity={unlocked ? 0.55 : 0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MapIsland({ level, unlocked, complete, introComplete, active, onSelectLevel }) {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25 + level.order) * 0.04;
  });

  const clickable = unlocked && introComplete && level.implementationStatus === "playable";
  const sleepy = unlocked && introComplete && !clickable;
  const glow = complete ? "#ffd45c" : unlocked ? "#77e6ff" : "#aab8c5";

  return (
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.18}>
      <group
        ref={group}
        position={level.position || [0, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelectLevel(level.id);
        }}
      >
        <CloudPuff position={[0, -0.2, 0.03]} scale={unlocked ? 1.35 : 1.18} opacity={unlocked ? 0.64 : 0.48} />
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.6, 1.18, 1]}>
          <torusGeometry args={[0.66, 0.035, 8, 42]} />
          <meshBasicMaterial color={glow} transparent opacity={unlocked ? 0.36 : 0.12} depthWrite={false} />
        </mesh>
        <mesh castShadow receiveShadow scale={[1.2, 0.28, 1.05]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={unlocked ? level.color : "#b8c4d4"}
            emissive={complete ? "#ffd45c" : unlocked ? level.color : "#7d8c99"}
            emissiveIntensity={complete ? 0.3 : unlocked ? 0.08 : 0.03}
            roughness={0.72}
            metalness={0.04}
          />
        </mesh>
        <mesh position={[0, 0.32, 0]} scale={[0.68, 0.24, 0.68]}>
          <cylinderGeometry args={[0.75, 0.9, 0.45, 7]} />
          <meshStandardMaterial color={complete ? "#fff2a6" : unlocked ? "#ffffff" : "#e7edf3"} roughness={0.65} />
        </mesh>
        <MapLandmark level={level} unlocked={unlocked} complete={complete} />
        {complete ? <SparkleCluster active color="#ffd45c" count={8} radius={0.62} /> : null}
        {!unlocked ? (
          <mesh position={[0, 0.95, 0]} scale={[0.9, 0.36, 0.9]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#dce7ef" transparent opacity={0.45} roughness={0.9} />
          </mesh>
        ) : null}
        <Html center distanceFactor={9} position={[0, 1.18, 0]}>
          <button
            className={`island-label ${active ? "active" : ""} ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""} ${sleepy ? "sleepy" : ""}`}
            type="button"
            disabled={!unlocked || !introComplete}
            onClick={() => onSelectLevel(level.id)}
          >
            {level.shortTitle}
          </button>
        </Html>
      </group>
    </Float>
  );
}

function SkyMapScene({ world, activeLevel, unlockedLevelIds, completedLevelIds, introComplete, introStage, lumaMood, voiceActivity, progressionAnimation, onSelectLevel }) {
  return (
    <>
      <FloatingClouds voiceActivity={voiceActivity} />
      {world.levels.slice(0, -1).map((level, index) => {
        const next = world.levels[index + 1];
        const built = completedLevelIds.includes(level.id) || unlockedLevelIds.includes(next.id);
        const building = progressionAnimation === `${level.id}-to-${next.id}`;
        return (
          <BridgeSegment
            key={`${level.id}-${next.id}`}
            start={level.position}
            end={next.position}
            built={built}
            building={building}
          />
        );
      })}
      <group position={[0, -0.15, 0]}>
        {world.levels.map((level) => (
          <MapIsland
            key={level.id}
            level={level}
            unlocked={unlockedLevelIds.includes(level.id)}
            complete={completedLevelIds.includes(level.id)}
            introComplete={introComplete}
            active={level.id === activeLevel?.id}
            onSelectLevel={onSelectLevel}
          />
        ))}
      </group>
      {!introComplete ? <ExpressiveOrbMesh mood={lumaMood} introStage={introStage} /> : null}
    </>
  );
}

const cloudHarborOverlaySpots = {
  "wake-the-dock": { x: 35, y: 57, kind: "dock" },
  "light-the-lantern": { x: 15, y: 58, kind: "lantern" },
  "choose-blue-wind": { x: 31, y: 47, kind: "flag" },
  "find-silver-key": { x: 52, y: 64, kind: "key" },
  "mix-breeze-potion": { x: 66, y: 73, kind: "potion" },
  "open-cloud-gate": { x: 69, y: 41, kind: "gate" },
  "cast-cloud-path-spell": { x: 48, y: 53, kind: "spell" },
  "build-first-bridge": { x: 74, y: 80, kind: "bridge" }
};

function CloudHarborPlateOverlay({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  const activeTaskId = activeTask?.id;
  const activeSpot = activeTaskId ? cloudHarborOverlaySpots[activeTaskId] : null;
  const bridgeBuilt = completed.has("build-first-bridge") || Boolean(rewardEvent);

  return (
    <div className="cloud-harbor-overlay" aria-hidden="true">
      <div className="cloud-harbor-drift-cloud one" />
      <div className="cloud-harbor-drift-cloud two" />
      <div className="cloud-harbor-drift-cloud three" />
      {level.tasks.map((task) => {
        const spot = cloudHarborOverlaySpots[task.id];
        if (!spot) return null;
        const active = task.id === activeTaskId;
        const done = completed.has(task.id);
        return (
          <span
            key={task.id}
            className={`cloud-harbor-hotspot ${spot.kind} ${active ? "active" : ""} ${done ? "done" : ""}`}
            style={{ "--x": `${spot.x}%`, "--y": `${spot.y}%` }}
          >
            <span className="cloud-harbor-hotspot-glow" />
            <span className="cloud-harbor-sparkle a" />
            <span className="cloud-harbor-sparkle b" />
            <span className="cloud-harbor-sparkle c" />
          </span>
        );
      })}
      {completed.has("choose-blue-wind") ? <span className="cloud-harbor-flag-wave" /> : null}
      {completed.has("find-silver-key") ? <span className="cloud-harbor-key-reveal" /> : null}
      {completed.has("mix-breeze-potion") ? <span className="cloud-harbor-potion-shimmer" /> : null}
      {completed.has("open-cloud-gate") ? <span className="cloud-harbor-gate-swirl" /> : null}
      {(completed.has("cast-cloud-path-spell") || bridgeBuilt) ? <span className="cloud-harbor-bridge-trail" data-built={bridgeBuilt ? "true" : "false"} /> : null}
      <div className="cloud-harbor-scene-gems">
        {level.tasks.map((task) => (
          <span key={task.id} className={completed.has(task.id) ? "done" : activeTaskId === task.id ? "active" : ""} />
        ))}
      </div>
      {rewardEvent ? (
        <div className="cloud-harbor-reward-pop">
          <span>{rewardEvent.label || "Cloud Compass"}</span>
        </div>
      ) : null}
      {voiceActivity === "listening" && activeSpot ? (
        <span className="cloud-harbor-listening-glow" style={{ "--x": `${activeSpot.x}%`, "--y": `${activeSpot.y}%` }} />
      ) : null}
    </div>
  );
}

function HighlightRing({ active, color = "#fff0a8" }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.visible = active;
    mesh.current.rotation.z += 0.01;
    mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.06);
  });

  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.52, 0.025, 10, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.72} depthWrite={false} />
    </mesh>
  );
}

function ActiveObjectAura({
  active,
  complete,
  color,
  intensity = 1.4,
  distance = 2.5,
  completeCount = 9,
  activeCount = 5,
  completeRadius = 0.62,
  activeRadius = 0.42
}) {
  return (
    <>
      <pointLight intensity={active || complete ? intensity : 0.24} color={color} distance={distance} />
      <HighlightRing active={active} color={color} />
      <SparkleCluster
        active={active || complete}
        color={color}
        count={complete ? completeCount : activeCount}
        radius={complete ? completeRadius : activeRadius}
      />
    </>
  );
}

function FlagCloth({ complete, active }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const wave = Math.sin(state.clock.elapsedTime * (complete ? 4.2 : 2.4)) * (complete ? 0.12 : 0.04);
    mesh.current.rotation.z = wave;
    mesh.current.position.x = complete ? 0.22 + Math.sin(state.clock.elapsedTime * 2) * 0.025 : 0.12;
  });

  return (
    <mesh ref={mesh} position={[complete ? 0.22 : 0.12, complete ? 0.68 : 0.38, 0]} scale={[complete ? 0.46 : 0.22, 0.26, 0.03]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={complete ? "#ff83c6" : active ? "#ffb4de" : "#d486bc"}
        emissive={complete ? "#ffd0ed" : "#552244"}
        emissiveIntensity={complete ? 0.8 : active ? 0.25 : 0.1}
      />
    </mesh>
  );
}

function PotionBubbles({ complete, active }) {
  const bubbles = useMemo(() => [
    { x: -0.16, z: -0.04, phase: 0.1 },
    { x: 0.08, z: 0.08, phase: 1.4 },
    { x: 0.21, z: -0.08, phase: 2.2 }
  ], []);

  return bubbles.map((bubble) => (
    <PotionBubble key={bubble.phase} bubble={bubble} complete={complete} active={active} />
  ));
}

function PotionBubble({ bubble, complete, active }) {
  const mesh = useRef(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime + bubble.phase;
    const lively = active || complete;
    mesh.current.position.y = 0.34 + Math.sin(elapsed * 2.4) * (lively ? 0.08 : 0.025);
    mesh.current.scale.setScalar(0.045 + Math.sin(elapsed * 2) * (lively ? 0.012 : 0.004));
  });

  return (
    <mesh ref={mesh} position={[bubble.x, 0.34, bubble.z]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={complete ? "#e8fbff" : "#baf6ff"} transparent opacity={active || complete ? 0.82 : 0.35} />
    </mesh>
  );
}

function SpellRings({ complete, active }) {
  const outer = useRef(null);
  const inner = useRef(null);
  useFrame((state) => {
    if (outer.current) outer.current.rotation.z += complete ? 0.036 : active ? 0.026 : 0.012;
    if (inner.current) inner.current.rotation.z -= complete ? 0.044 : active ? 0.028 : 0.014;
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={outer}>
        <torusGeometry args={[0.42, 0.022, 10, 48]} />
        <meshBasicMaterial color={complete ? "#fff0a8" : "#baf6ff"} transparent opacity={active || complete ? 0.95 : 0.42} depthWrite={false} />
      </mesh>
      <mesh ref={inner} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.24, 0.015, 10, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={active || complete ? 0.78 : 0.36} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 8]}>
        <torusGeometry args={[0.1, 0.01, 8, 28]} />
        <meshBasicMaterial color="#ffd0ed" transparent opacity={complete ? 0.82 : active ? 0.5 : 0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

function HarborObject({ objectKey, position, active, complete }) {
  const group = useRef(null);
  usePulse(group, active, 4.2, 0.055);
  const glow = complete ? "#ffd45c" : active ? "#fff0a8" : "#9bdcff";

  useFrame((state) => {
    if (!group.current) return;
    if (complete) group.current.rotation.y += 0.006;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.025;
  });

  return (
    <group ref={group} position={position}>
      <pointLight intensity={active || complete ? 1.25 : 0.22} color={glow} distance={2.2} />
      <HighlightRing active={active} color={glow} />
      <SparkleCluster active={active || complete} color={glow} count={complete ? 9 : 5} radius={complete ? 0.62 : 0.44} />
      {objectKey === "luma-memory" ? (
        <group>
          <mesh>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial color="#52e6ff" emissive="#baf6ff" emissiveIntensity={complete ? 1.8 : active ? 1.2 : 0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.018, 8, 34]} />
            <meshBasicMaterial color="#baf6ff" transparent opacity={active || complete ? 0.64 : 0.28} depthWrite={false} />
          </mesh>
        </group>
      ) : null}
      {objectKey === "lantern" ? (
        <group>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 0.34, 8]} />
            <meshStandardMaterial color={complete ? "#ffe680" : active ? "#f8e5a5" : "#596b7a"} emissive={complete || active ? "#ffd45c" : "#263747"} emissiveIntensity={complete ? 1.4 : active ? 0.75 : 0.2} />
          </mesh>
          <mesh position={[0, 0.24, 0]} scale={[0.42, 0.5, 0.42]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color="#fff0a8" transparent opacity={complete ? 0.34 : active ? 0.22 : 0.04} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <torusGeometry args={[0.14, 0.018, 8, 20]} />
            <meshStandardMaterial color="#5b456b" />
          </mesh>
        </group>
      ) : null}
      {objectKey === "flag" ? (
        <group>
          <mesh position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <FlagCloth complete={complete} active={active} />
        </group>
      ) : null}
      {objectKey === "silver-key" ? (
        <group>
          {[0, 1, 2].map((index) => (
            <mesh key={index} position={[(index - 1) * 0.28, 0.35, 0]} scale={complete ? 0.02 : 0.22}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.78} />
            </mesh>
          ))}
          <mesh position={[0.06, complete ? 0.48 : 0.24, 0.02]} rotation={[0, 0, 0.7]}>
            <torusGeometry args={[0.12, 0.025, 10, 24]} />
            <meshStandardMaterial color="#d9f1ff" metalness={0.45} roughness={0.22} emissive="#c4efff" emissiveIntensity={complete ? 1.2 : 0.4} />
          </mesh>
          <mesh position={[0.22, complete ? 0.33 : 0.09, 0.02]} rotation={[0, 0, 0.7]} scale={[0.26, 0.05, 0.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#d9f1ff" metalness={0.45} roughness={0.22} />
          </mesh>
        </group>
      ) : null}
      {objectKey === "potion" ? (
        <group>
          <mesh position={[0, 0.18, 0]} scale={[0.45, 0.18, 0.45]}>
            <sphereGeometry args={[1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#8a8dff" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.27, 0]} scale={[0.32, 0.08, 0.32]}>
            <sphereGeometry args={[1, 20, 8]} />
            <meshStandardMaterial color={complete ? "#55d8ff" : "#7ba8ff"} emissive={complete ? "#55d8ff" : "#2e5aa6"} emissiveIntensity={complete ? 1.3 : 0.25} transparent opacity={0.8} />
          </mesh>
          <PotionBubbles complete={complete} active={active} />
        </group>
      ) : null}
      {objectKey === "gate" ? (
        <group>
          <mesh position={[complete ? -0.34 : -0.22, 0.36, 0]} rotation={[0, 0, complete ? -0.12 : 0]}>
            <boxGeometry args={[0.12, 0.72, 0.12]} />
            <meshStandardMaterial color="#ffffff" emissive={complete || active ? "#baf6ff" : "#6aa9c2"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.2} />
          </mesh>
          <mesh position={[complete ? 0.34 : 0.22, 0.36, 0]} rotation={[0, 0, complete ? 0.12 : 0]}>
            <boxGeometry args={[0.12, 0.72, 0.12]} />
            <meshStandardMaterial color="#ffffff" emissive={complete || active ? "#baf6ff" : "#6aa9c2"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.2} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <torusGeometry args={[0.27, 0.04, 10, 28, Math.PI]} />
            <meshStandardMaterial color="#ffffff" emissive={complete || active ? "#baf6ff" : "#6aa9c2"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.2} />
          </mesh>
        </group>
      ) : null}
      {objectKey === "spell-circle" ? (
        <SpellRings complete={complete} active={active} />
      ) : null}
      {objectKey === "bridge-pieces" ? (
        <group>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[(index - 1.5) * 0.22, 0.18 + index * 0.05, 0]} rotation={[0, index * 0.5, 0.2]}>
              <boxGeometry args={[0.28, 0.08, 0.16]} />
              <meshStandardMaterial color={complete ? "#fff0a8" : "#c7dded"} emissive={complete ? "#ffd45c" : "#77b9d4"} emissiveIntensity={complete ? 1 : 0.25} />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
}

function CerealStar({ index, complete, active }) {
  const mesh = useRef(null);
  const angle = (index / 7) * Math.PI * 2;

  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime;
    const spinSpeed = complete ? 2.5 : active ? 1.4 : 0.35;
    const radius = complete ? 0.34 : 0.22;
    mesh.current.position.x = Math.cos(angle + elapsed * spinSpeed) * radius;
    mesh.current.position.z = Math.sin(angle + elapsed * spinSpeed) * radius * 0.62;
    mesh.current.position.y = 0.44 + Math.sin(elapsed * 2.2 + index) * (active || complete ? 0.08 : 0.025);
    mesh.current.rotation.y += active || complete ? 0.04 : 0.012;
  });

  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[0.07, 0]} />
      <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 1.2 : active ? 0.8 : 0.28} roughness={0.34} />
    </mesh>
  );
}

function ToastBoat({ index, complete, active }) {
  const group = useRef(null);
  const baseX = (index - 1) * 0.27;

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime + index;
    group.current.position.x = complete ? baseX : baseX + Math.sin(elapsed * 1.1) * 0.06;
    group.current.position.y = 0.24 + Math.sin(elapsed * 1.7) * (active || complete ? 0.045 : 0.018);
    group.current.rotation.z = complete ? 0 : Math.sin(elapsed * 1.4) * 0.08;
  });

  return (
    <group ref={group} position={[baseX, 0.24, 0]}>
      <mesh scale={[0.18, 0.08, 0.11]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d98942" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.08, 0]} scale={[0.16, 0.1, 0.1]}>
        <sphereGeometry args={[1, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#f9cf88" emissive={complete ? "#ffd45c" : "#7a4314"} emissiveIntensity={complete ? 0.35 : 0.05} roughness={0.68} />
      </mesh>
      {complete ? (
        <mesh position={[0.14, 0.12, 0]} scale={[0.035, 0.08, 0.035]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#fff8d8" transparent opacity={0.75} />
        </mesh>
      ) : null}
    </group>
  );
}

function Sunberry({ index, complete, active }) {
  const mesh = useRef(null);
  const angle = (index / 8) * Math.PI * 2;

  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime + index * 0.4;
    const targetY = complete ? 0.38 + (index % 3) * 0.035 : 0.78 + Math.sin(elapsed * 1.8) * 0.08;
    mesh.current.position.x = complete ? (index % 4 - 1.5) * 0.08 : Math.cos(angle + elapsed * 0.45) * 0.45;
    mesh.current.position.z = complete ? -0.04 + Math.floor(index / 4) * 0.08 : Math.sin(angle + elapsed * 0.45) * 0.24;
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.08;
    mesh.current.rotation.y += active || complete ? 0.03 : 0.01;
  });

  return (
    <mesh ref={mesh} position={[Math.cos(angle) * 0.45, 0.76, Math.sin(angle) * 0.24]}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshStandardMaterial color="#ffb23f" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.95 : 0.32} roughness={0.38} />
    </mesh>
  );
}

function OrangeJuiceStream({ active, complete }) {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.scale.y = active || complete ? 0.9 + Math.sin(state.clock.elapsedTime * 7) * 0.08 : 0.05;
  });

  return (
    <mesh ref={mesh} position={[0.1, 0.25, 0]} scale={[0.04, active || complete ? 0.9 : 0.05, 0.04]}>
      <cylinderGeometry args={[1, 1, 1, 10]} />
      <meshBasicMaterial color="#ffb23f" transparent opacity={active || complete ? 0.74 : 0.08} depthWrite={false} />
    </mesh>
  );
}

function WindRibbon({ active, complete, color = "#fff0a8" }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += complete ? 0.026 : active ? 0.018 : 0.006;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.04;
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, index * 0.6]} scale={[1 + index * 0.18, 1 + index * 0.18, 1]}>
          <torusGeometry args={[0.42 + index * 0.1, 0.015, 8, 56, Math.PI * 1.35]} />
          <meshBasicMaterial color={color} transparent opacity={active || complete ? 0.48 - index * 0.08 : 0.16} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function BreakfastObject({ objectKey, position, active, complete }) {
  const group = useRef(null);
  usePulse(group, active, 4.2, 0.052);
  const glow = complete ? "#ffd45c" : active ? "#fff0a8" : "#ffcf6d";

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.45 + position[0]) * 0.024;
    if (complete) group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group} position={position}>
      <pointLight intensity={active || complete ? 1.3 : 0.24} color={glow} distance={2.4} />
      <HighlightRing active={active} color={glow} />
      <SparkleCluster active={active || complete} color={glow} count={complete ? 9 : 5} radius={complete ? 0.62 : 0.42} />

      {objectKey === "picnic-cloud" ? (
        <group>
          <CloudPuff position={[0, 0.22, 0]} scale={0.68} opacity={0.82} />
          <mesh position={[complete ? -0.14 : 0, complete ? 0.54 : 0.38, complete ? -0.1 : 0]} rotation={[complete ? -0.7 : 0, 0, complete ? -0.16 : 0]} scale={[0.58, 0.12, 0.44]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#fff8e6" emissive={complete ? "#fff0a8" : "#eecf82"} emissiveIntensity={complete ? 0.5 : active ? 0.22 : 0.08} roughness={0.64} />
          </mesh>
          <mesh position={[0.1, 0.43, 0.32]} scale={[0.1, 0.1, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#ffd45c" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.95 : 0.28} />
          </mesh>
        </group>
      ) : null}

      {objectKey === "cereal-cloud" ? (
        <group>
          <CloudPuff position={[0, 0.12, 0]} scale={0.55} opacity={0.72} />
          <mesh position={[0, 0.25, 0]} scale={[0.48, 0.18, 0.48]}>
            <sphereGeometry args={[1, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#f8fbff" emissive={complete ? "#fff0a8" : "#d6eefb"} emissiveIntensity={complete ? 0.5 : active ? 0.18 : 0.06} roughness={0.78} />
          </mesh>
          {Array.from({ length: 7 }, (_, index) => (
            <CerealStar key={index} index={index} complete={complete} active={active} />
          ))}
        </group>
      ) : null}

      {objectKey === "toast-boats" ? (
        <group>
          <mesh position={[0, 0.16, 0]} scale={[0.82, 0.035, 0.32]}>
            <sphereGeometry args={[1, 22, 8]} />
            <meshStandardMaterial color="#f2fbff" emissive="#d7f6ff" emissiveIntensity={active || complete ? 0.45 : 0.12} transparent opacity={0.88} roughness={0.42} />
          </mesh>
          {[0, 1, 2].map((index) => (
            <ToastBoat key={index} index={index} complete={complete} active={active} />
          ))}
        </group>
      ) : null}

      {objectKey === "orange-juice" ? (
        <group>
          <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.28, 0.28, 0.025]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffb23f" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.8 : 0.22} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.57, 0]} scale={[0.022, 0.28, 0.022]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial color="#fff8d8" />
          </mesh>
          <OrangeJuiceStream active={active} complete={complete} />
          <mesh position={[0.1, -0.17, 0]} scale={[0.18, 0.2, 0.18]}>
            <cylinderGeometry args={[0.65, 0.48, 1, 18]} />
            <meshStandardMaterial color="#fff8e6" transparent opacity={0.92} roughness={0.45} />
          </mesh>
          <mesh position={[0.1, complete ? -0.08 : -0.23, 0]} scale={[0.12, 0.06, 0.12]}>
            <cylinderGeometry args={[1, 1, 1, 16]} />
            <meshStandardMaterial color="#ffb23f" emissive="#ffd45c" emissiveIntensity={complete ? 0.8 : active ? 0.42 : 0.1} />
          </mesh>
        </group>
      ) : null}

      {objectKey === "wind-bird" ? (
        <group>
          <mesh position={[0, 0.32, 0]} scale={[0.2, 0.16, 0.18]}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshStandardMaterial color="#ffffff" emissive={complete ? "#baf6ff" : "#d7f6ff"} emissiveIntensity={complete ? 0.72 : active ? 0.34 : 0.1} roughness={0.6} />
          </mesh>
          <mesh position={[0.2, 0.32, 0]} rotation={[0, 0, -0.7]} scale={[0.08, 0.16, 0.06]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial color="#ffcf6d" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.45 : 0.12} />
          </mesh>
          <mesh position={[-0.14, 0.36, -0.05]} rotation={[0.3, 0, -0.7]} scale={[0.13, 0.05, 0.08]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#e9fbff" />
          </mesh>
          <mesh position={[0.04, 0.54, 0]} scale={[0.08, 0.06, 0.08]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {[0, 1, 2, 3].map((index) => (
            <mesh key={index} position={[-0.32 + index * 0.1, complete ? 0.28 + index * 0.04 : 0.08, 0.15]} scale={[0.035, 0.035, 0.035]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color="#d98942" emissive={complete ? "#ffd45c" : "#7a4314"} emissiveIntensity={complete ? 0.65 : 0.08} />
            </mesh>
          ))}
          {complete ? <WindRibbon active complete color="#baf6ff" /> : null}
        </group>
      ) : null}

      {objectKey === "jam-basket" ? (
        <group>
          <mesh position={[complete ? -0.24 : 0, 0.26, 0]} scale={[0.17, 0.32, 0.17]}>
            <cylinderGeometry args={[1, 0.9, 1, 18]} />
            <meshStandardMaterial color="#d43d78" emissive={active ? "#ff83c6" : "#631634"} emissiveIntensity={active ? 0.32 : 0.08} roughness={0.36} />
          </mesh>
          <mesh position={[complete ? -0.24 : 0, 0.58, 0]} scale={[0.18, 0.05, 0.18]}>
            <cylinderGeometry args={[1, 1, 1, 18]} />
            <meshStandardMaterial color="#fff0a8" roughness={0.42} />
          </mesh>
          <group position={[complete ? 0.28 : 0.04, complete ? 0.17 : 0.05, complete ? 0.03 : -0.12]} scale={complete || active ? 1 : 0.58}>
            <mesh scale={[0.22, 0.14, 0.17]}>
              <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
              <meshStandardMaterial color="#b87735" emissive={complete ? "#ffd45c" : "#6d3b12"} emissiveIntensity={complete ? 0.4 : active ? 0.16 : 0.04} roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.19, 0.025, 8, 26, Math.PI]} />
              <meshStandardMaterial color="#ffe0a0" roughness={0.58} />
            </mesh>
          </group>
        </group>
      ) : null}

      {objectKey === "sunberries" ? (
        <group>
          <mesh position={[0, 0.16, 0]} scale={[0.7, 0.08, 0.44]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ffe0a0" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.28, -0.04]} scale={[0.28, 0.12, 0.22]}>
            <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color="#b87735" emissive={complete ? "#ffd45c" : "#6d3b12"} emissiveIntensity={complete ? 0.36 : active ? 0.18 : 0.04} roughness={0.72} />
          </mesh>
          {Array.from({ length: 8 }, (_, index) => (
            <Sunberry key={index} index={index} complete={complete} active={active} />
          ))}
        </group>
      ) : null}

      {objectKey === "breeze-gate" ? (
        <group>
          <mesh position={[-0.28, 0.36, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.78, 10]} />
            <meshStandardMaterial color="#fff8d8" emissive={active || complete ? "#ffd45c" : "#9c7a34"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.1} />
          </mesh>
          <mesh position={[0.28, 0.36, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.78, 10]} />
            <meshStandardMaterial color="#fff8d8" emissive={active || complete ? "#ffd45c" : "#9c7a34"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.1} />
          </mesh>
          <mesh position={[0, 0.76, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.28, 0.035, 10, 32, Math.PI]} />
            <meshStandardMaterial color="#fff8d8" emissive={active || complete ? "#ffd45c" : "#9c7a34"} emissiveIntensity={complete ? 0.9 : active ? 0.45 : 0.1} />
          </mesh>
          <WindRibbon active={active} complete={complete} color="#fff0a8" />
        </group>
      ) : null}
    </group>
  );
}

function StarLensModel({ complete, active, dusty = false, scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.045, 14, 54]} />
        <meshStandardMaterial
          color={complete ? "#dff7ff" : "#b9c9ff"}
          emissive={complete ? "#baf6ff" : active ? "#8a8dff" : "#39406f"}
          emissiveIntensity={complete ? 1.25 : active ? 0.58 : 0.16}
          metalness={0.22}
          roughness={0.25}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.035, 42]} />
        <meshPhysicalMaterial
          color={complete ? "#e4fbff" : "#c6d1ff"}
          emissive={complete ? "#8df3ff" : "#4552aa"}
          emissiveIntensity={complete ? 0.72 : active ? 0.28 : 0.08}
          transparent
          opacity={complete ? 0.82 : 0.58}
          roughness={0.08}
          metalness={0.04}
          transmission={0.18}
        />
      </mesh>
      <mesh position={[0.28, -0.28, 0]} rotation={[0, 0, -0.78]} scale={[0.08, 0.34, 0.08]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#b7c8ff" emissive={complete ? "#baf6ff" : "#314078"} emissiveIntensity={complete ? 0.48 : 0.1} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.035]} rotation={[0, 0, 0.2]} scale={[0.09, 0.09, 0.025]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete || active ? 1.2 : 0.32} />
      </mesh>
      {dusty && !complete ? (
        <>
          <mesh position={[-0.08, 0.08, 0.07]} scale={[0.12, 0.04, 0.02]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#9aa0b0" transparent opacity={0.72} roughness={0.95} />
          </mesh>
          <mesh position={[0.1, -0.07, 0.07]} scale={[0.16, 0.05, 0.02]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#8f95a5" transparent opacity={0.68} roughness={0.95} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function TelescopeMesh({ complete, active }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const targetZ = complete ? -0.1 : -0.42;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05;
    group.current.position.y = 0.42 + Math.sin(state.clock.elapsedTime * 1.25) * (active || complete ? 0.035 : 0.015);
  });

  return (
    <group ref={group} rotation={[0, 0, -0.42]}>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.26, 0.68, 0.26]}>
        <cylinderGeometry args={[0.55, 0.42, 1, 28]} />
        <meshStandardMaterial color="#3f7dff" emissive={complete ? "#89c4ff" : active ? "#5c8cff" : "#182a6f"} emissiveIntensity={complete ? 0.8 : active ? 0.45 : 0.12} roughness={0.36} />
      </mesh>
      <mesh position={[0.58, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.31, 0.16, 0.31]}>
        <cylinderGeometry args={[0.58, 0.5, 1, 28]} />
        <meshStandardMaterial color="#baf6ff" emissive="#77e6ff" emissiveIntensity={active || complete ? 0.78 : 0.22} roughness={0.24} />
      </mesh>
      <mesh position={[-0.48, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.22, 0.14, 0.22]}>
        <cylinderGeometry args={[0.52, 0.42, 1, 20]} />
        <meshStandardMaterial color="#152966" emissive="#3f7dff" emissiveIntensity={active || complete ? 0.38 : 0.1} roughness={0.42} />
      </mesh>
      <mesh position={[0, -0.25, 0]} scale={[0.06, 0.72, 0.06]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#dce8ff" roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.62, 0]} scale={[0.42, 0.05, 0.42]}>
        <cylinderGeometry args={[1, 1, 1, 20]} />
        <meshStandardMaterial color="#9fb5f2" emissive={active || complete ? "#778dff" : "#253568"} emissiveIntensity={active || complete ? 0.36 : 0.08} />
      </mesh>
      {complete ? (
        <mesh position={[1.12, 0.52, 0]} scale={[0.14, 0.14, 0.14]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={1.65} />
        </mesh>
      ) : null}
    </group>
  );
}

function StarClockFace({ complete, active }) {
  const hand = useRef(null);

  useFrame((state) => {
    if (!hand.current) return;
    hand.current.rotation.z = complete ? -1.2 + Math.sin(state.clock.elapsedTime * 2.4) * 0.05 : Math.sin(state.clock.elapsedTime * 1.3) * 0.18;
  });

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 42]} />
        <meshStandardMaterial color="#e8efff" emissive={complete ? "#fff0a8" : active ? "#9cb7ff" : "#4d5a92"} emissiveIntensity={complete ? 0.7 : active ? 0.35 : 0.12} roughness={0.42} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.39, 0.025, 10, 48]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.8 : 0.24} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11].map((index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.sin(angle) * 0.28, Math.cos(angle) * 0.28, 0.035]} scale={[0.022, 0.022, 0.022]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={active || complete ? "#fff8d8" : "#bac4e8"} />
          </mesh>
        );
      })}
      {complete ? (
        <Html center transform distanceFactor={7} position={[-0.28, 0, 0.08]}>
          <div style={{ color: "#fff8d8", fontWeight: 1000, fontSize: "1.1rem", textShadow: "0 0 10px #ffd45c" }}>9</div>
        </Html>
      ) : (
        <mesh position={[-0.28, 0, 0.04]} scale={[0.04, 0.04, 0.04]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#6b7398" transparent opacity={0.56} />
        </mesh>
      )}
      <mesh ref={hand} position={[0, 0, 0.06]} scale={[0.035, 0.24, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#5267d8" emissive="#8a8dff" emissiveIntensity={active || complete ? 0.65 : 0.18} />
      </mesh>
    </group>
  );
}

function MagicBagMesh({ complete, active }) {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} scale={[0.38, 0.32, 0.18]}>
        <sphereGeometry args={[1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <meshStandardMaterial color="#6e54d9" emissive={active || complete ? "#8a8dff" : "#2f2767"} emissiveIntensity={complete ? 0.6 : active ? 0.32 : 0.08} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.025, 8, 28, Math.PI]} />
        <meshStandardMaterial color="#ffd0ed" emissive="#ff83c6" emissiveIntensity={active || complete ? 0.52 : 0.16} />
      </mesh>
      <mesh position={[complete ? 0.02 : -0.38, complete ? 0.48 : 0.38, 0.06]} rotation={[0.2, 0, complete ? 0.12 : -0.4]} scale={[0.18, 0.05, 0.24]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fff8d8" emissive={complete ? "#ffd45c" : "#a87934"} emissiveIntensity={complete ? 0.55 : active ? 0.2 : 0.05} roughness={0.6} />
      </mesh>
      <mesh position={[0.34, 0.42, 0.03]} rotation={[0, 0, -0.48]} scale={[0.04, 0.3, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#ffe68c" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.42 : 0.12} />
      </mesh>
      <mesh position={[0.49, 0.58, 0.03]} scale={[0.08, 0.08, 0.03]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.8 : 0.25} />
      </mesh>
      {complete ? (
        <>
          <mesh position={[-0.36, 0.34, 0]} rotation={[0, 0, 0.48]} scale={[0.18, 0.045, 0.08]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#eafcff" emissive="#baf6ff" emissiveIntensity={0.5} transparent opacity={0.82} />
          </mesh>
          <mesh position={[0.36, 0.34, 0]} rotation={[0, 0, -0.48]} scale={[0.18, 0.045, 0.08]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#eafcff" emissive="#baf6ff" emissiveIntensity={0.5} transparent opacity={0.82} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function PencilStarMesh({ complete, active }) {
  return (
    <group>
      <CloudPuff position={[complete ? -0.34 : 0.02, 0.16, 0]} scale={0.5} opacity={active || complete ? 0.62 : 0.74} />
      <mesh position={[complete ? 0.28 : -0.1, complete ? 0.64 : 0.32, 0.02]} rotation={[0, 0, -0.75]} scale={[0.045, 0.42, 0.045]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#ffe68c" emissive="#ffd45c" emissiveIntensity={complete ? 0.95 : active ? 0.48 : 0.16} />
      </mesh>
      <mesh position={[complete ? 0.44 : 0.06, complete ? 0.78 : 0.46, 0.02]} rotation={[0, 0, -0.75]} scale={[0.08, 0.12, 0.08]}>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 1.2 : active ? 0.7 : 0.25} />
      </mesh>
      <mesh position={[complete ? 0.22 : -0.16, complete ? 0.54 : 0.22, 0.02]} scale={[0.1, 0.1, 0.03]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff8d8" emissive="#ffd45c" emissiveIntensity={complete ? 1 : active ? 0.62 : 0.22} />
      </mesh>
    </group>
  );
}

function StarPathBoardMesh({ complete, active }) {
  const line = useRef(null);

  useFrame((state) => {
    if (!line.current) return;
    const target = complete ? 1 : active ? 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05 : 0.08;
    line.current.scale.x += (target - line.current.scale.x) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, 0.42, 0]} scale={[0.82, 0.48, 0.055]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#18375f" emissive={active || complete ? "#1d6d8d" : "#081b31"} emissiveIntensity={active || complete ? 0.32 : 0.1} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.17, 0]} scale={[0.9, 0.045, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d7c08c" roughness={0.58} />
      </mesh>
      {[-0.32, -0.14, 0.05, 0.24, 0.42].map((x, index) => (
        <mesh key={x} position={[x, 0.32 + Math.sin(index * 1.2) * 0.12, 0.075]} scale={[0.026, 0.026, 0.026]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={complete ? "#fff0a8" : active ? "#dff7ff" : "#7990b5"} transparent opacity={active || complete ? 0.9 : 0.55} />
        </mesh>
      ))}
      <mesh ref={line} position={[0.05, 0.42, 0.09]} rotation={[0, 0, 0.24]} scale={[complete ? 1 : 0.08, 1, 1]}>
        <boxGeometry args={[0.86, 0.025, 0.025]} />
        <meshBasicMaterial color="#fff0a8" transparent opacity={active || complete ? 0.86 : 0.18} depthWrite={false} />
      </mesh>
      <mesh position={[0.47, 0.55, 0.1]} scale={[0.07, 0.07, 0.03]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 1 : 0.35} />
      </mesh>
    </group>
  );
}

function LensBeam({ active }) {
  const beam = useRef(null);

  useFrame((state) => {
    if (!beam.current) return;
    beam.current.material.opacity = active ? 0.32 + Math.sin(state.clock.elapsedTime * 4) * 0.06 : 0;
  });

  return (
    <mesh ref={beam} position={[0.08, 0.78, -0.28]} rotation={[0.88, 0, -0.3]} scale={[0.14, 1.6, 0.14]}>
      <coneGeometry args={[1, 1, 28, 1, true]} />
      <meshBasicMaterial color="#baf6ff" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function MusicSignal({ active }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.018;
    group.current.position.y = 0.74 + Math.sin(state.clock.elapsedTime * 1.7) * 0.05;
  });

  if (!active) return null;

  return (
    <group ref={group} position={[0, 0.74, 0]}>
      <mesh position={[0, 0.1, 0]} scale={[0.045, 0.46, 0.045]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#ff83c6" emissive="#ffd0ed" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0.2, 0.28, 0]} scale={[0.18, 0.04, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff83c6" emissive="#ffd0ed" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.02, -0.18, 0]} scale={[0.14, 0.1, 0.08]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={0.95} />
      </mesh>
      <WindRibbon active complete color="#ffb8df" />
    </group>
  );
}

function StarClueMesh({ complete, active }) {
  return (
    <group>
      <mesh position={[0, 0.56, 0]} scale={[0.16, 0.16, 0.05]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 1.3 : 0.42} />
      </mesh>
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.24, 0.24, 0.24]}>
        <torusGeometry args={[0.62, 0.035, 8, 28]} />
        <meshBasicMaterial color="#fff8d8" transparent opacity={active || complete ? 0.54 : 0.2} depthWrite={false} />
      </mesh>
      <MusicSignal active={complete} />
    </group>
  );
}

function ObservatoryDomeObject({ complete, active }) {
  const roof = useRef(null);

  useFrame((state) => {
    if (!roof.current) return;
    const targetY = complete ? 0.82 : 0.48;
    const targetScale = complete ? 0.82 : 1;
    roof.current.position.y += (targetY - roof.current.position.y) * 0.06;
    roof.current.scale.setScalar(roof.current.scale.x + (targetScale - roof.current.scale.x) * 0.06);
    roof.current.rotation.y += complete ? 0.01 : active ? 0.004 : 0.001;
  });

  return (
    <group>
      <mesh ref={roof} position={[0, 0.48, 0]} scale={[1, 1, 1]}>
        <sphereGeometry args={[0.48, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.54]} />
        <meshPhysicalMaterial
          color="#dff7ff"
          emissive={complete ? "#baf6ff" : active ? "#6f84ff" : "#263a73"}
          emissiveIntensity={complete ? 0.5 : active ? 0.28 : 0.08}
          transparent
          opacity={complete ? 0.34 : 0.72}
          roughness={0.06}
          transmission={0.28}
        />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} position={[0, complete ? 0.64 : 0.42, 0]} rotation={[complete ? 0.68 : 0.12, 0, index * (Math.PI / 2)]}>
          <torusGeometry args={[0.38, 0.014, 8, 30, Math.PI]} />
          <meshBasicMaterial color="#dff7ff" transparent opacity={complete ? 0.52 : 0.38} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0.16, complete ? 0.75 : 0.6, 0.32]} scale={[0.08, 0.08, 0.02]}>
        <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.8 : 0.28} />
      </mesh>
      {complete ? <SparkleCluster active color="#fff8d8" count={12} radius={0.7} /> : null}
    </group>
  );
}

function SchoolStarObject({ objectKey, position, active, complete }) {
  const group = useRef(null);
  usePulse(group, active, 4.4, 0.046);
  const glow = complete ? "#ffd45c" : active ? "#fff0a8" : "#aebdff";

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.32 + position[0]) * 0.024;
    if (complete && objectKey !== "observatory-dome") group.current.rotation.y += 0.0045;
  });

  return (
    <group ref={group} position={position}>
      <pointLight intensity={active || complete ? 1.4 : 0.28} color={glow} distance={2.55} />
      <HighlightRing active={active} color={glow} />
      <SparkleCluster active={active || complete} color={glow} count={complete ? 10 : 5} radius={complete ? 0.62 : 0.42} />

      {objectKey === "observatory-dome" ? <ObservatoryDomeObject complete={complete} active={active} /> : null}
      {objectKey === "blue-telescope" ? <TelescopeMesh complete={complete} active={active} /> : null}
      {objectKey === "star-clock" ? <StarClockFace complete={complete} active={active} /> : null}
      {objectKey === "magic-bag" ? <MagicBagMesh complete={complete} active={active} /> : null}
      {objectKey === "pencil-star" ? <PencilStarMesh complete={complete} active={active} /> : null}
      {objectKey === "star-path-board" ? <StarPathBoardMesh complete={complete} active={active} /> : null}
      {objectKey === "star-map-lens" ? (
        <group>
          <StarLensModel complete={complete} active={active} dusty scale={1} />
          <LensBeam active={complete} />
        </group>
      ) : null}
      {objectKey === "star-clue" ? <StarClueMesh complete={complete} active={active} /> : null}
    </group>
  );
}

function ConstellationTwinkles() {
  const sparkles = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const row = Math.floor(index / 7);
    const column = index % 7;
    return {
      x: -3.1 + column * 1.02 + Math.sin(index * 1.7) * 0.16,
      y: 1.35 + row * 0.42 + Math.cos(index * 0.9) * 0.12,
      z: -2.2 - row * 0.28,
      phase: index * 0.41,
      speed: 0.72 + (index % 5) * 0.11,
      scale: 0.025 + (index % 4) * 0.006,
      float: 0.08 + (index % 3) * 0.035
    };
  }), []);

  return sparkles.map((sparkle) => (
    <MagicSparkle key={sparkle.phase} sparkle={sparkle} color={sparkle.phase % 2 ? "#dff7ff" : "#fff0a8"} active />
  ));
}

function SchoolStarObservatoryScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  const objectPositions = {
    "observatory-dome": [-1.72, 0.54, 0.22],
    "blue-telescope": [-0.86, 0.46, -0.35],
    "star-clock": [-0.1, 0.9, 0.76],
    "magic-bag": [0.72, 0.38, -0.58],
    "pencil-star": [1.32, 0.34, 0.32],
    "star-path-board": [0.1, 0.62, -1.04],
    "star-map-lens": [1.92, 0.42, -0.24],
    "star-clue": [2.54, 0.86, 0.56]
  };

  return (
    <>
      <ConstellationTwinkles />
      <FloatingClouds voiceActivity={voiceActivity} />
      <group position={[0, -0.52, 0]} rotation={[0, -0.08, 0]}>
        <CloudPuff position={[-1.9, -0.03, 0.82]} scale={1.12} opacity={0.38} />
        <CloudPuff position={[1.8, -0.06, -0.88]} scale={1.08} opacity={0.34} />
        <CloudPuff position={[2.8, -0.02, 0.92]} scale={0.76} opacity={0.36} />
        <mesh receiveShadow scale={[2.92, 0.32, 1.52]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#2e397d" emissive="#5761c9" emissiveIntensity={0.18 + completed.size * 0.012} roughness={0.7} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.94, 1.1, 1]}>
          <torusGeometry args={[0.68, 0.034, 8, 52]} />
          <meshBasicMaterial color="#baf6ff" transparent opacity={0.38} depthWrite={false} />
        </mesh>
        <mesh position={[-1.72, 0.37, 0.22]} scale={[0.98, 0.08, 0.98]}>
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial color="#eef8ff" emissive="#8a8dff" emissiveIntensity={0.18} roughness={0.42} />
        </mesh>
        <mesh position={[0.05, 0.28, -1.03]} scale={[1.2, 0.035, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d7c08c" emissive={completed.has("draw-the-star-path") ? "#ffd45c" : "#6d5f34"} emissiveIntensity={completed.has("draw-the-star-path") ? 0.42 : 0.08} />
        </mesh>
        <mesh position={[2.92, 0.23, 0.95]} scale={[0.78, 0.1, 0.24]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#dff7ff" emissive="#baf6ff" emissiveIntensity={completed.has("read-the-star-clue") ? 0.8 : 0.12} roughness={0.38} />
        </mesh>
        {completed.has("read-the-star-clue") ? (
          <group position={[2.2, 0.74, 0.92]} scale={1.2}>
            <MusicSignal active />
            <SparkleCluster active color="#ffb8df" count={12} radius={0.84} />
          </group>
        ) : null}
        {level.tasks.map((task) => (
          <SchoolStarObject
            key={task.id}
            objectKey={task.objectKey}
            position={objectPositions[task.objectKey] || [0, 0.26, 0]}
            active={activeTask?.id === task.id}
            complete={completed.has(task.id)}
          />
        ))}
      </group>
      {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
    </>
  );
}

function MusicNote({ note, color = "#fff0a8", active = true }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime + note.phase;
    group.current.position.set(
      note.x + Math.sin(elapsed * 0.9) * note.sway,
      note.y + Math.sin(elapsed * note.speed) * note.float,
      note.z + Math.cos(elapsed * 0.8) * note.sway
    );
    group.current.rotation.z = note.tilt + Math.sin(elapsed * 1.4) * 0.16;
    group.current.scale.setScalar(note.scale * (active ? 1 + Math.sin(elapsed * 2.2) * 0.08 : 0.74));
  });

  return (
    <group ref={group} position={[note.x, note.y, note.z]} scale={note.scale} rotation={[0, 0, note.tilt]}>
      <mesh position={[0, -0.1, 0]} scale={[0.11, 0.08, 0.05]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.9 : 0.18} transparent opacity={active ? 0.88 : 0.34} />
      </mesh>
      <mesh position={[0.08, 0.13, 0]} scale={[0.025, 0.42, 0.025]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.72 : 0.16} transparent opacity={active ? 0.9 : 0.32} />
      </mesh>
      <mesh position={[0.2, 0.3, 0]} scale={[0.18, 0.035, 0.025]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.72 : 0.16} transparent opacity={active ? 0.86 : 0.32} />
      </mesh>
    </group>
  );
}

function MusicNotes({ active, color = "#fff0a8", count = 12, radius = 1.2 }) {
  const notes = useMemo(() => Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius * (0.56 + (index % 4) * 0.11),
      y: 0.56 + (index % 5) * 0.18,
      z: Math.sin(angle) * radius * 0.55,
      phase: index * 0.58,
      speed: 1.2 + (index % 5) * 0.16,
      scale: 0.7 + (index % 3) * 0.12,
      float: 0.06 + (index % 4) * 0.025,
      sway: 0.04 + (index % 3) * 0.02,
      tilt: index % 2 ? -0.16 : 0.18
    };
  }), [count, radius]);

  if (!active) return null;
  return notes.map((note) => (
    <MusicNote key={note.phase} note={note} color={color} active={active} />
  ));
}

function SoundRipple({ active, color = "#baf6ff", offset = 0 }) {
  const mesh = useRef(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const pulse = active ? (state.clock.elapsedTime * 0.72 + offset) % 1 : 0;
    mesh.current.scale.setScalar(0.55 + pulse * 1.15);
    mesh.current.material.opacity = active ? 0.5 * (1 - pulse) : 0;
  });

  if (!active) return null;
  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.52, 0.014, 8, 56]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
    </mesh>
  );
}

function RhythmConfetti({ active, color = "#ffd0ed", count = 14, radius = 0.72 }) {
  const confetti = useMemo(() => Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius * (0.35 + (index % 4) * 0.12),
      y: 0.28 + (index % 5) * 0.11,
      z: Math.sin(angle) * radius * 0.5,
      phase: index * 0.37,
      scale: 0.035 + (index % 3) * 0.012
    };
  }), [count, radius]);

  if (!active) return null;
  return confetti.map((piece) => (
    <MagicSparkle key={piece.phase} sparkle={{ ...piece, speed: 1.3, float: 0.12 }} color={piece.phase % 2 ? color : "#fff0a8"} active />
  ));
}

function BouncingSpeaker({ position, active, side = 1 }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime + side;
    group.current.position.y = position[1] + Math.sin(elapsed * (active ? 3.1 : 1.1)) * (active ? 0.055 : 0.018);
    group.current.rotation.z = Math.sin(elapsed * 1.5) * 0.035 * side;
  });

  return (
    <group ref={group} position={position}>
      <mesh scale={[0.3, 0.52, 0.24]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4c4b92" emissive={active ? "#7b68ff" : "#151942"} emissiveIntensity={active ? 0.42 : 0.12} roughness={0.55} />
      </mesh>
      {[0.18, -0.16].map((y, index) => (
        <mesh key={y} position={[0, y, 0.13]} rotation={[Math.PI / 2, 0, 0]} scale={[index ? 0.16 : 0.2, index ? 0.16 : 0.2, 0.06]}>
          <cylinderGeometry args={[1, 1, 1, 24]} />
          <meshStandardMaterial color="#2de0d4" emissive="#74fff6" emissiveIntensity={active ? 0.8 : 0.18} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function StageLightBulb({ index, active, complete }) {
  const bulb = useRef(null);
  const beam = useRef(null);
  const lit = complete || active;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime + index * 0.35;
    if (bulb.current) {
      const pop = lit ? 1 + Math.max(0, Math.sin(elapsed * 3.4)) * 0.08 : 0.86;
      bulb.current.scale.setScalar(pop);
    }
    if (beam.current) {
      beam.current.material.opacity = lit ? 0.18 + Math.max(0, Math.sin(elapsed * 2.6)) * 0.08 : 0.02;
      beam.current.rotation.z = (index - 1.5) * 0.16 + Math.sin(elapsed * 1.2) * 0.06;
    }
  });

  const x = (index - 1.5) * 0.42;
  const colors = ["#fff0a8", "#ffd0ed", "#74fff6", "#ffd45c"];
  const color = colors[index % colors.length];

  return (
    <group position={[x, 0, 0]}>
      <mesh ref={bulb} position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <cylinderGeometry args={[0.12, 0.16, 0.16, 16]} />
        <meshStandardMaterial color={lit ? color : "#d5d6ea"} emissive={color} emissiveIntensity={lit ? 1 : 0.1} roughness={0.36} />
      </mesh>
      <mesh ref={beam} position={[0, -0.34, 0]} rotation={[0.42, 0, 0]} scale={[0.11, 0.86, 0.11]}>
        <coneGeometry args={[1, 1, 18, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

function StageLightsMesh({ complete, active }) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} scale={[1.1, 0.045, 0.045]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#5a4aa8" emissive={active || complete ? "#ff83c6" : "#1c1646"} emissiveIntensity={active || complete ? 0.32 : 0.08} />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <StageLightBulb key={index} index={index} active={active} complete={complete} />
      ))}
    </group>
  );
}

function MicrophoneMesh({ complete, active }) {
  const head = useRef(null);

  useFrame((state) => {
    if (!head.current) return;
    head.current.rotation.y += complete ? 0.012 : active ? 0.006 : 0.002;
    head.current.position.y = 0.64 + Math.sin(state.clock.elapsedTime * 1.7) * (active || complete ? 0.04 : 0.012);
  });

  return (
    <group>
      <SoundRipple active={complete} color="#74fff6" offset={0.18} />
      <SoundRipple active={complete} color="#ffd0ed" offset={0.58} />
      <mesh position={[0, 0.28, 0]} scale={[0.035, 0.56, 0.035]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#dff7ff" emissive={active || complete ? "#74fff6" : "#4f6280"} emissiveIntensity={active || complete ? 0.42 : 0.08} />
      </mesh>
      <mesh position={[0, 0.02, 0]} scale={[0.32, 0.045, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#5a4aa8" emissive="#ff83c6" emissiveIntensity={active || complete ? 0.32 : 0.08} />
      </mesh>
      <mesh ref={head} position={[0, 0.64, 0]} scale={[0.2, 0.28, 0.2]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color={complete ? "#74fff6" : "#d9d9ff"} emissive={complete ? "#74fff6" : active ? "#ffd0ed" : "#4d5480"} emissiveIntensity={complete ? 1.1 : active ? 0.62 : 0.16} roughness={0.28} />
      </mesh>
      <mesh position={[-0.07, 0.68, 0.18]} rotation={[0, 0, complete ? 0 : 0.4]} scale={[0.042, 0.012, 0.012]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#30345f" />
      </mesh>
      <mesh position={[0.07, 0.68, 0.18]} rotation={[0, 0, complete ? 0 : -0.4]} scale={[0.042, 0.012, 0.012]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#30345f" />
      </mesh>
      {complete ? (
        <mesh position={[0, 0.57, 0.19]} scale={[0.07, 0.018, 0.014]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#30345f" />
        </mesh>
      ) : null}
    </group>
  );
}

function RhythmPad({ index, active, complete }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    const beat = active || complete ? Math.max(0, Math.sin(elapsed * 4.2 - index * 0.72)) : 0;
    group.current.position.y = 0.06 + beat * 0.1;
    group.current.scale.y = 1 + beat * 0.22;
  });

  const colors = ["#74fff6", "#ffd0ed", "#fff0a8"];

  return (
    <group ref={group} position={[(index - 1) * 0.34, 0.06, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.22, 0.22, 0.06]}>
        <cylinderGeometry args={[1, 1, 1, 26]} />
        <meshStandardMaterial color={colors[index]} emissive={colors[index]} emissiveIntensity={active || complete ? 0.82 : 0.2} roughness={0.42} />
      </mesh>
    </group>
  );
}

function RhythmPadsMesh({ complete, active }) {
  return (
    <group>
      {[0, 1, 2].map((index) => (
        <RhythmPad key={index} index={index} active={active} complete={complete} />
      ))}
      <SoundRipple active={complete} color="#fff0a8" offset={0.3} />
    </group>
  );
}

function GuitarCloudMesh({ complete, active }) {
  const guitar = useRef(null);

  useFrame((state) => {
    if (!guitar.current) return;
    guitar.current.rotation.z = -0.24 + Math.sin(state.clock.elapsedTime * (complete ? 4.4 : 1.2)) * (complete ? 0.08 : 0.025);
    guitar.current.position.x = complete ? 0.1 : -0.1;
  });

  return (
    <group>
      <mesh position={[complete ? -0.48 : -0.18, 0.52, 0]} rotation={[0, 0, 0.14]} scale={[0.18, 0.68, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d86eb8" emissive={active || complete ? "#ff83c6" : "#481a56"} emissiveIntensity={active || complete ? 0.42 : 0.1} />
      </mesh>
      <mesh position={[complete ? 0.48 : 0.18, 0.52, 0]} rotation={[0, 0, -0.14]} scale={[0.18, 0.68, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d86eb8" emissive={active || complete ? "#ff83c6" : "#481a56"} emissiveIntensity={active || complete ? 0.42 : 0.1} />
      </mesh>
      <group ref={guitar} position={[0, 0.38, 0.06]} rotation={[0, 0, -0.24]}>
        <CloudPuff position={[-0.12, 0, 0]} scale={0.42} opacity={0.78} />
        <mesh position={[0.08, 0.05, 0.03]} scale={[0.2, 0.24, 0.06]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color="#f6fbff" emissive={complete ? "#fff0a8" : active ? "#ffd0ed" : "#bac8df"} emissiveIntensity={complete ? 0.65 : active ? 0.32 : 0.08} roughness={0.62} />
        </mesh>
        <mesh position={[0.38, 0.17, 0.03]} rotation={[0, 0, -0.75]} scale={[0.06, 0.54, 0.04]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshStandardMaterial color="#ffe4a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.4 : 0.08} />
        </mesh>
        {[-0.04, 0.02, 0.08].map((y) => (
          <mesh key={y} position={[0.18, y, 0.1]} rotation={[0, 0, -0.75]} scale={[0.008, 0.62, 0.008]}>
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshBasicMaterial color="#74fff6" transparent opacity={active || complete ? 0.82 : 0.28} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ThunderPuffMesh({ complete, active }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.x += ((complete ? 0.22 : -0.2) - group.current.position.x) * 0.05;
    group.current.position.y = 0.24 + Math.sin(state.clock.elapsedTime * 1.8) * (active || complete ? 0.045 : 0.015);
  });

  return (
    <group ref={group} position={[-0.2, 0.24, 0]}>
      <CloudPuff position={[0, 0, 0]} scale={0.52} opacity={0.86} />
      <mesh position={[0, 0.02, 0]} scale={[0.38, 0.28, 0.26]}>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color="#b180ff" emissive={complete ? "#ffd0ed" : active ? "#b180ff" : "#3e2b67"} emissiveIntensity={complete ? 0.78 : active ? 0.45 : 0.12} roughness={0.64} />
      </mesh>
      <mesh position={[-0.08, 0.1, 0.24]} scale={[0.025, 0.025, 0.025]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#2a244c" />
      </mesh>
      <mesh position={[0.08, 0.1, 0.24]} scale={[0.025, 0.025, 0.025]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#2a244c" />
      </mesh>
      {complete ? (
        <mesh position={[0, 0.02, 0.25]} scale={[0.08, 0.018, 0.014]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#2a244c" />
        </mesh>
      ) : null}
      <mesh position={[0.17, -0.1, 0.06]} rotation={[0, 0, -0.2]} scale={[0.08, 0.18, 0.035]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.9 : 0.24} />
      </mesh>
    </group>
  );
}

function CurtainStarMesh({ complete, active }) {
  const star = useRef(null);

  useFrame((state) => {
    if (!star.current) return;
    star.current.rotation.y += complete ? 0.035 : active ? 0.018 : 0.006;
    star.current.position.y = 0.52 + Math.sin(state.clock.elapsedTime * 2.1) * (active || complete ? 0.06 : 0.018);
  });

  return (
    <group>
      <mesh ref={star} position={[0, 0.52, 0]} scale={[0.18, 0.18, 0.07]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 1.6 : active ? 1 : 0.36} />
      </mesh>
      <RhythmConfetti active={complete} color="#ffd0ed" count={18} radius={0.86} />
    </group>
  );
}

function ThunderDrumModel({ complete, active, scale = 1 }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const beat = active || complete ? Math.max(0, Math.sin(state.clock.elapsedTime * 4.8)) : 0;
    group.current.scale.setScalar(scale * (1 + beat * 0.045));
    group.current.rotation.y += complete ? 0.01 : active ? 0.004 : 0.001;
  });

  return (
    <group ref={group} scale={scale}>
      <SoundRipple active={complete} color="#b180ff" offset={0.1} />
      <SoundRipple active={complete} color="#fff0a8" offset={0.45} />
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.44, 0.44, 0.22]}>
        <cylinderGeometry args={[1, 1, 1, 36]} />
        <meshStandardMaterial color="#b180ff" emissive={active || complete ? "#ff83c6" : "#3a2658"} emissiveIntensity={complete ? 0.82 : active ? 0.5 : 0.12} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 0.4, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 36]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 0.95 : active ? 0.5 : 0.14} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]} scale={[0.4, 0.4, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 36]} />
        <meshStandardMaterial color="#ffd0ed" emissive="#ff83c6" emissiveIntensity={complete ? 0.72 : active ? 0.36 : 0.1} roughness={0.36} />
      </mesh>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.04, 0.3]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]} scale={[0.05, 0.2, 0.03]}>
          <coneGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="#74fff6" emissive="#74fff6" emissiveIntensity={active || complete ? 0.8 : 0.2} />
        </mesh>
      ))}
      <CloudPuff position={[0, -0.42, 0]} scale={0.42} opacity={0.64} />
    </group>
  );
}

function MusicalWindGateMesh({ complete, active }) {
  return (
    <group>
      <mesh position={[-0.32, 0.34, 0]} scale={[0.07, 0.68, 0.07]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#74fff6" emissive="#74fff6" emissiveIntensity={active || complete ? 0.64 : 0.16} roughness={0.34} />
      </mesh>
      <mesh position={[0.32, 0.34, 0]} scale={[0.07, 0.68, 0.07]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#ffd0ed" emissive="#ff83c6" emissiveIntensity={active || complete ? 0.64 : 0.16} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI]} scale={[1, 1, 1]}>
        <torusGeometry args={[0.34, 0.04, 12, 40, Math.PI]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.82 : 0.2} />
      </mesh>
      <WindRibbon active={active || complete} complete={complete} color={complete ? "#74fff6" : "#fff0a8"} />
      <MusicNotes active={complete} color="#fff0a8" count={8} radius={0.72} />
    </group>
  );
}

function RhythmObject({ objectKey, position, active, complete }) {
  const group = useRef(null);
  usePulse(group, active, 4.6, 0.048);
  const glow = complete ? "#ffd45c" : active ? "#fff0a8" : "#ff83c6";

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.48 + position[0]) * 0.024;
    if (complete && objectKey !== "rhythm-pads") group.current.rotation.y += 0.0045;
  });

  return (
    <group ref={group} position={position}>
      <ActiveObjectAura active={active} complete={complete} color={glow} intensity={1.45} distance={2.5} />
      {objectKey === "stage-lights" ? <StageLightsMesh complete={complete} active={active} /> : null}
      {objectKey === "glowing-microphone" ? <MicrophoneMesh complete={complete} active={active} /> : null}
      {objectKey === "rhythm-pads" ? <RhythmPadsMesh complete={complete} active={active} /> : null}
      {objectKey === "guitar-cloud" ? <GuitarCloudMesh complete={complete} active={active} /> : null}
      {objectKey === "thunder-puff" ? <ThunderPuffMesh complete={complete} active={active} /> : null}
      {objectKey === "curtain-star" ? <CurtainStarMesh complete={complete} active={active} /> : null}
      {objectKey === "thunder-drum" ? <ThunderDrumModel complete={complete} active={active} /> : null}
      {objectKey === "musical-wind-gate" ? <MusicalWindGateMesh complete={complete} active={active} /> : null}
    </group>
  );
}

function RhythmCloudStageScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  const objectPositions = {
    "stage-lights": [-1.78, 1.04, -0.86],
    "glowing-microphone": [-0.82, 0.34, 0.1],
    "rhythm-pads": [-0.04, 0.24, 0.82],
    "guitar-cloud": [0.78, 0.44, -0.78],
    "thunder-puff": [1.36, 0.36, 0.3],
    "curtain-star": [0.12, 1.12, -1.02],
    "thunder-drum": [1.96, 0.38, -0.3],
    "musical-wind-gate": [2.76, 0.5, 0.84]
  };
  const stageAwake = completed.size > 0 || voiceActivity === "listening" || voiceActivity === "fallback";

  return (
    <>
      <FloatingClouds voiceActivity={voiceActivity} />
      <group position={[0, -0.5, 0]} rotation={[0, -0.1, 0]}>
        <CloudPuff position={[-1.8, -0.04, 0.92]} scale={1.2} opacity={0.52} />
        <CloudPuff position={[1.65, -0.07, -0.95]} scale={1.12} opacity={0.5} />
        <CloudPuff position={[2.78, -0.02, 0.92]} scale={0.78} opacity={0.48} />
        <mesh receiveShadow scale={[2.9, 0.3, 1.52]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#9b68f0" emissive="#ff83c6" emissiveIntensity={0.12 + completed.size * 0.014} roughness={0.72} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.95, 1.08, 1]}>
          <torusGeometry args={[0.66, 0.034, 8, 52]} />
          <meshBasicMaterial color="#ffd0ed" transparent opacity={0.46} depthWrite={false} />
        </mesh>
        <mesh position={[0.05, 0.29, 0.04]} scale={[1.78, 0.06, 0.88]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5947b4" emissive={stageAwake ? "#ff83c6" : "#22195d"} emissiveIntensity={stageAwake ? 0.28 : 0.08} roughness={0.54} />
        </mesh>
        <mesh position={[0.05, 0.35, 0.04]} scale={[1.68, 0.018, 0.78]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#2de0d4" emissive="#74fff6" emissiveIntensity={stageAwake ? 0.32 : 0.08} transparent opacity={0.82} />
        </mesh>
        <mesh position={[0.02, 0.82, -1.08]} scale={[1.72, 0.05, 0.05]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={completed.has("turn-on-the-stage-lights") ? 0.72 : 0.16} />
        </mesh>
        <mesh position={[-0.88, 0.56, -1.04]} rotation={[0, 0, 0.08]} scale={[0.2, 0.76, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d86eb8" emissive="#ff83c6" emissiveIntensity={completed.has("find-the-guitar-cloud") ? 0.42 : 0.14} />
        </mesh>
        <mesh position={[0.88, 0.56, -1.04]} rotation={[0, 0, -0.08]} scale={[0.2, 0.76, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d86eb8" emissive="#ff83c6" emissiveIntensity={completed.has("find-the-guitar-cloud") ? 0.42 : 0.14} />
        </mesh>
        <BouncingSpeaker position={[-2.02, 0.55, 0.38]} active={stageAwake} side={-1} />
        <BouncingSpeaker position={[2.02, 0.55, 0.38]} active={stageAwake} side={1} />
        <MusicNotes active={stageAwake} color="#fff0a8" count={14} radius={1.48} />
        <RhythmConfetti active={completed.has("start-the-tiny-show")} color="#ffd0ed" count={18} radius={1.08} />
        {completed.has("play-the-thunder-drum") ? (
          <group position={[2.16, 0.56, 0.2]} scale={1.15}>
            <SoundRipple active color="#b180ff" offset={0.12} />
            <SoundRipple active color="#74fff6" offset={0.52} />
          </group>
        ) : null}
        {completed.has("sing-to-the-wind-gate") ? (
          <group position={[2.28, 0.72, 0.88]} scale={1.2}>
            <MusicNotes active color="#fff0a8" count={12} radius={0.82} />
            <SparkleCluster active color="#74fff6" count={12} radius={0.88} />
          </group>
        ) : null}
        {level.tasks.map((task) => (
          <RhythmObject
            key={task.id}
            objectKey={task.objectKey}
            position={objectPositions[task.objectKey] || [0, 0.26, 0]}
            active={activeTask?.id === task.id}
            complete={completed.has(task.id)}
          />
        ))}
      </group>
      {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
    </>
  );
}

function RedBusTicketModel({ complete, active, scale = 1 }) {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    const lively = active || complete;
    group.current.rotation.y += complete ? 0.012 : active ? 0.006 : 0.001;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.8) * (lively ? 0.035 : 0.01);
  });

  return (
    <group ref={group} scale={scale}>
      <mesh rotation={[0, 0, -0.04]} scale={[0.56, 0.32, 0.035]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8424f" emissive={active || complete ? "#ff6b6b" : "#6d1e24"} emissiveIntensity={complete ? 0.82 : active ? 0.46 : 0.12} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[0, 0, -0.04]} scale={[0.42, 0.08, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fff6df" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.34 : 0.08} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.01, 0.07]} rotation={[0, 0, 0.2]} scale={[0.085, 0.085, 0.03]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 1.25 : active ? 0.72 : 0.28} />
      </mesh>
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0, 0.06]} scale={[0.04, 0.04, 0.02]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#ffe6c6" emissive="#ffd45c" emissiveIntensity={complete ? 0.36 : 0.08} />
        </mesh>
      ))}
    </group>
  );
}

function LondonWindowMesh({ complete, active }) {
  return (
    <group>
      <mesh scale={[0.54, 0.54, 0.06]}>
        <torusGeometry args={[1, 0.08, 14, 52]} />
        <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#8e9daa"} emissiveIntensity={complete ? 0.54 : active ? 0.34 : 0.1} roughness={0.38} />
      </mesh>
      <mesh scale={[0.46, 0.46, 0.025]}>
        <cylinderGeometry args={[1, 1, 1, 36]} />
        <meshStandardMaterial color={complete ? "#9ddcff" : "#d9e1e8"} emissive={complete ? "#baf6ff" : active ? "#cfe3ee" : "#6f7f8c"} emissiveIntensity={complete ? 0.5 : active ? 0.18 : 0.06} transparent opacity={complete ? 0.72 : 0.88} roughness={0.32} />
      </mesh>
      {[-0.22, -0.06, 0.1, 0.26].map((x, index) => (
        <mesh key={x} position={[x, -0.12 + index * 0.04, 0.05]} scale={[0.08, 0.2 + index * 0.05, 0.035]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5d6d86" emissive={complete ? "#ffd45c" : "#4d596a"} emissiveIntensity={complete ? 0.24 : 0.04} transparent opacity={complete ? 0.86 : 0.24} />
        </mesh>
      ))}
      {!complete ? (
        <>
          <CloudPuff position={[-0.06, 0.02, 0.08]} scale={0.5} opacity={active ? 0.58 : 0.72} />
          <CloudPuff position={[0.18, -0.08, 0.1]} scale={0.36} opacity={active ? 0.5 : 0.66} />
        </>
      ) : (
        <SparkleCluster active color="#fff0a8" count={9} radius={0.48} />
      )}
    </group>
  );
}

function BigBenTowerMesh({ complete, active }) {
  const hand = useRef(null);

  useFrame((state) => {
    if (!hand.current) return;
    hand.current.rotation.z = complete ? state.clock.elapsedTime * 2.1 : Math.sin(state.clock.elapsedTime * 1.2) * 0.18;
  });

  return (
    <group>
      <mesh position={[0, 0.26, 0]} scale={[0.24, 0.54, 0.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d9d0bc" emissive={active || complete ? "#ffd45c" : "#83796a"} emissiveIntensity={complete ? 0.36 : active ? 0.2 : 0.06} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.78, 0]} scale={[0.2, 0.22, 0.16]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#b7a77e" emissive={complete ? "#ffd45c" : "#6e633f"} emissiveIntensity={complete ? 0.34 : 0.08} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.48, 0.12]} scale={[0.16, 0.16, 0.025]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#fff0a8" : "#8b846e"} emissiveIntensity={complete ? 0.6 : active ? 0.34 : 0.08} roughness={0.32} />
      </mesh>
      <mesh ref={hand} position={[0, 0.48, 0.15]} scale={[0.018, 0.13, 0.018]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4a3f3d" />
      </mesh>
      <mesh position={[0.05, 0.5, 0.16]} rotation={[0, 0, complete ? -0.7 : 0.2]} scale={[0.014, 0.08, 0.014]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4a3f3d" />
      </mesh>
      {!complete ? (
        <>
          <mesh position={[-0.05, 0.54, 0.16]} rotation={[0, 0, 0.35]} scale={[0.04, 0.01, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#4a3f3d" />
          </mesh>
          <mesh position={[0.05, 0.54, 0.16]} rotation={[0, 0, -0.35]} scale={[0.04, 0.01, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#4a3f3d" />
          </mesh>
        </>
      ) : (
        <SoundRipple active color="#ffd45c" offset={0.22} />
      )}
      {[-0.08, 0.08].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.12]} scale={[0.04, 0.08, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#92d7ff" emissive="#baf6ff" emissiveIntensity={complete ? 0.28 : 0.06} />
        </mesh>
      ))}
    </group>
  );
}

function RedBusCloudMesh({ complete, active }) {
  const bus = useRef(null);

  useFrame((state) => {
    if (!bus.current) return;
    bus.current.position.x = complete ? 0.12 + Math.sin(state.clock.elapsedTime * 1.8) * 0.025 : 0;
    bus.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 1.4) * (active || complete ? 0.035 : 0.012);
  });

  return (
    <group ref={bus} position={[0, 0.3, 0]}>
      <CloudPuff position={[0, -0.18, -0.02]} scale={0.58} opacity={0.62} />
      <mesh position={[0, 0.02, 0]} scale={[0.62, 0.22, 0.18]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8424f" emissive={active || complete ? "#ff6b6b" : "#6d1e24"} emissiveIntensity={complete ? 0.52 : active ? 0.3 : 0.08} roughness={0.48} />
      </mesh>
      <mesh position={[-0.08, 0.18, 0]} scale={[0.36, 0.2, 0.16]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f24f58" emissive={active || complete ? "#ff6b6b" : "#6d1e24"} emissiveIntensity={complete ? 0.45 : active ? 0.24 : 0.07} roughness={0.5} />
      </mesh>
      {[-0.26, -0.06, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.1]} scale={[0.08, 0.07, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#dff7ff" emissive="#baf6ff" emissiveIntensity={active || complete ? 0.42 : 0.1} roughness={0.3} />
        </mesh>
      ))}
      <CloudPuff position={[-0.26, -0.16, 0.08]} scale={0.2} opacity={0.9} />
      {complete ? (
        <CloudPuff position={[0.28, -0.16, 0.08]} scale={0.2} opacity={0.9} />
      ) : (
        <mesh position={[0.28, -0.16, 0.08]} scale={[0.13, 0.13, 0.02]}>
          <torusGeometry args={[1, 0.12, 8, 24]} />
          <meshBasicMaterial color="#d5dde4" transparent opacity={active ? 0.45 : 0.2} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function TicketBoothMesh({ complete, active }) {
  return (
    <group>
      {!complete ? <WindRibbon active={active} complete={false} color="#d9e8ef" /> : null}
      <mesh position={[0, 0.28, 0]} scale={[0.34, 0.46, 0.22]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#9b8760"} emissiveIntensity={complete ? 0.36 : active ? 0.2 : 0.06} roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.55, 0]} scale={[0.42, 0.08, 0.27]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8424f" emissive={complete ? "#ff6b6b" : "#7d2528"} emissiveIntensity={complete ? 0.54 : active ? 0.26 : 0.08} roughness={0.5} />
      </mesh>
      <mesh position={[complete ? 0.14 : 0, 0.25, 0.13]} rotation={[0, complete ? -0.45 : 0, 0]} scale={[0.13, 0.25, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7ccaf2" emissive="#baf6ff" emissiveIntensity={complete ? 0.45 : active ? 0.2 : 0.06} roughness={0.32} />
      </mesh>
      {(active || complete) ? (
        <group position={[0.16, 0.18, 0.22]} scale={0.56}>
          <RedBusTicketModel complete={complete} active={active} />
        </group>
      ) : null}
    </group>
  );
}

function GateArrow({ direction = "left", lit }) {
  const sign = direction === "left" ? -1 : 1;
  return (
    <group position={[sign * 0.26, 0.24, 0]} rotation={[0, 0, sign > 0 ? -Math.PI / 2 : Math.PI / 2]}>
      <mesh position={[0, -0.08, 0]} scale={[0.055, 0.34, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={lit ? "#ffd45c" : "#d7dee5"} emissive={lit ? "#ffd45c" : "#7b8894"} emissiveIntensity={lit ? 0.85 : 0.12} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.16, 0]} scale={[0.12, 0.22, 0.06]}>
        <coneGeometry args={[1, 1, 3]} />
        <meshStandardMaterial color={lit ? "#fff0a8" : "#c9d2da"} emissive={lit ? "#ffd45c" : "#7b8894"} emissiveIntensity={lit ? 0.95 : 0.12} roughness={0.4} />
      </mesh>
    </group>
  );
}

function WindArrowsMesh({ complete, active }) {
  const sign = useRef(null);

  useFrame((state) => {
    if (!sign.current) return;
    sign.current.rotation.y = complete ? -0.28 + Math.sin(state.clock.elapsedTime * 1.8) * 0.04 : Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <group ref={sign}>
      <mesh position={[0, 0.12, 0]} scale={[0.82, 0.12, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#8f886d"} emissiveIntensity={active || complete ? 0.28 : 0.08} roughness={0.5} />
      </mesh>
      <GateArrow direction="left" lit={complete || active} />
      <GateArrow direction="right" lit={active && !complete} />
      <WindRibbon active={active || complete} complete={complete} color={complete ? "#ffd45c" : "#baf6ff"} />
    </group>
  );
}

function RiverRibbonMesh({ complete, active }) {
  const river = useRef(null);

  useFrame((state) => {
    if (!river.current) return;
    river.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.8) * 0.045;
    river.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.018;
  });

  return (
    <group>
      <mesh ref={river} position={[0, 0.1, 0]} scale={[1.08, 0.045, 0.26]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#52bfff" emissive={active || complete ? "#baf6ff" : "#276b93"} emissiveIntensity={complete ? 0.56 : active ? 0.32 : 0.12} transparent opacity={0.84} roughness={0.34} />
      </mesh>
      {complete ? (
        <>
          <CloudPuff position={[-0.28, 0.22, 0]} scale={0.34} opacity={0.82} />
          <CloudPuff position={[0.03, 0.24, 0]} scale={0.34} opacity={0.84} />
          <CloudPuff position={[0.34, 0.22, 0]} scale={0.34} opacity={0.82} />
          <SparkleCluster active color="#baf6ff" count={8} radius={0.62} />
        </>
      ) : null}
    </group>
  );
}

function TicketStampMesh({ complete, active }) {
  const stamp = useRef(null);

  useFrame((state) => {
    if (!stamp.current) return;
    const targetY = complete ? 0.36 : active ? 0.58 + Math.sin(state.clock.elapsedTime * 3.2) * 0.05 : 0.62;
    stamp.current.position.y += (targetY - stamp.current.position.y) * 0.1;
    stamp.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.3) * 0.04;
  });

  return (
    <group>
      <group position={[0, 0.12, 0]} scale={0.72}>
        <RedBusTicketModel complete={complete} active={active} />
      </group>
      <mesh position={[0, 0.32, -0.02]} scale={[0.44, 0.06, 0.22]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d9d0bc" emissive={active || complete ? "#ffd45c" : "#756b5a"} emissiveIntensity={active || complete ? 0.24 : 0.06} roughness={0.55} />
      </mesh>
      <group ref={stamp} position={[0, 0.62, 0.04]}>
        <mesh scale={[0.08, 0.26, 0.08]}>
          <cylinderGeometry args={[1, 1, 1, 12]} />
          <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#80735a"} emissiveIntensity={active || complete ? 0.32 : 0.06} />
        </mesh>
        <mesh position={[0, -0.18, 0]} scale={[0.16, 0.06, 0.16]}>
          <cylinderGeometry args={[1, 1, 1, 18]} />
          <meshStandardMaterial color="#e8424f" emissive={complete ? "#ff6b6b" : "#7b2026"} emissiveIntensity={complete ? 0.5 : active ? 0.26 : 0.08} />
        </mesh>
        <mesh position={[0, -0.23, 0.03]} scale={[0.08, 0.08, 0.03]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={complete ? 1.35 : active ? 0.85 : 0.3} />
        </mesh>
      </group>
      {complete ? <SparkleCluster active color="#ffd45c" count={10} radius={0.58} /> : null}
    </group>
  );
}

function LondonWindGateMesh({ complete, active }) {
  const left = useRef(null);
  const right = useRef(null);

  useFrame((state) => {
    if (left.current) {
      left.current.position.x += ((complete ? -0.42 : -0.26) - left.current.position.x) * 0.08;
      left.current.rotation.z = complete ? -0.12 : Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    }
    if (right.current) {
      right.current.position.x += ((complete ? 0.42 : 0.26) - right.current.position.x) * 0.08;
      right.current.rotation.z = complete ? 0.12 : Math.sin(state.clock.elapsedTime * 1.1) * -0.03;
    }
  });

  return (
    <group>
      <group ref={left} position={[-0.26, 0.42, 0]}>
        <mesh scale={[0.08, 0.74, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#8f8265"} emissiveIntensity={complete ? 0.54 : active ? 0.28 : 0.08} roughness={0.44} />
        </mesh>
      </group>
      <group ref={right} position={[0.26, 0.42, 0]}>
        <mesh scale={[0.08, 0.74, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff6df" emissive={active || complete ? "#ffd45c" : "#8f8265"} emissiveIntensity={complete ? 0.54 : active ? 0.28 : 0.08} roughness={0.44} />
        </mesh>
      </group>
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, Math.PI]} scale={[1, 1, 1]}>
        <torusGeometry args={[0.38, 0.05, 12, 42, Math.PI]} />
        <meshStandardMaterial color="#e8424f" emissive={active || complete ? "#ff6b6b" : "#6d1e24"} emissiveIntensity={complete ? 0.82 : active ? 0.44 : 0.12} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.28, -0.04]} scale={[0.38, 0.24, 0.025]}>
        <torusGeometry args={[1, 0.08, 10, 38]} />
        <meshBasicMaterial color="#baf6ff" transparent opacity={active || complete ? 0.48 : 0.16} depthWrite={false} />
      </mesh>
      <WindRibbon active={active || complete} complete={complete} color={complete ? "#ffd45c" : "#baf6ff"} />
      {complete ? (
        <group position={[0, 0.5, -0.28]} scale={0.72}>
          <mesh position={[0, 0.08, 0]} scale={[0.48, 0.48, 0.48]}>
            <coneGeometry args={[0.58, 0.94, 5]} />
            <meshStandardMaterial color="#8b77d8" emissive="#b180ff" emissiveIntensity={0.46} roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.58, 0]} scale={[0.22, 0.08, 0.22]}>
            <cylinderGeometry args={[1, 1, 1, 5]} />
            <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={0.7} />
          </mesh>
          <SparkleCluster active color="#fff0a8" count={10} radius={0.7} />
        </group>
      ) : null}
    </group>
  );
}

function LondonObject({ objectKey, position, active, complete }) {
  const group = useRef(null);
  usePulse(group, active, 4.3, 0.046);
  const glow = complete ? "#ffd45c" : active ? "#fff0a8" : "#ff6b6b";

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.38 + position[0]) * 0.023;
    if (complete && !["river-ribbon", "london-wind-gate"].includes(objectKey)) group.current.rotation.y += 0.004;
  });

  return (
    <group ref={group} position={position}>
      <ActiveObjectAura active={active} complete={complete} color={glow} intensity={1.38} distance={2.55} completeCount={10} />
      {objectKey === "london-window" ? <LondonWindowMesh complete={complete} active={active} /> : null}
      {objectKey === "big-ben-tower" ? <BigBenTowerMesh complete={complete} active={active} /> : null}
      {objectKey === "red-bus-cloud" ? <RedBusCloudMesh complete={complete} active={active} /> : null}
      {objectKey === "ticket-booth" ? <TicketBoothMesh complete={complete} active={active} /> : null}
      {objectKey === "wind-arrows" ? <WindArrowsMesh complete={complete} active={active} /> : null}
      {objectKey === "river-ribbon" ? <RiverRibbonMesh complete={complete} active={active} /> : null}
      {objectKey === "ticket-stamp" ? <TicketStampMesh complete={complete} active={active} /> : null}
      {objectKey === "london-wind-gate" ? <LondonWindGateMesh complete={complete} active={active} /> : null}
    </group>
  );
}

function LondonWindGateScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  const objectPositions = {
    "london-window": [-1.92, 0.74, -0.72],
    "big-ben-tower": [-1.16, 0.48, 0.12],
    "red-bus-cloud": [-0.42, 0.32, 0.78],
    "ticket-booth": [0.56, 0.36, -0.66],
    "wind-arrows": [1.18, 0.52, 0.28],
    "river-ribbon": [0.28, 0.18, 1.15],
    "ticket-stamp": [1.84, 0.34, -0.22],
    "london-wind-gate": [2.66, 0.52, 0.76]
  };
  const travelAwake = completed.size > 0 || voiceActivity === "listening" || voiceActivity === "fallback";

  return (
    <>
      <FloatingClouds voiceActivity={voiceActivity} />
      <group position={[0, -0.52, 0]} rotation={[0, -0.1, 0]}>
        <CloudPuff position={[-1.8, -0.04, 0.95]} scale={1.18} opacity={0.5} />
        <CloudPuff position={[1.58, -0.08, -0.95]} scale={1.12} opacity={0.46} />
        <CloudPuff position={[2.78, -0.02, 0.95]} scale={0.78} opacity={0.46} />
        <mesh receiveShadow scale={[2.96, 0.31, 1.54]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#d9e1df" emissive={travelAwake ? "#ffd45c" : "#9bb2bd"} emissiveIntensity={travelAwake ? 0.16 + completed.size * 0.012 : 0.06} roughness={0.76} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.98, 1.1, 1]}>
          <torusGeometry args={[0.68, 0.034, 8, 52]} />
          <meshBasicMaterial color="#fff6df" transparent opacity={0.46} depthWrite={false} />
        </mesh>
        <mesh position={[0.05, 0.29, 0.06]} scale={[1.78, 0.052, 0.86]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#f5edd9" emissive={travelAwake ? "#ffd45c" : "#9c8f73"} emissiveIntensity={travelAwake ? 0.18 : 0.05} roughness={0.6} />
        </mesh>
        <mesh position={[0.28, 0.31, 1.06]} rotation={[0, 0, 0.04]} scale={[1.34, 0.035, 0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#52bfff" emissive="#baf6ff" emissiveIntensity={completed.has("cross-the-river-ribbon") ? 0.54 : 0.2} transparent opacity={0.8} roughness={0.34} />
        </mesh>
        {[-1.62, -1.28, -0.94, -0.58, -0.2, 0.16].map((x, index) => (
          <mesh key={x} position={[x, 0.42 + index * 0.025, -1.05]} scale={[0.16, 0.32 + (index % 3) * 0.08, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8d9ba8" emissive={completed.has("open-the-london-window") ? "#ffd45c" : "#4d5a63"} emissiveIntensity={completed.has("open-the-london-window") ? 0.18 : 0.04} transparent opacity={completed.has("open-the-london-window") ? 0.78 : 0.32} />
          </mesh>
        ))}
        {[0.72, 1.18, 1.64].map((x, index) => (
          <group key={x} position={[x, 0.48 + index * 0.02, -1.02]}>
            <mesh scale={[0.12, 0.3 + index * 0.06, 0.07]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#b8c4cc" emissive={travelAwake ? "#baf6ff" : "#51636f"} emissiveIntensity={travelAwake ? 0.12 : 0.03} transparent opacity={0.58} />
            </mesh>
            {[0.08, -0.02].map((y) => (
              <mesh key={y} position={[0, y, 0.05]} scale={[0.04, 0.035, 0.02]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={travelAwake ? 0.34 : 0.08} />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[2.92, 0.22, 0.92]} scale={[0.78, 0.11, 0.26]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff6df" emissive={completed.has("open-the-wind-gate") ? "#ffd45c" : "#9c8f73"} emissiveIntensity={completed.has("open-the-wind-gate") ? 0.72 : 0.08} roughness={0.44} />
        </mesh>
        <group position={[-2.52, 0.52, 0.58]} scale={0.9}>
          <WindRibbon active={travelAwake} complete={completed.has("turn-left-at-the-gate")} color="#baf6ff" />
        </group>
        <group position={[1.96, 0.82, -0.82]} scale={0.8}>
          <WindRibbon active={travelAwake} complete={completed.has("open-the-wind-gate")} color="#ffd45c" />
        </group>
        {completed.has("stamp-the-red-bus-ticket") ? (
          <group position={[1.6, 0.78, -0.12]} scale={0.92}>
            <RedBusTicketModel complete active scale={0.76} />
            <SparkleCluster active color="#ffd45c" count={10} radius={0.72} />
          </group>
        ) : null}
        {completed.has("open-the-wind-gate") ? (
          <group position={[2.3, 0.72, 0.88]} scale={1.2}>
            <WindRibbon active complete color="#fff0a8" />
            <SparkleCluster active color="#b180ff" count={12} radius={0.86} />
          </group>
        ) : null}
        {level.tasks.map((task) => (
          <LondonObject
            key={task.id}
            objectKey={task.objectKey}
            position={objectPositions[task.objectKey] || [0, 0.26, 0]}
            active={activeTask?.id === task.id}
            complete={completed.has(task.id)}
          />
        ))}
      </group>
      {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
    </>
  );
}

function MiniCloudCompassModel({ complete, active, scale = 1 }) {
  const needle = useRef(null);

  useFrame((state) => {
    if (!needle.current) return;
    needle.current.rotation.z = complete ? -0.8 : state.clock.elapsedTime * (active ? 2.2 : 0.9);
  });

  return (
    <group scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.34, 0.34, 0.05]}>
        <cylinderGeometry args={[1, 1, 1, 36]} />
        <meshStandardMaterial color="#ffd45c" emissive={active || complete ? "#fff0a8" : "#7c5d20"} emissiveIntensity={complete ? 0.95 : active ? 0.52 : 0.16} metalness={0.18} roughness={0.32} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.39, 0.39, 0.39]}>
        <torusGeometry args={[0.88, 0.045, 10, 48]} />
        <meshStandardMaterial color="#fff8d8" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.58 : 0.16} />
      </mesh>
      <group ref={needle}>
        <mesh position={[0, 0.08, 0.05]} rotation={[0, 0, -0.44]} scale={[0.06, 0.34, 0.035]}>
          <coneGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="#52e6ff" emissive="#baf6ff" emissiveIntensity={active || complete ? 1 : 0.28} />
        </mesh>
        <mesh position={[0, -0.08, 0.05]} rotation={[0, 0, 2.7]} scale={[0.05, 0.26, 0.03]}>
          <coneGeometry args={[1, 1, 3]} />
          <meshStandardMaterial color="#ff83c6" emissive="#ffd0ed" emissiveIntensity={active || complete ? 0.8 : 0.2} />
        </mesh>
      </group>
    </group>
  );
}

function MiniSunberryBasketModel({ complete, active, scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.08, 0]} scale={[0.34, 0.22, 0.28]}>
        <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.66]} />
        <meshStandardMaterial color="#b87735" emissive={active || complete ? "#ffd45c" : "#6d3b12"} emissiveIntensity={complete ? 0.48 : active ? 0.24 : 0.08} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.027, 8, 28, Math.PI]} />
        <meshStandardMaterial color="#ffe0a0" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.46 : 0.14} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => (
        <mesh key={index} position={[(index % 3 - 1) * 0.1, 0.23 + Math.floor(index / 3) * 0.08, (Math.floor(index / 3) - 0.5) * 0.09]} scale={[0.06, 0.06, 0.06]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#ffb23f" emissive="#ffd45c" emissiveIntensity={active || complete ? 0.95 : 0.35} roughness={0.36} />
        </mesh>
      ))}
    </group>
  );
}

function CloudHarborScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  if (level.backgroundPlate) {
    return (
      <>
        <FloatingClouds voiceActivity={voiceActivity} />
        {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
      </>
    );
  }

  const objectPositions = {
    "luma-memory": [-1.75, 0.38, 0.7],
    lantern: [-1.05, 0.28, -0.25],
    flag: [-0.3, 0.25, -0.65],
    "silver-key": [0.65, 0.35, 0.18],
    potion: [1.35, 0.2, -0.42],
    gate: [2.05, 0.18, 0.35],
    "spell-circle": [0.55, 0.12, 1.05],
    "bridge-pieces": [2.8, 0.24, 0.92]
  };

  return (
    <>
      <FloatingClouds voiceActivity={voiceActivity} />
      <group position={[0, -0.45, 0]} rotation={[0, -0.18, 0]}>
        <CloudPuff position={[-1.25, -0.04, 0.82]} scale={1.2} opacity={0.52} />
        <CloudPuff position={[1.3, -0.08, -0.88]} scale={1.05} opacity={0.46} />
        <CloudPuff position={[2.65, -0.02, 0.72]} scale={0.72} opacity={0.48} />
        <mesh receiveShadow scale={[2.7, 0.32, 1.45]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#78d7ff" emissive="#4eb7e8" emissiveIntensity={0.08} roughness={0.72} />
        </mesh>
        <mesh position={[0.05, 0.2, 0.08]} rotation={[Math.PI / 2, 0, 0]} scale={[1.75, 1.06, 1]}>
          <torusGeometry args={[0.64, 0.035, 8, 42]} />
          <meshBasicMaterial color="#eafcff" transparent opacity={0.42} depthWrite={false} />
        </mesh>
        {[-1.04, -0.52, 0, 0.52, 1.04].map((x, index) => (
          <mesh key={x} position={[x + 0.18, 0.3 + index * 0.004, 0.15]} scale={[0.48, 0.12, 1.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={index % 2 ? "#f3ebd2" : "#fff6df"}
              roughness={0.58}
              emissive={completed.size ? "#fff0b8" : "#f4d8a5"}
              emissiveIntensity={completed.size ? 0.1 : 0.035}
            />
          </mesh>
        ))}
        {[-1.12, 1.4].map((x) => (
          <group key={x} position={[x, 0.48, -0.48]}>
            <mesh scale={[0.04, 0.36, 0.04]}>
              <cylinderGeometry args={[1, 1, 1, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.13, 0.015, 8, 22]} />
              <meshStandardMaterial color="#a97b73" roughness={0.44} />
            </mesh>
          </group>
        ))}
        <mesh position={[2.95, 0.22, 0.9]} scale={[0.82, 0.12, 0.28]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#f7f0d5" emissive="#ffd45c" emissiveIntensity={completed.has("open-the-first-bridge") ? 0.7 : 0.08} />
        </mesh>
        {completed.has("open-the-first-bridge") ? (
          <SparkleCluster active color="#ffd45c" count={12} radius={1.1} />
        ) : null}
        {level.tasks.map((task) => (
          <HarborObject
            key={task.id}
            objectKey={task.objectKey}
            position={objectPositions[task.objectKey] || [0, 0.2, 0]}
            active={activeTask?.id === task.id}
            complete={completed.has(task.id)}
          />
        ))}
      </group>
      {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
    </>
  );
}

function BreakfastBreezeScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
  const objectPositions = {
    "picnic-cloud": [-1.75, 0.42, 0.55],
    "cereal-cloud": [-1.05, 0.34, -0.42],
    "toast-boats": [-0.28, 0.26, 0.82],
    "orange-juice": [0.58, 0.38, -0.5],
    "wind-bird": [1.28, 0.38, 0.45],
    "jam-basket": [1.92, 0.28, -0.14],
    sunberries: [0.05, 0.34, -0.02],
    "breeze-gate": [2.74, 0.26, 0.84]
  };

  return (
    <>
      <FloatingClouds voiceActivity={voiceActivity} />
      <group position={[0, -0.5, 0]} rotation={[0, -0.12, 0]}>
        <CloudPuff position={[-1.65, -0.03, 0.92]} scale={1.22} opacity={0.52} />
        <CloudPuff position={[1.55, -0.08, -0.92]} scale={1.08} opacity={0.48} />
        <CloudPuff position={[2.7, -0.02, 0.8]} scale={0.76} opacity={0.5} />
        <mesh receiveShadow scale={[2.85, 0.3, 1.48]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffcf6d" emissive="#ffb23f" emissiveIntensity={0.12} roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.92, 1.08, 1]}>
          <torusGeometry args={[0.66, 0.034, 8, 44]} />
          <meshBasicMaterial color="#fff4c2" transparent opacity={0.48} depthWrite={false} />
        </mesh>
        <mesh position={[-0.05, 0.27, 0.04]} scale={[1.35, 0.035, 0.78]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff0b8" emissive="#ffd45c" emissiveIntensity={0.08 + completed.size * 0.018} roughness={0.62} />
        </mesh>
        <mesh position={[-0.05, 0.3, 0.04]} scale={[1.28, 0.012, 0.72]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff9ac2" roughness={0.72} transparent opacity={0.82} />
        </mesh>
        <mesh position={[-0.2, 0.21, 0.78]} rotation={[0, 0.1, 0]} scale={[1.08, 0.035, 0.24]}>
          <sphereGeometry args={[1, 24, 8]} />
          <meshStandardMaterial color="#f3fbff" emissive="#d7f6ff" emissiveIntensity={0.26} transparent opacity={0.78} roughness={0.4} />
        </mesh>
        <mesh position={[2.92, 0.22, 0.92]} scale={[0.76, 0.11, 0.26]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#fff0a8" emissive="#ffd45c" emissiveIntensity={completed.has("call-the-warm-breeze") ? 0.78 : 0.1} roughness={0.44} />
        </mesh>
        {completed.has("call-the-warm-breeze") ? (
          <group position={[2.1, 0.72, 0.88]} scale={1.25}>
            <WindRibbon active complete color="#fff0a8" />
            <SparkleCluster active color="#ffd45c" count={12} radius={0.9} />
          </group>
        ) : null}
        {level.tasks.map((task) => (
          <BreakfastObject
            key={task.id}
            objectKey={task.objectKey}
            position={objectPositions[task.objectKey] || [0, 0.24, 0]}
            active={activeTask?.id === task.id}
            complete={completed.has(task.id)}
          />
        ))}
      </group>
      {rewardEvent ? <CloudCompassReward rewardEvent={rewardEvent} /> : null}
    </>
  );
}

function CloudCompassReward({ rewardEvent }) {
  const group = useRef(null);
  const ring = useRef(null);
  const [dragging, setDragging] = useState(false);
  const lastPointer = useRef([0, 0]);
  const isSunberryBasket = rewardEvent?.type === "sunberry-basket" || rewardEvent?.label === "Sunberry Basket";
  const isStarMapLens = rewardEvent?.type === "star-map-lens" || rewardEvent?.label === "Star Map Lens";
  const isThunderDrum = rewardEvent?.type === "thunder-drum" || rewardEvent?.label === "Thunder Drum";
  const isRedBusTicket = rewardEvent?.type === "red-bus-ticket" || rewardEvent?.label === "Red Bus Ticket";
  const rewardColor = isSunberryBasket ? "#ffcf6d" : isStarMapLens ? "#8a8dff" : isThunderDrum ? "#ff83c6" : isRedBusTicket ? "#ff6b6b" : "#ffd45c";
  const rewardGlow = isSunberryBasket ? "#ffb23f" : isStarMapLens ? "#baf6ff" : isThunderDrum ? "#fff0a8" : isRedBusTicket ? "#ffd45c" : "#fff0a8";

  useFrame((state) => {
    if (!group.current) return;
    const elapsed = state.clock.elapsedTime;
    group.current.position.y = 1.25 + Math.sin(elapsed * 2.1) * 0.12;
    group.current.scale.setScalar(1 + Math.sin(elapsed * 4.4) * 0.035);
    if (!dragging) group.current.rotation.y += 0.018;
    if (ring.current) ring.current.rotation.z -= 0.026;
  });

  function handlePointerDown(event) {
    event.stopPropagation();
    setDragging(true);
    lastPointer.current = [event.clientX, event.clientY];
    event.target.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragging || !group.current) return;
    event.stopPropagation();
    const [lastX, lastY] = lastPointer.current;
    group.current.rotation.y += (event.clientX - lastX) * 0.012;
    group.current.rotation.x += (event.clientY - lastY) * 0.012;
    lastPointer.current = [event.clientX, event.clientY];
  }

  function handlePointerUp(event) {
    event.stopPropagation();
    setDragging(false);
    event.target.releasePointerCapture?.(event.pointerId);
  }

  return (
    <group
      ref={group}
      key={rewardEvent.id}
      position={[0, 1.25, -0.25]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <pointLight intensity={2.8} color={rewardColor} distance={3.2} />
      <SparkleCluster active color={rewardGlow} count={14} radius={0.78} />
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.026, 10, 64]} />
        <meshBasicMaterial color={rewardGlow} transparent opacity={0.68} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[0.6, 0.014, 8, 48]} />
        <meshBasicMaterial color="#baf6ff" transparent opacity={0.56} depthWrite={false} />
      </mesh>
      {isSunberryBasket ? (
        <group>
          <mesh position={[0, -0.02, 0]} scale={[0.55, 0.32, 0.44]}>
            <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color="#b87735" emissive="#ffd45c" emissiveIntensity={0.42} roughness={0.58} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.045, 10, 42, Math.PI]} />
            <meshStandardMaterial color="#ffe0a0" emissive="#ffd45c" emissiveIntensity={0.36} roughness={0.42} />
          </mesh>
          {Array.from({ length: 9 }, (_, index) => (
            <mesh key={index} position={[(index % 3 - 1) * 0.15, 0.18 + Math.floor(index / 3) * 0.09, (Math.floor(index / 3) - 1) * 0.1]} scale={[0.09, 0.09, 0.09]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color="#ffb23f" emissive="#ffd45c" emissiveIntensity={1} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ) : isStarMapLens ? (
        <group scale={1.12}>
          <StarLensModel complete active scale={1.18} />
          <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
            <torusGeometry args={[0.48, 0.012, 8, 48]} />
            <meshBasicMaterial color="#fff0a8" transparent opacity={0.5} depthWrite={false} />
          </mesh>
        </group>
      ) : isThunderDrum ? (
        <group scale={1.04}>
          <ThunderDrumModel complete active scale={1.2} />
          <MusicNotes active color="#fff0a8" count={8} radius={0.78} />
        </group>
      ) : isRedBusTicket ? (
        <group scale={1.16}>
          <RedBusTicketModel complete active scale={1.28} />
          <WindRibbon active complete color="#baf6ff" />
          <SparkleCluster active color="#ffd45c" count={10} radius={0.7} />
        </group>
      ) : (
        <group>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.08, 48]} />
            <meshStandardMaterial color="#ffd45c" emissive="#fff0a8" emissiveIntensity={0.8} metalness={0.35} roughness={0.22} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={[0.75, 0.75, 0.75]}>
            <coneGeometry args={[0.22, 0.72, 4]} />
            <meshStandardMaterial color="#52e6ff" emissive="#baf6ff" emissiveIntensity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, -Math.PI / 4]} scale={[0.75, 0.75, 0.75]}>
            <coneGeometry args={[0.22, 0.72, 4]} />
            <meshStandardMaterial color="#ff83c6" emissive="#ffd0ed" emissiveIntensity={0.65} />
          </mesh>
        </group>
      )}
      <Html center distanceFactor={7} position={[0, -0.72, 0]}>
        <div className="reward-3d-label">{rewardEvent?.label || "Cloud Compass"}</div>
      </Html>
    </group>
  );
}

const levelSceneRenderers = {
  "sky-dock": CloudHarborScene,
  "picnic-island": BreakfastBreezeScene,
  "star-observatory": SchoolStarObservatoryScene,
  "cloud-stage": RhythmCloudStageScene,
  "london-gate": LondonWindGateScene
};

function LevelScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const Scene = levelSceneRenderers[level?.sceneType] || CloudHarborScene;

  return (
    <Scene
      level={level}
      activeTask={activeTask}
      completedTaskIds={completedTaskIds}
      voiceActivity={voiceActivity}
      rewardEvent={rewardEvent}
    />
  );
}

function CameraRig({ mode }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const narrow = size.width < 620;
    if (mode === "map" && narrow) {
      target.set(0, 6.35, 14.6);
      camera.fov += (88 - camera.fov) * 0.08;
    } else if (mode === "level" && narrow) {
      target.set(0, 4.8, 8.4);
      camera.fov += (52 - camera.fov) * 0.08;
    } else {
      target.set(0, 4.2, 7.2);
      camera.fov += (48 - camera.fov) * 0.08;
    }
    camera.position.lerp(target, 0.08);
    camera.lookAt(0, mode === "map" && narrow ? -0.45 : 0.25, mode === "map" && narrow ? -0.7 : 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

const defaultSceneTheme = {
  background: "#5fd4ff",
  fog: ["#a6f0ff", 7, 16],
  ambient: 1.25,
  hemi: ["#f8fdff", "#8bdcff", 0.82],
  sun: 1.85,
  point: { intensity: 2.2, color: "#ffffff" },
  starCount: 80,
  starFactor: 2,
  starRadius: 18,
  starSpeed: 0.25
};

const levelSceneThemes = {
  "star-observatory": {
    background: "#14225a",
    fog: ["#27346c", 6, 17],
    ambient: 0.82,
    hemi: ["#cfe9ff", "#17153e", 0.74],
    sun: 1.32,
    point: { intensity: 2.8, color: "#baf6ff" },
    starCount: 180,
    starFactor: 2.7,
    starRadius: 22,
    starSpeed: 0.42
  },
  "cloud-stage": {
    background: "#654ee9",
    fog: ["#7d64f2", 6, 17],
    ambient: 1,
    hemi: ["#fff0ff", "#39246d", 0.82],
    sun: 1.55,
    point: { intensity: 2.8, color: "#ffd0ed" },
    starCount: 120,
    starFactor: 2.35,
    starRadius: 22,
    starSpeed: 0.34
  },
  "london-gate": {
    background: "#85cff5",
    fog: ["#d8edf2", 6.4, 18],
    ambient: 1.12,
    hemi: ["#fff8df", "#9ec8d6", 0.84],
    sun: 1.62,
    point: { intensity: 2.45, color: "#ffd45c" },
    starCount: 70,
    starFactor: 1.8,
    starRadius: 18,
    starSpeed: 0.22
  }
};

function BaseScene({ mode, activeLevel, children }) {
  const theme = mode === "level" ? levelSceneThemes[activeLevel?.sceneType] || defaultSceneTheme : defaultSceneTheme;
  const hasBackgroundPlate = mode === "level" && Boolean(activeLevel?.backgroundPlate);
  return (
    <Canvas
      camera={{ position: [0, 4.2, 7.2], fov: 48 }}
      dpr={[1, 1.5]}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ alpha: hasBackgroundPlate, premultipliedAlpha: !hasBackgroundPlate }}
      onCreated={({ gl }) => {
        if (hasBackgroundPlate) gl.setClearColor(0x000000, 0);
      }}
    >
      <CameraRig mode={mode} />
      {hasBackgroundPlate ? null : <color attach="background" args={[theme.background]} />}
      <fog attach="fog" args={theme.fog} />
      <ambientLight intensity={theme.ambient} />
      <hemisphereLight args={theme.hemi} />
      <directionalLight position={[3, 6, 5]} intensity={theme.sun} castShadow />
      <pointLight position={[0, 2.8, 2]} intensity={theme.point.intensity} color={theme.point.color} />
      <CloudPuff position={[-4.2, -1.2, -3.8]} scale={2.2} opacity={0.18} />
      <CloudPuff position={[3.9, -1.05, -4.2]} scale={2.6} opacity={0.16} />
      <CloudPuff position={[0, -1.32, -5.2]} scale={3.1} opacity={0.13} />
      <Stars radius={theme.starRadius} depth={8} count={theme.starCount} factor={theme.starFactor} saturation={0} fade speed={theme.starSpeed} />
      {children}
    </Canvas>
  );
}

export function SkyIslandsCanvas({
  mode,
  world,
  activeLevel,
  activeTask,
  completedTaskIds = [],
  unlockedLevelIds = [],
  completedLevelIds = [],
  introComplete = true,
  introStage = "corner",
  lumaMood = "happy",
  voiceActivity = "idle",
  rewardEvent = null,
  progressionAnimation = null,
  onSelectLevel
}) {
  const backgroundPlate = mode === "level" ? activeLevel?.backgroundPlate : null;
  return (
    <div
      className={`sky-canvas-shell adventure-canvas mode-${mode} ${backgroundPlate ? "has-background-plate" : ""}`}
      data-voice-activity={voiceActivity}
      data-scene-type={mode === "level" ? activeLevel?.sceneType : "map"}
    >
      {backgroundPlate ? <img className="level-background-plate" src={backgroundPlate} alt="" aria-hidden="true" draggable="false" /> : null}
      <BaseScene mode={mode} activeLevel={activeLevel}>
        {mode === "level" ? (
          <LevelScene
            level={activeLevel}
            activeTask={activeTask}
            completedTaskIds={completedTaskIds}
            voiceActivity={voiceActivity}
            rewardEvent={rewardEvent}
          />
        ) : (
          <SkyMapScene
            world={world}
            activeLevel={activeLevel}
            unlockedLevelIds={unlockedLevelIds}
            completedLevelIds={completedLevelIds}
            introComplete={introComplete}
            introStage={introStage}
            lumaMood={lumaMood}
            voiceActivity={voiceActivity}
            progressionAnimation={progressionAnimation}
            onSelectLevel={onSelectLevel}
          />
        )}
      </BaseScene>
      {mode === "level" && activeLevel?.id === "cloud-harbor" && backgroundPlate ? (
        <CloudHarborPlateOverlay
          level={activeLevel}
          activeTask={activeTask}
          completedTaskIds={completedTaskIds}
          voiceActivity={voiceActivity}
          rewardEvent={rewardEvent}
        />
      ) : null}
    </div>
  );
}
