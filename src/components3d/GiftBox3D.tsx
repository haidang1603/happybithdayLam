import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerGiftSparkles } from '@/components/effects/ConfettiBurst';

export function GiftBox3D() {
  const boxGroup = useRef<THREE.Group>(null!);
  const lidGroup = useRef<THREE.Group>(null!);
  const insideLightRef = useRef<THREE.PointLight>(null!);
  const surpriseStarRef = useRef<THREE.Mesh>(null!);

  const giftOpened = useExperienceStore((state) => state.giftOpened);
  const setGiftOpened = useExperienceStore((state) => state.setGiftOpened);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Hover floating animation when not opened
    if (boxGroup.current && !reducedMotion) {
      if (!giftOpened) {
        boxGroup.current.position.y = Math.sin(time * 2) * 0.15;
        // Tempting subtle shake/wiggle
        boxGroup.current.rotation.z = Math.sin(time * 4) * 0.03;
        boxGroup.current.rotation.y += delta * 0.2;
      } else {
        boxGroup.current.position.y = THREE.MathUtils.lerp(boxGroup.current.position.y, -0.3, 0.08);
      }
    }

    // Lid opening animation
    if (lidGroup.current) {
      if (giftOpened) {
        // Lift and tilt backward
        lidGroup.current.position.y = THREE.MathUtils.lerp(lidGroup.current.position.y, 2.2, 0.08);
        lidGroup.current.position.z = THREE.MathUtils.lerp(lidGroup.current.position.z, -1.2, 0.08);
        lidGroup.current.rotation.x = THREE.MathUtils.lerp(lidGroup.current.rotation.x, -Math.PI / 3, 0.08);
      } else {
        lidGroup.current.position.set(0, 1.05, 0);
        lidGroup.current.rotation.set(0, 0, 0);
      }
    }

    // Internal radiant light beam
    if (insideLightRef.current) {
      if (giftOpened) {
        insideLightRef.current.intensity = THREE.MathUtils.lerp(insideLightRef.current.intensity, 6.0, 0.1);
      } else {
        insideLightRef.current.intensity = 0.2;
      }
    }

    // Floating surprise star/token
    if (surpriseStarRef.current && giftOpened) {
      surpriseStarRef.current.position.y = THREE.MathUtils.lerp(surpriseStarRef.current.position.y, 1.8, 0.06);
      surpriseStarRef.current.rotation.y += delta * 1.5;
      surpriseStarRef.current.rotation.x += delta * 0.8;
      const s = THREE.MathUtils.lerp(surpriseStarRef.current.scale.x, 1, 0.08);
      surpriseStarRef.current.scale.set(s, s, s);
    }
  });

  const handleClick = (e: any) => {
    e?.stopPropagation?.();
    if (!giftOpened) {
      audioManager.playGiftOpenSfx();
      triggerGiftSparkles();
      setGiftOpened(true);
    }
  };

  const handlePointerOver = (e: any) => {
    e?.stopPropagation?.();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={boxGroup}
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Box Base (Container) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.9, 2.2]} />
        <meshStandardMaterial
          color="#4C1D95"
          roughness={0.25}
          metalness={0.4}
          emissive="#2E1065"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Gold Ribbon Vertical Band (Z-axis) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, 1.92, 2.22]} />
        <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Gold Ribbon Horizontal Band (X-axis) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.22, 1.92, 0.35]} />
        <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Box Lid Group */}
      <group ref={lidGroup} position={[0, 1.05, 0]}>
        {/* Lid Box */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.35, 0.4, 2.35]} />
          <meshStandardMaterial
            color="#6D4AFF"
            roughness={0.25}
            metalness={0.4}
            emissive="#4338CA"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Lid Ribbon Cross */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.36, 0.42, 2.37]} />
          <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.37, 0.42, 0.36]} />
          <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Ribbon Bow on top */}
        <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.25, 0.09, 16, 24]} />
          <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.25, 0.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[0.25, 0.09, 16, 24]} />
          <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#FDE047" metalness={0.8} roughness={0.1} />
        </mesh>
      </group>

      {/* Internal Light Beam that shoots out when opened */}
      <pointLight
        ref={insideLightRef}
        position={[0, 0.5, 0]}
        color="#FACC15"
        intensity={0.2}
        distance={8}
      />

      {/* Surprise Floating Celestial Token inside */}
      <mesh
        ref={surpriseStarRef}
        position={[0, 0.2, 0]}
        scale={[0.01, 0.01, 0.01]}
      >
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.9}
          emissive="#0284C7"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

