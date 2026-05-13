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

function CloudHarborScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  const completed = new Set(completedTaskIds || []);
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
  const rewardColor = isSunberryBasket ? "#ffcf6d" : "#ffd45c";
  const rewardGlow = isSunberryBasket ? "#ffb23f" : "#fff0a8";

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

function LevelScene({ level, activeTask, completedTaskIds, voiceActivity, rewardEvent }) {
  if (level?.sceneType === "picnic-island") {
    return (
      <BreakfastBreezeScene
        level={level}
        activeTask={activeTask}
        completedTaskIds={completedTaskIds}
        voiceActivity={voiceActivity}
        rewardEvent={rewardEvent}
      />
    );
  }

  return (
    <CloudHarborScene
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

function BaseScene({ mode, children }) {
  return (
    <Canvas camera={{ position: [0, 4.2, 7.2], fov: 48 }} dpr={[1, 1.5]} shadows>
      <CameraRig mode={mode} />
      <color attach="background" args={["#5fd4ff"]} />
      <fog attach="fog" args={["#a6f0ff", 7, 16]} />
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#f8fdff", "#8bdcff", 0.82]} />
      <directionalLight position={[3, 6, 5]} intensity={1.85} castShadow />
      <pointLight position={[0, 2.8, 2]} intensity={2.2} color="#ffffff" />
      <CloudPuff position={[-4.2, -1.2, -3.8]} scale={2.2} opacity={0.18} />
      <CloudPuff position={[3.9, -1.05, -4.2]} scale={2.6} opacity={0.16} />
      <CloudPuff position={[0, -1.32, -5.2]} scale={3.1} opacity={0.13} />
      <Stars radius={18} depth={8} count={80} factor={2} saturation={0} fade speed={0.25} />
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
  return (
    <div className={`sky-canvas-shell adventure-canvas mode-${mode}`} data-voice-activity={voiceActivity}>
      <BaseScene mode={mode}>
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
    </div>
  );
}
