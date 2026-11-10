import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { GalaxyBackground } from './GalaxyBackground';
import { BirthdayCake3D } from './BirthdayCake3D';
import { GiftBox3D } from './GiftBox3D';
import { FlowerBouquet3D } from './FlowerBouquet3D';
import { Fireworks3D } from './Fireworks3D';
import { WebGLFallback } from '@/components/effects/WebGLFallback';

export function CanvasContainer() {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const webGLSupported = useExperienceStore((state) => state.webGLSupported);

  if (!webGLSupported) {
    return <WebGLFallback />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 1, 16], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          {/* Universal Galactic Starfield & Nebulae */}
          <GalaxyBackground />

          {/* Interactive 3D Birthday Cake */}
          {currentScene === 'cake' && <BirthdayCake3D />}

          {/* Interactive 3D Secret Gift Box */}
          {currentScene === 'gift' && <GiftBox3D />}

          {/* Interactive 3D Flower Bouquet */}
          {currentScene === 'bouquet' && <FlowerBouquet3D />}

          {/* Dynamic 3D Fireworks Finale */}
          {currentScene === 'finale' && <Fireworks3D />}

          {/* Controls for user interactive viewing (360° free rotation in bouquet scene) */}
          <OrbitControls
            enableZoom={currentScene === 'bouquet'}
            minDistance={5.5}
            maxDistance={16.5}
            enablePan={false}
            rotateSpeed={0.9}
            enableDamping={true}
            dampingFactor={0.06}
            maxPolarAngle={currentScene === 'bouquet' ? Math.PI - 0.2 : Math.PI / 1.7}
            minPolarAngle={currentScene === 'bouquet' ? 0.2 : Math.PI / 2.5}
            enabled={currentScene === 'cake' || currentScene === 'gift' || currentScene === 'bouquet'}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

