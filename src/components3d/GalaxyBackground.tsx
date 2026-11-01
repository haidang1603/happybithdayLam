import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';

// Procedurally generate a soft radial circular sprite texture
function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Procedurally generate a very soft cloudy texture for nebulae
function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

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

  // Textures
  const starTexture = useMemo(() => createCircleTexture(), []);
  const cloudTexture = useMemo(() => createCloudTexture(), []);

  // Starfield: strictly kept in the deep background (Z from -5 to -45)
  // Camera is at Z = 14..18, so particles are NEVER in front of the camera!
  const starCount = isLowPerformance ? 800 : 2200;
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);

    const insideColor = new THREE.Color('#E879F9');
    const outsideColor = new THREE.Color('#38BDF8');
    const goldColor = new THREE.Color('#FACC15');
    const whiteColor = new THREE.Color('#FFFFFF');

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Spread stars widely across background dome
      const radius = Math.random() * 35 + 4;
      const angle = Math.random() * Math.PI * 2;
      const spreadY = (Math.random() - 0.5) * 25;
      // Z is pushed into deep background (-8 to -45)
      const depthZ = -Math.random() * 38 - 6;

      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = spreadY;
      pos[i3 + 2] = depthZ;

      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / 35);
      if (Math.random() > 0.85) {
        mixedColor.lerp(goldColor, 0.8);
      } else if (Math.random() > 0.75) {
        mixedColor.lerp(whiteColor, 0.9);
      }

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return { positions: pos, colors: col };
  }, [starCount]);

  // Nebulae cloud particles: placed safely in background (Z from -10 to -35)
  const nebulaCount = isLowPerformance ? 80 : 200;
  const { nebPositions, nebColors } = useMemo(() => {
    const pos = new Float32Array(nebulaCount * 3);
    const col = new Float32Array(nebulaCount * 3);
    const purple = new THREE.Color('#6D4AFF');
    const pink = new THREE.Color('#E879F9');
    const cyan = new THREE.Color('#0284C7');

    for (let i = 0; i < nebulaCount; i++) {
      const i3 = i * 3;
      const spreadX = (Math.random() - 0.5) * 36;
      const spreadY = (Math.random() - 0.5) * 20;
      const depthZ = -Math.random() * 25 - 10;

      pos[i3] = spreadX;
      pos[i3 + 1] = spreadY;
      pos[i3 + 2] = depthZ;

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
    const rotSpeed = reducedMotion ? 0.005 : 0.02;

    if (starsRef.current) {
      starsRef.current.rotation.z += delta * rotSpeed;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z -= delta * (rotSpeed * 0.7);
    }

    // Orbiting celestial bodies
    if (ringPlanetGroup.current) {
      ringPlanetGroup.current.rotation.y += delta * 0.15;
      ringPlanetGroup.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4 + 2;
    }
    if (cyanPlanet.current) {
      cyanPlanet.current.rotation.y += delta * 0.2;
      cyanPlanet.current.position.y = Math.cos(state.clock.elapsedTime * 0.35) * 0.5 - 3;
    }
    if (goldMoon.current) {
      goldMoon.current.rotation.x += delta * 0.15;
    }

    // Mouse parallax tracking
    mouseTarget.current.x = THREE.MathUtils.lerp(mouseTarget.current.x, state.pointer.x * 1.2, 0.05);
    mouseTarget.current.y = THREE.MathUtils.lerp(mouseTarget.current.y, state.pointer.y * 0.8, 0.05);

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
      targetCameraZ = 19;
      targetCameraY = 2.5;
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
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-15, -10, -5]} intensity={1.5} color="#6D4AFF" />
      <pointLight position={[12, 10, -10]} intensity={1.8} color="#38BDF8" />

      {/* Main Spiral Stars - with soft circular sprite map */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={0.4}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {/* Volumetric Nebulae Glow - with soft cloud sprite map */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nebPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nebColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={cloudTexture}
          size={3.5}
          vertexColors
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {/* Planet 1: Saturn-like Ringed Cosmic Body in deep background */}
      <group ref={ringPlanetGroup} position={[-8, 2, -14]}>
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

      {/* Planet 2: Glowing Cyan Gas Planet in background */}
      <mesh ref={cyanPlanet} position={[9, -3, -12]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.3}
          metalness={0.4}
          emissive="#0369A1"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Planet 3: Golden Orbital Moon in background */}
      <mesh ref={goldMoon} position={[-4, -5, -8]}>
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
