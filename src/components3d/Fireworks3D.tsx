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

function createFireworkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function Fireworks3D() {
  const pointsRef = useRef<THREE.Points>(null!);
  const isLowPerformance = useExperienceStore((state) => state.isLowPerformance);
  const currentScene = useExperienceStore((state) => state.currentScene);

  const maxParticles = isLowPerformance ? 300 : 800;
  const particles = useRef<Particle[]>([]);
  const lastSpawnTime = useRef(0);
  const particleTexture = useMemo(() => createFireworkTexture(), []);

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
    const count = isLowPerformance ? 25 : 50;

    audioManager.playFireworkSfx();

    for (let i = 0; i < count; i++) {
      if (particles.current.length >= maxParticles) {
        particles.current.shift();
      }
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = Math.random() * 3.5 + 1.5;

      particles.current.push({
        x: cx,
        y: cy,
        z: cz,
        vx: speed * Math.sin(phi) * Math.cos(theta),
        vy: speed * Math.sin(phi) * Math.sin(theta),
        vz: speed * Math.cos(phi) * 0.4, // Keep depth spread controlled
        r: burstColor.r,
        g: burstColor.g,
        b: burstColor.b,
        alpha: 1.0,
        life: 0,
        maxLife: Math.random() * 0.7 + 1.0,
      });
    }
  };

  useFrame((state, delta) => {
    if (currentScene !== 'finale') return;

    const time = state.clock.elapsedTime;
    if (time - lastSpawnTime.current > 1.3) {
      lastSpawnTime.current = time;
      const rx = (Math.random() - 0.5) * 10;
      const ry = Math.random() * 4 + 2;
      const rz = -Math.random() * 5 - 2; // Kept in background
      spawnBurst(rx, ry, rz);
    }

    const activeParticles = particles.current;
    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        activeParticles.splice(i, 1);
        continue;
      }

      p.vx *= 0.95;
      p.vy = p.vy * 0.95 - 2.0 * delta;
      p.vz *= 0.95;

      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.z += p.vz * delta;

      p.alpha = 1 - p.life / p.maxLife;
    }

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
        map={particleTexture}
        size={0.35}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}
