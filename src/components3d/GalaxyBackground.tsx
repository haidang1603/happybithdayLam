import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

export function GalaxyBackground() {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const isLowPerformance = useExperienceStore((state) => state.isLowPerformance);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  const starsRef = useRef<THREE.Points>(null!);
  const nebulaRef = useRef<THREE.Points>(null!);
  const ringPlanetGroup = useRef<THREE.Group>(null!);
  const cyanPlanet = useRef<THREE.Mesh>(null!);
  const goldMoon = useRef<THREE.Mesh>(null!);

  const { camera } = useThree();
  const mouseTarget = useRef({ x: 0, y: 0 });

  // Generate spiral galaxy star positions and colors
  const starCount = isLowPerformance ? 1200 : 3500;
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const sz = new Float32Array(starCount);

    const insideColor = new THREE.Color('#E879F9');
    const outsideColor = new THREE.Color('#38BDF8');
    const goldColor = new THREE.Color('#FACC15');
    const whiteColor = new THREE.Color('#FFFFFF');

    for (let i = 0; i < starCount; i++) {
      // Spiral arms calculation
      const i3 = i * 3;
      const radius = Math.random() * 28 + 2;
      const spinAngle = radius * 0.8;
      const branches = 3;
      const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY * 1.5;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color interpolation
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / 28);
      if (Math.random() > 0.88) {
        mixedColor.lerp(goldColor, 0.7);
      } else if (Math.random() > 0.8) {
        mixedColor.lerp(whiteColor, 0.8);
      }

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;

      sz[i] = Math.random() * 2.2 + 0.6;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, [starCount]);

  // Nebulae cloud particles
  const nebulaCount = isLowPerformance ? 250 : 800;
  const { nebPositions, nebColors } = useMemo(() => {
    const pos = new Float32Array(nebulaCount * 3);
    const col = new Float32Array(nebulaCount * 3);
    const purple = new THREE.Color('#6D4AFF');
    const pink = new THREE.Color('#E879F9');
    const cyan = new THREE.Color('#0284C7');

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3;
      const dist = Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i3] = dist * Math.cos(phi) * Math.cos(theta);
      pos[i3 + 1] = dist * Math.sin(phi) * 0.4;
      pos[i3 + 2] = dist * Math.cos(phi) * Math.sin(theta);

      const choice = Math.random();
      const c = choice < 0.4 ? purple : choice < 0.75 ? pink : cyan;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return { nebPositions: pos, nebColors: col };
  }, [nebulaCount]);

  // Animation frame loop
  useFrame((state, delta) => {
    const rotSpeed = reducedMotion ? 0.01 : 0.04;

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * rotSpeed;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * (rotSpeed * 0.6);
    }

    // Orbiting planets
    if (ringPlanetGroup.current) {
      ringPlanetGroup.current.rotation.y += delta * 0.12;
      ringPlanetGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.4 + 2;
    }
    if (cyanPlanet.current) {
      cyanPlanet.current.rotation.y += delta * 0.2;
      cyanPlanet.current.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.5 - 3;
    }
    if (goldMoon.current) {
      goldMoon.current.rotation.x += delta * 0.15;
    }

    // Mouse parallax tracking
    mouseTarget.current.x = THREE.MathUtils.lerp(mouseTarget.current.x, state.pointer.x * 1.5, 0.05);
    mouseTarget.current.y = THREE.MathUtils.lerp(mouseTarget.current.y, state.pointer.y * 1.0, 0.05);

    // Dynamic camera adjustment based on scene
    let targetCameraZ = 16;
    let targetCameraY = 1;

    if (currentScene === 'portal') {
      targetCameraZ = 18;
      targetCameraY = 0;
    } else if (currentScene === 'cake') {
      targetCameraZ = 13;
      targetCameraY = 2;
    } else if (currentScene === 'finale') {
      targetCameraZ = 20;
      targetCameraY = 3;
    } else {
      targetCameraZ = 15;
      targetCameraY = 1;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseTarget.current.x, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY + mouseTarget.current.y, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* Ambient & Directional Space Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-15, -10, -5]} intensity={1.8} color="#6D4AFF" />
      <pointLight position={[12, 10, -10]} intensity={2.0} color="#38BDF8" />

      {/* Main Spiral Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric Nebulae Glow Particles */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nebPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nebColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Planet 1: Saturn-like Ringed Cosmic Body */}
      <group ref={ringPlanetGroup} position={[-8, 2, -12]}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#8B5CF6"
            roughness={0.4}
            metalness={0.3}
            emissive="#4C1D95"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Rings */}
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <ringGeometry args={[2.0, 3.4, 48]} />
          <meshStandardMaterial
            color="#F472B6"
            side={THREE.DoubleSide}
            transparent
            opacity={0.65}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Planet 2: Glowing Cyan Gas Planet */}
      <mesh ref={cyanPlanet} position={[9, -3, -10]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.3}
          metalness={0.4}
          emissive="#0369A1"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Planet 3: Golden Orbital Moon */}
      <mesh ref={goldMoon} position={[-4, -5, -6]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color="#FACC15"
          roughness={0.5}
          metalness={0.2}
          emissive="#CA8A04"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
