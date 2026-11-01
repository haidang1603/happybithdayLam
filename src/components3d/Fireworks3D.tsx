import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function Fireworks3D() {
  const pointsRef = useRef<THREE.Points>(null!);
  const isLowPerformance = useExperienceStore((state) => state.isLowPerformance);
  const currentScene = useExperienceStore((state) => state.currentScene);

  const maxParticles = isLowPerformance ? 400 : 1200;
  const particles = useRef<Particle[]>([]);
  const lastSpawnTime = useRef(0);

  const colorsPalette = useMemo(() => [
    new THREE.Color('#FACC15'), // Gold
    new THREE.Color('#E879F9'), // Pink
    new THREE.Color('#38BDF8'), // Blue
    new THREE.Color('#6D4AFF'), // Purple
    new THREE.Color('#4ADE80'), // Green
    new THREE.Color('#FFFFFF'), // White
  ], []);

  const { positions, colors } = useMemo(() => {
    return {
      positions: new Float32Array(maxParticles * 3),
      colors: new Float32Array(maxParticles * 3),
    };
  }, [maxParticles]);

  const spawnBurst = (cx: number, cy: number, cz: number) => {
    const burstColor = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
    const count = isLowPerformance ? 30 : 60;

    audioManager.playFireworkSfx();

    for (let i = 0; i < count; i++) {
      if (particles.current.length >= maxParticles) {
        particles.current.shift();
      }
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = Math.random() * 4.5 + 2.0;

      particles.current.push({
        x: cx,
        y: cy,
        z: cz,
        vx: speed * Math.sin(phi) * Math.cos(theta),
        vy: speed * Math.sin(phi) * Math.sin(theta),
        vz: speed * Math.cos(phi),
        r: burstColor.r,
        g: burstColor.g,
        b: burstColor.b,
        alpha: 1.0,
        life: 0,
        maxLife: Math.random() * 0.8 + 1.2,
      });
    }
  };

  useFrame((state, delta) => {
    if (currentScene !== 'finale') return;

    const time = state.clock.elapsedTime;
    // Spawn a new burst every ~1.2 seconds
    if (time - lastSpawnTime.current > 1.2) {
      lastSpawnTime.current = time;
      const rx = (Math.random() - 0.5) * 12;
      const ry = Math.random() * 5 + 2;
      const rz = (Math.random() - 0.5) * 6;
      spawnBurst(rx, ry, rz);
    }

    // Update particles physics
    const activeParticles = particles.current;
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        activeParticles.splice(i, 1);
        continue;
      }

      // Drag and gravity
      p.vx *= 0.96;
      p.vy = p.vy * 0.96 - 2.5 * delta;
      p.vz *= 0.96;

      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;

      p.alpha = 1 - p.life / p.maxLife;
    }

    // Write buffer attributes
    const pos = positions;
    const col = colors;
    for (let i = 0; i < maxParticles; i++) {
      const i3 = i * 3;
      if (i < activeParticles.length) {
        const p = activeParticles[i];
        pos[i3] = p.x;
        pos[i3 + 1] = p.y;
        pos[i3 + 2] = p.z;

        col[i3] = p.r * p.alpha;
        col[i3 + 1] = p.g * p.alpha;
        col[i3 + 2] = p.b * p.alpha;
      } else {
        pos[i3] = 0;
        pos[i3 + 1] = -999;
        pos[i3 + 2] = 0;

        col[i3] = 0;
        col[i3 + 1] = 0;
        col[i3 + 2] = 0;
      }
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.24}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
