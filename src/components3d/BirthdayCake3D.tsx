import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerBirthdayConfetti } from '@/components/effects/ConfettiBurst';

export function BirthdayCake3D() {
  const cakeGroup = useRef<THREE.Group>(null!);
  const flame1Ref = useRef<THREE.Mesh>(null!);
  const flame2Ref = useRef<THREE.Mesh>(null!);
  const flame3Ref = useRef<THREE.Mesh>(null!);
  const flameLightRef = useRef<THREE.PointLight>(null!);
  const balloonsGroup = useRef<THREE.Group>(null!);

  const candleBlown = useExperienceStore((state) => state.candleBlown);
  const setCandleBlown = useExperienceStore((state) => state.setCandleBlown);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  // Generate decorative frosting beads around base and middle tiers
  const frostingBeadsBase = useMemo(() => {
    const beads: [number, number, number][] = [];
    const count = 28;
    const radius = 2.25;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      beads.push([Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius]);
    }
    return beads;
  }, []);

  const frostingBeadsMid = useMemo(() => {
    const beads: [number, number, number][] = [];
    const count = 22;
    const radius = 1.65;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      beads.push([Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]);
    }
    return beads;
  }, []);

  // Frame animation loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Cake gentle rotation
    if (cakeGroup.current) {
      if (!reducedMotion) {
        cakeGroup.current.rotation.y += delta * 0.3;
      }
    }

    // Balloon gentle floating bob
    if (balloonsGroup.current && !reducedMotion) {
      balloonsGroup.current.position.y = Math.sin(time * 1.5) * 0.15;
    }

    // Candle flame flickering and blow-out transition
    const flames = [flame1Ref.current, flame2Ref.current, flame3Ref.current];
    flames.forEach((flame, index) => {
      if (!flame) return;
      if (candleBlown) {
        // Extinguish: scale down rapidly to 0
        flame.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.15);
      } else {
        // Flicker
        const flicker = Math.sin(time * 15 + index) * 0.15 + 1;
        const targetScale = new THREE.Vector3(flicker, flicker * 1.3, flicker);
        flame.scale.lerp(targetScale, 0.2);
      }
    });

    if (flameLightRef.current) {
      if (candleBlown) {
        flameLightRef.current.intensity = THREE.MathUtils.lerp(flameLightRef.current.intensity, 0, 0.15);
      } else {
        flameLightRef.current.intensity = 2.5 + Math.sin(time * 20) * 0.4;
      }
    }
  });

  const handleCandleClick = () => {
    if (!candleBlown) {
      audioManager.playBlowCandleSfx();
      triggerBirthdayConfetti();
      setCandleBlown(true);
    }
  };

  return (
    <group position={[0, -0.6, 0]}>
      {/* Central Rotating Cake Group */}
      <group ref={cakeGroup} onClick={handleCandleClick}>
        {/* Tier 1 - Bottom Tier */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 1.2, 48]} />
          <meshStandardMaterial
            color="#3B1D6E"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Bottom Tier Cream Rim */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.24, 2.24, 0.1, 48]} />
          <meshStandardMaterial color="#F472B6" roughness={0.3} />
        </mesh>
        {/* Decorative frosting spheres on bottom tier */}
        {frostingBeadsBase.map((pos, idx) => (
          <mesh key={`base-${idx}`} position={pos}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#FDE047" emissive="#CA8A04" emissiveIntensity={0.2} />
          </mesh>
        ))}

        {/* Tier 2 - Middle Tier */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.6, 1.0, 40]} />
          <meshStandardMaterial
            color="#6D4AFF"
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
        {/* Middle Tier Cream Rim */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[1.64, 1.64, 0.1, 40]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.3} />
        </mesh>
        {/* Middle tier pearls */}
        {frostingBeadsMid.map((pos, idx) => (
          <mesh key={`mid-${idx}`} position={pos}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#E879F9" emissive="#A21CAF" emissiveIntensity={0.2} />
          </mesh>
        ))}

        {/* Tier 3 - Top Tier */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.0, 1.0, 0.9, 36]} />
          <meshStandardMaterial
            color="#E879F9"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
        {/* Top Tier Icing */}
        <mesh position={[0, 1.95, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.08, 36]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} />
        </mesh>

        {/* Candles Group */}
        {/* Center Candle */}
        <group position={[0, 2.0, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.9, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
            <meshBasicMaterial color="#1E293B" />
          </mesh>
          {/* Flame */}
          <mesh ref={flame1Ref} position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#EA580C"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        {/* Left Candle */}
        <group position={[-0.45, 2.0, 0.2]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.2} />
          </mesh>
          <mesh ref={flame2Ref} position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.11, 14, 14]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#F97316"
              emissiveIntensity={2.2}
            />
          </mesh>
        </group>

        {/* Right Candle */}
        <group position={[0.45, 2.0, 0.2]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
            <meshStandardMaterial color="#E879F9" roughness={0.2} />
          </mesh>
          <mesh ref={flame3Ref} position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.11, 14, 14]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#F97316"
              emissiveIntensity={2.2}
            />
          </mesh>
        </group>

        {/* Candle Flame Glow Light */}
        <pointLight
          ref={flameLightRef}
          position={[0, 3.2, 0]}
          color="#F97316"
          intensity={3.0}
          distance={7}
        />
      </group>

      {/* Floating Celebration Balloons */}
      <group ref={balloonsGroup}>
        {/* Balloon 1: Purple */}
        <group position={[-2.8, 1.8, -0.8]}>
          <mesh>
            <sphereGeometry args={[0.65, 24, 24]} />
            <meshStandardMaterial color="#8B5CF6" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Knot & String */}
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.08, 0.04, 0.1, 12]} />
            <meshStandardMaterial color="#7C3AED" />
          </mesh>
          <mesh position={[0.1, -1.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.5, 8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>

        {/* Balloon 2: Gold */}
        <group position={[2.8, 2.2, -0.5]}>
          <mesh>
            <sphereGeometry args={[0.7, 24, 24]} />
            <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.75, 0]}>
            <cylinderGeometry args={[0.08, 0.04, 0.1, 12]} />
            <meshStandardMaterial color="#CA8A04" />
          </mesh>
          <mesh position={[-0.1, -1.6, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.6, 8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>

        {/* Balloon 3: Nebula Pink */}
        <group position={[-2.2, 2.8, -1.5]}>
          <mesh>
            <sphereGeometry args={[0.6, 24, 24]} />
            <meshStandardMaterial color="#EC4899" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.6, 8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>

        {/* Balloon 4: Cosmic Blue */}
        <group position={[2.2, 3.0, -1.2]}>
          <mesh>
            <sphereGeometry args={[0.55, 24, 24]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, -1.4, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.4, 8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

