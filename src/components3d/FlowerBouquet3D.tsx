import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/stores/useExperienceStore';
import { audioManager } from '@/utils/audioManager';
import { triggerGiftSparkles } from '@/components/effects/ConfettiBurst';

/**
 * Procedurally generates a realistic 3D curved rose petal BufferGeometry.
 * Origin (0,0,0) is at the base attachment point of the petal.
 * The petal extends upward along +Y and curves outward along +Z.
 */
function createRosePetalGeometry(): THREE.BufferGeometry {
  const widthSegments = 16;
  const heightSegments = 20;
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments; // 0 (base) -> 1 (tip)

    // Full rounded belly tapering smoothly to a softly pointed apex (balanced: not blunt, not needle-sharp)
    const baseTaper = 0.16 + 0.84 * Math.sin(Math.min(1, v * 1.22) * (Math.PI / 2));
    const topCap = v > 0.62 ? Math.sqrt(Math.max(0, 1 - Math.pow((v - 0.62) / 0.38, 1.85))) : 1;
    const halfWidth = 0.42 * baseTaper * (0.14 + 0.86 * topCap);

    for (let ix = 0; ix <= widthSegments; ix++) {
      const u = (ix / widthSegments) * 2 - 1; // -1 (left) -> +1 (right)

      const x = u * halfWidth;

      // Softly arched center tip so the apex feels gently pointed yet rounded
      const topRound = v > 0.64 ? Math.pow(1 - u * u, 0.85) * ((v - 0.64) / 0.36) * 0.065 : 0;
      const y = v * 0.76 + topRound;

      // Concave cup facing inward (-Z) so lateral edges wrap around the flower center,
      // while the upper rim curls gracefully outward (+Z)
      const cupDepth = (1 - u * u) * Math.sin(v * Math.PI * 0.9) * 0.14;
      const tipCurlOut = v > 0.68 ? Math.pow((v - 0.68) / 0.32, 2) * 0.15 : 0;

      const z = cupDepth + tipCurlOut;

      vertices.push(x, y, z);
      uvs.push(ix / widthSegments, v);
    }
  }

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = iy * (widthSegments + 1) + ix;
      const b = iy * (widthSegments + 1) + ix + 1;
      const c = (iy + 1) * (widthSegments + 1) + ix;
      const d = (iy + 1) * (widthSegments + 1) + ix + 1;

      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Procedurally generates a 3D sculpted leaf geometry with a central vein fold.
 */
function createLeafGeometry(): THREE.BufferGeometry {
  const widthSegments = 8;
  const heightSegments = 12;
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments;
    // Pointed leaf profile
    const halfWidth = 0.22 * Math.sin(v * Math.PI) * (1 - 0.25 * v);

    for (let ix = 0; ix <= widthSegments; ix++) {
      const u = (ix / widthSegments) * 2 - 1;
      const x = u * halfWidth;
      const y = v * 0.75;
      // V-shaped midrib crease + downward arch
      const midribFold = Math.abs(u) * 0.04 * Math.sin(v * Math.PI);
      const arch = -Math.pow(v, 1.7) * 0.16;
      const z = midribFold + arch;

      vertices.push(x, y, z);
    }
  }

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = iy * (widthSegments + 1) + ix;
      const b = iy * (widthSegments + 1) + ix + 1;
      const c = (iy + 1) * (widthSegments + 1) + ix;
      const d = (iy + 1) * (widthSegments + 1) + ix + 1;

      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Procedurally generates a wavy pleated conical wrapping paper geometry
 * so the bouquet paper has realistic Korean-style folds & pleats.
 */
function createPleatedPaperGeometry(
  topRadius: number,
  waistRadius: number,
  height: number,
  pleatCount: number,
  pleatDepth: number,
  openArc: number = Math.PI * 2,
  arcOffset: number = 0,
  topWaveHeight: number = 0.18
): THREE.BufferGeometry {
  const radialSegments = 72;
  const heightSegments = 20;
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= heightSegments; iy++) {
    const v = iy / heightSegments; // 0 (waist) -> 1 (top edge)
    const baseR = THREE.MathUtils.lerp(waistRadius, topRadius, Math.pow(v, 0.88));

    for (let ix = 0; ix <= radialSegments; ix++) {
      const u = ix / radialSegments;
      const theta = arcOffset + u * openArc;

      // Sinusoidal paper pleats that intensify toward the top rim
      const pleat = Math.sin(theta * pleatCount) * pleatDepth * (0.25 + 0.75 * v);
      const secondaryFold = Math.cos(theta * (pleatCount * 0.5)) * (pleatDepth * 0.45) * v;
      const r = baseR + pleat + secondaryFold;

      // Graceful scalloped/angled top edge wave
      const rimWave = Math.cos(theta * (pleatCount * 0.5)) * topWaveHeight * Math.pow(v, 2);
      const y = v * height + rimWave;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      vertices.push(x, y, z);
    }
  }

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < radialSegments; ix++) {
      const a = iy * (radialSegments + 1) + ix;
      const b = iy * (radialSegments + 1) + ix + 1;
      const c = (iy + 1) * (radialSegments + 1) + ix;
      const d = (iy + 1) * (radialSegments + 1) + ix + 1;

      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  return geometry;
}

interface PetalLayerSpec {
  count: number;
  radius: number;
  scale: [number, number, number];
  budTilt: number; // angle when closed in bud (radians from vertical)
  bloomTilt: number; // angle when fully bloomed
  yOffset: number;
}

const ROSE_LAYERS: PetalLayerSpec[] = [
  { count: 4, radius: 0.04, scale: [0.52, 0.56, 0.52], budTilt: 0.04, bloomTilt: 0.24, yOffset: 0.05 },
  { count: 5, radius: 0.08, scale: [0.66, 0.68, 0.66], budTilt: 0.10, bloomTilt: 0.44, yOffset: 0.035 },
  { count: 6, radius: 0.125, scale: [0.80, 0.80, 0.80], budTilt: 0.16, bloomTilt: 0.66, yOffset: 0.02 },
  { count: 7, radius: 0.17, scale: [0.92, 0.90, 0.92], budTilt: 0.22, bloomTilt: 0.86, yOffset: 0.0 },
  { count: 8, radius: 0.215, scale: [1.04, 0.98, 1.04], budTilt: 0.28, bloomTilt: 1.04, yOffset: -0.015 },
];

interface RoseSpec {
  id: string;
  position: [number, number, number];
  azimuth: number;
  tiltOut: number;
  scale: number;
  coreColor: string;
  outerColor: string;
  emissiveColor: string;
  bloomDelay: number;
}

interface RoseFlowerProps {
  spec: RoseSpec;
  petalGeo: THREE.BufferGeometry;
  leafGeo: THREE.BufferGeometry;
  bouquetBloomed: boolean;
}

function RoseFlower({ spec, petalGeo, leafGeo, bouquetBloomed }: RoseFlowerProps) {
  const flowerHeadRef = useRef<THREE.Group>(null!);
  const petalRefs = useRef<(THREE.Mesh | null)[]>([]);
  const stamenGroupRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(bouquetBloomed ? 1 : 0);

  // Precompute individual petal placements across all 5 concentric layers
  const petalsMeta = useMemo(() => {
    const list: {
      layerIdx: number;
      angle: number;
      radius: number;
      scale: [number, number, number];
      budTilt: number;
      bloomTilt: number;
      yOffset: number;
      color: THREE.Color;
    }[] = [];

    const innerCol = new THREE.Color(spec.coreColor);
    const outerCol = new THREE.Color(spec.outerColor);

    ROSE_LAYERS.forEach((layer, lIdx) => {
      const layerRatio = lIdx / (ROSE_LAYERS.length - 1);
      const petalColor = innerCol.clone().lerp(outerCol, layerRatio);

      for (let i = 0; i < layer.count; i++) {
        // Neat alternating spiral stagger so each layer sits cleanly between the gaps of the inner layer
        const angle = (i / layer.count) * Math.PI * 2 + lIdx * (Math.PI / layer.count);
        list.push({
          layerIdx: lIdx,
          angle,
          radius: layer.radius,
          scale: layer.scale,
          budTilt: layer.budTilt,
          bloomTilt: layer.bloomTilt,
          yOffset: layer.yOffset,
          color: petalColor,
        });
      }
    });

    return list;
  }, [spec.coreColor, spec.outerColor]);

  // Curved stem from flower position down to the bouquet binding waist [0, -1.35, 0]
  const stemGeometry = useMemo(() => {
    const start = new THREE.Vector3(...spec.position);
    const mid = new THREE.Vector3(
      spec.position[0] * 0.45,
      (spec.position[1] - 1.35) * 0.5,
      spec.position[2] * 0.45
    );
    const end = new THREE.Vector3(
      -spec.position[0] * 0.18,
      -2.55,
      -spec.position[2] * 0.18
    );
    const curve = new THREE.CatmullRomCurve3([start, mid, new THREE.Vector3(0, -1.35, 0), end]);
    return new THREE.TubeGeometry(curve, 16, 0.042, 8, false);
  }, [spec.position]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const target = bouquetBloomed ? 1 : 0;

    // Smooth bloom progress with per-flower stagger
    const speed = bouquetBloomed ? 1.8 : 2.2;
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      target,
      Math.min(1, delta * speed * (1 / (1 + spec.bloomDelay * 0.45)))
    );

    const p = progressRef.current;

    // Overall flower head scale expands as it blooms
    if (flowerHeadRef.current) {
      const s = spec.scale * THREE.MathUtils.lerp(0.76, 1.08, p);
      const breathe = 1 + Math.sin(time * 2.2 + spec.bloomDelay * 3) * 0.018;
      flowerHeadRef.current.scale.setScalar(s * breathe);
    }

    // Stamen glow & scale inside the flower heart
    if (stamenGroupRef.current) {
      const stamenScale = THREE.MathUtils.smoothstep(p, 0.25, 1.0);
      stamenGroupRef.current.scale.setScalar(Math.max(0.01, stamenScale));
    }

    // Animate each individual petal's unfurling tilt angle uniformly along its radial axis
    petalsMeta.forEach((meta, idx) => {
      const mesh = petalRefs.current[idx];
      if (!mesh) return;

      // Smooth outer-to-inner unfurl without jarring gaps
      const layerDelay = (ROSE_LAYERS.length - 1 - meta.layerIdx) * 0.06;
      const localP = THREE.MathUtils.clamp((p - layerDelay) / (1 - layerDelay), 0, 1);
      const eased = localP * localP * (3 - 2 * localP); // smoothstep

      const gentleBreath = Math.sin(time * 1.8 + meta.layerIdx * 0.5) * 0.012 * eased;
      const currentTilt = THREE.MathUtils.lerp(meta.budTilt, meta.bloomTilt, eased) + gentleBreath;

      mesh.rotation.x = currentTilt;
    });
  });

  return (
    <group>
      {/* Green Stem */}
      <mesh geometry={stemGeometry}>
        <meshStandardMaterial color="#15803D" roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Flower Head oriented cleanly outward along azimuth + tiltOut */}
      <group position={spec.position} rotation={[0, spec.azimuth, 0]}>
        <group
          ref={flowerHeadRef}
          rotation={[spec.tiltOut, 0, 0]}
          scale={spec.scale}
        >
        {/* Receptacle Base & 5 Green Calyx Sepals */}
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#166534" roughness={0.5} />
        </mesh>
        {[0, 1, 2, 3, 4].map((sIdx) => {
          const sAngle = (sIdx / 5) * Math.PI * 2;
          return (
            <group key={`sepal-${sIdx}`} rotation={[0, sAngle, 0]}>
              <mesh
                geometry={leafGeo}
                position={[0, -0.04, 0.1]}
                rotation={[1.25, 0, 0]}
                scale={[0.45, 0.45, 0.45]}
              >
                <meshStandardMaterial
                  color="#15803D"
                  roughness={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

        {/* Golden Glowing Stamen Cluster in the Heart of the Rose */}
        <group ref={stamenGroupRef} position={[0, 0.08, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#F59E0B"
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
          {Array.from({ length: 12 }).map((_, stIdx) => {
            const stAngle = (stIdx / 12) * Math.PI * 2;
            const stRadius = stIdx % 2 === 0 ? 0.065 : 0.095;
            return (
              <group
                key={`stamen-${stIdx}`}
                position={[Math.cos(stAngle) * stRadius, 0.06, Math.sin(stAngle) * stRadius]}
                rotation={[0.25 * Math.sin(stAngle), 0, -0.25 * Math.cos(stAngle)]}
              >
                <mesh position={[0, 0.07, 0]}>
                  <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
                  <meshStandardMaterial color="#FDE047" emissive="#CA8A04" emissiveIntensity={0.4} />
                </mesh>
                <mesh position={[0, 0.15, 0]}>
                  <sphereGeometry args={[0.022, 8, 8]} />
                  <meshStandardMaterial
                    color="#FEF08A"
                    emissive="#FACC15"
                    emissiveIntensity={1.2}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Concentric 3D Curved Petals */}
        {petalsMeta.map((meta, pIdx) => (
          <group key={`petal-${pIdx}`} rotation={[0, meta.angle, 0]}>
            <mesh
              ref={(el) => {
                petalRefs.current[pIdx] = el;
              }}
              geometry={petalGeo}
              position={[0, meta.yOffset, meta.radius]}
              scale={meta.scale}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color={meta.color}
                emissive={spec.emissiveColor}
                emissiveIntensity={0.18}
                roughness={0.36}
                metalness={0.04}
                clearcoat={0.22}
                clearcoatRoughness={0.35}
                sheen={0.7}
                sheenColor="#FFE4E6"
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
        </group>
      </group>
    </group>
  );
}

/**
 * Floating & Swirling 3D Rose Petals Effect around the Bouquet
 */
function FloatingPetalsSwirl({
  petalGeo,
  bouquetBloomed,
  petalBurstCount,
  isLowPerformance,
}: {
  petalGeo: THREE.BufferGeometry;
  bouquetBloomed: boolean;
  petalBurstCount: number;
  isLowPerformance: boolean;
}) {
  const count = isLowPerformance ? 45 : 85;
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const burstBoostRef = useRef(0);

  // Trigger extra whirlwind energy whenever petalBurstCount increments or bouquet blooms
  useEffect(() => {
    if (petalBurstCount > 0 || bouquetBloomed) {
      burstBoostRef.current = 1.0;
    }
  }, [petalBurstCount, bouquetBloomed]);

  const particles = useMemo(() => {
    const palette = [
      '#F472B6', // Rose pink
      '#FB7185', // Coral blush
      '#FBCFE8', // Soft sakura
      '#E879F9', // Cosmic orchid
      '#FDE68A', // Champagne gold
      '#F43F5E', // Velvet crimson-pink
    ];

    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 * 3;
      const radius = 1.6 + Math.random() * 4.8;
      const y = (Math.random() - 0.5) * 8.5;
      const scale = 0.22 + Math.random() * 0.26;

      return {
        angle,
        radius,
        y,
        speedY: 0.35 + Math.random() * 0.55,
        orbitSpeed: (0.25 + Math.random() * 0.45) * (i % 2 === 0 ? 1 : -1),
        rotSpeedX: (Math.random() - 0.5) * 2.4,
        rotSpeedY: (Math.random() - 0.5) * 2.4,
        rotSpeedZ: (Math.random() - 0.5) * 2.0,
        swayOffset: Math.random() * Math.PI * 2,
        scale,
        color: palette[i % palette.length],
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    burstBoostRef.current = THREE.MathUtils.lerp(burstBoostRef.current, 0, delta * 0.9);
    const boost = 1 + burstBoostRef.current * 2.6;

    particles.forEach((p, idx) => {
      const mesh = meshRefs.current[idx];
      if (!mesh) return;

      // Update orbital angle & vertical float
      p.angle += delta * p.orbitSpeed * boost;
      p.y += delta * p.speedY * (bouquetBloomed ? 1.15 : 0.65) * boost;

      if (p.y > 4.8) {
        p.y = -4.2;
      }

      const dynamicRadius =
        p.radius +
        Math.sin(time * 1.4 + p.swayOffset) * 0.45 +
        burstBoostRef.current * 1.1;

      const x = Math.cos(p.angle) * dynamicRadius;
      const z = Math.sin(p.angle) * dynamicRadius;

      mesh.position.set(x, p.y, z);
      mesh.rotation.x += delta * p.rotSpeedX * boost;
      mesh.rotation.y += delta * p.rotSpeedY * boost;
      mesh.rotation.z += delta * p.rotSpeedZ * boost;
    });
  });

  return (
    <group>
      {particles.map((p, idx) => (
        <mesh
          key={`floating-petal-${idx}`}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
          geometry={petalGeo}
          scale={[p.scale, p.scale, p.scale]}
        >
          <meshPhysicalMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.28}
            roughness={0.35}
            clearcoat={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FlowerBouquet3D({ autoRotate = true }: { autoRotate?: boolean }) {
  const bouquetGroupRef = useRef<THREE.Group>(null!);
  const leftRibbonTailRef = useRef<THREE.Mesh>(null!);
  const rightRibbonTailRef = useRef<THREE.Mesh>(null!);
  const bloomLightRef = useRef<THREE.PointLight>(null!);

  const bouquetBloomed = useExperienceStore((state) => state.bouquetBloomed);
  const setBouquetBloomed = useExperienceStore((state) => state.setBouquetBloomed);
  const petalBurstCount = useExperienceStore((state) => state.petalBurstCount);
  const triggerPetalBurst = useExperienceStore((state) => state.triggerPetalBurst);
  const isLowPerformance = useExperienceStore((state) => state.isLowPerformance);
  const reducedMotion = useExperienceStore((state) => state.reducedMotion);

  // Shared procedural 3D geometries
  const petalGeo = useMemo(() => createRosePetalGeometry(), []);
  const leafGeo = useMemo(() => createLeafGeometry(), []);

  // Multi-layered Korean Wrapping Paper Geometries (cradling the floral dome without petal clipping)
  const outerWrapGeo = useMemo(
    () => createPleatedPaperGeometry(2.62, 0.56, 2.48, 9, 0.14, Math.PI * 2, 0, 0.16),
    []
  );
  const innerTissueGeo = useMemo(
    () => createPleatedPaperGeometry(2.44, 0.52, 2.58, 12, 0.12, Math.PI * 2, 0.3, 0.22),
    []
  );
  const backCrownSheetGeo = useMemo(
    () => createPleatedPaperGeometry(2.96, 0.58, 3.25, 6, 0.18, Math.PI * 1.15, -Math.PI * 1.07, 0.28),
    []
  );
  const lowerSkirtOuterGeo = useMemo(
    () => createPleatedPaperGeometry(1.32, 0.55, 1.48, 8, 0.11, Math.PI * 2, 0, 0.08),
    []
  );
  const lowerSkirtInnerGeo = useMemo(
    () => createPleatedPaperGeometry(1.18, 0.50, 1.56, 10, 0.09, Math.PI * 2, 0.4, 0.08),
    []
  );

  // Sculpted 3D Satin Bow Loops & Flowing Ribbon Tails
  const { leftBowLoopGeo, rightBowLoopGeo, leftTailGeo, rightTailGeo } = useMemo(() => {
    const leftLoopCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.38, 0.24, 0.18),
        new THREE.Vector3(-0.72, 0.06, 0.26),
        new THREE.Vector3(-0.42, -0.20, 0.16),
        new THREE.Vector3(0, 0, 0),
      ],
      true
    );

    const rightLoopCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.38, 0.24, 0.18),
        new THREE.Vector3(0.72, 0.06, 0.26),
        new THREE.Vector3(0.42, -0.20, 0.16),
        new THREE.Vector3(0, 0, 0),
      ],
      true
    );

    const leftTailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0, 0.05),
      new THREE.Vector3(-0.28, -0.45, 0.22),
      new THREE.Vector3(-0.48, -1.05, 0.18),
      new THREE.Vector3(-0.36, -1.62, 0.28),
    ]);

    const rightTailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.06, 0, 0.05),
      new THREE.Vector3(0.28, -0.45, 0.22),
      new THREE.Vector3(0.52, -1.02, 0.18),
      new THREE.Vector3(0.40, -1.65, 0.28),
    ]);

    return {
      leftBowLoopGeo: new THREE.TubeGeometry(leftLoopCurve, 32, 0.085, 12, true),
      rightBowLoopGeo: new THREE.TubeGeometry(rightLoopCurve, 32, 0.085, 12, true),
      leftTailGeo: new THREE.TubeGeometry(leftTailCurve, 28, 0.068, 10, false),
      rightTailGeo: new THREE.TubeGeometry(rightTailCurve, 28, 0.068, 10, false),
    };
  }, []);

  // 13 Multi-Layered Roses arranged in a symmetrical, non-overlapping dome bouquet
  const roses: RoseSpec[] = useMemo(() => {
    const list: RoseSpec[] = [
      // 1. Center Crown Hero Rose
      {
        id: 'rose-center',
        position: [0, 1.76, 0],
        azimuth: 0,
        tiltOut: 0,
        scale: 1.02,
        coreColor: '#E11D48',
        outerColor: '#FDA4AF',
        emissiveColor: '#FB7185',
        bloomDelay: 0.0,
      },
    ];

    // 2. Inner Ring: 5 Roses evenly spaced around the crown
    const innerPalette = [
      { core: '#DB2777', outer: '#F9A8D4', emissive: '#F472B6' },
      { core: '#D97706', outer: '#FEF08A', emissive: '#FBBF24' }, // Champagne Gold Rose
      { core: '#E11D48', outer: '#FECDD3', emissive: '#FB7185' },
      { core: '#9333EA', outer: '#F0ABFC', emissive: '#E879F9' }, // Cosmic Lavender Rose
      { core: '#BE185D', outer: '#FBCFE8', emissive: '#EC4899' },
    ];

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const r = 0.86;
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;
      const pal = innerPalette[i % innerPalette.length];

      list.push({
        id: `rose-inner-${i}`,
        position: [x, 1.54, z],
        azimuth: angle,
        tiltOut: 0.28,
        scale: 0.88,
        coreColor: pal.core,
        outerColor: pal.outer,
        emissiveColor: pal.emissive,
        bloomDelay: 0.18,
      });
    }

    // 3. Outer Ring: 7 Roses framing the dome cleanly above the wrapping collar
    const outerPalette = [
      { core: '#F43F5E', outer: '#FFE4E6', emissive: '#FB7185' },
      { core: '#EC4899', outer: '#FBCFE8', emissive: '#F472B6' },
      { core: '#C026D3', outer: '#F5D0FE', emissive: '#E879F9' },
      { core: '#E11D48', outer: '#FDA4AF', emissive: '#F43F5E' },
      { core: '#D97706', outer: '#FEF9C3', emissive: '#FACC15' },
      { core: '#DB2777', outer: '#FCE7F3', emissive: '#F472B6' },
      { core: '#BE123C', outer: '#FECDD3', emissive: '#FB7185' },
    ];

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + Math.PI / 7;
      const r = 1.46;
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;
      const pal = outerPalette[i % outerPalette.length];

      list.push({
        id: `rose-outer-${i}`,
        position: [x, 1.24, z],
        azimuth: angle,
        tiltOut: 0.46,
        scale: 0.80,
        coreColor: pal.core,
        outerColor: pal.outer,
        emissiveColor: pal.emissive,
        bloomDelay: 0.36,
      });
    }

    return list;
  }, []);

  // Baby's Breath (Hoa Baby Trắng Lấp Lánh) sprigs nestled between the roses
  const babysBreathClusters = useMemo(() => {
    const sprigs: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + (i % 2) * 0.25;
      const radius = i % 3 === 0 ? 0.50 : i % 3 === 1 ? 1.12 : 1.66;
      const height = i % 3 === 0 ? 1.66 : i % 3 === 1 ? 1.38 : 1.08;
      sprigs.push({
        pos: [Math.sin(angle) * radius, height, Math.cos(angle) * radius],
        scale: 0.8 + (i % 3) * 0.2,
      });
    }
    return sprigs;
  }, []);

  // Outer Foliage Ring of 14 Eucalyptus/Rose Leaves around the dome perimeter
  const perimeterLeaves = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const r = 1.78;
      return {
        angle,
        position: [Math.sin(angle) * r, 0.52, Math.cos(angle) * r] as [number, number, number],
      };
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (bouquetGroupRef.current && !reducedMotion) {
      // Gentle zero-gravity hover bobbing
      bouquetGroupRef.current.position.y = Math.sin(time * 1.5) * 0.12 - 0.15;

      // Smooth 360-degree showcase rotation when autoRotate is active
      if (autoRotate) {
        bouquetGroupRef.current.rotation.y += delta * 0.38;
      }
    }

    // Swaying satin ribbon tails
    if (leftRibbonTailRef.current && rightRibbonTailRef.current && !reducedMotion) {
      leftRibbonTailRef.current.rotation.z = Math.sin(time * 2.1) * 0.06;
      rightRibbonTailRef.current.rotation.z = -Math.sin(time * 2.1 + 0.8) * 0.06;
    }

    // Inner bouquet radiant glow intensity
    if (bloomLightRef.current) {
      const targetIntensity = bouquetBloomed ? 3.8 : 1.0;
      bloomLightRef.current.intensity = THREE.MathUtils.lerp(
        bloomLightRef.current.intensity,
        targetIntensity,
        delta * 2.5
      );
    }
  });

  const handleBouquetClick = (e: any) => {
    e?.stopPropagation?.();
    audioManager.playChimeCelebration();
    triggerGiftSparkles();
    if (!bouquetBloomed) {
      setBouquetBloomed(true);
    } else {
      triggerPetalBurst();
    }
  };

  return (
    <group>
      {/* Dedicated Studio & Magical Rim Lighting for the 3D Bouquet */}
      <pointLight
        ref={bloomLightRef}
        position={[0, 1.8, 1.2]}
        intensity={2.8}
        distance={10}
        color="#FDA4AF"
      />
      <pointLight position={[-3.5, 3.0, 3.0]} intensity={2.0} color="#FEF08A" />
      <pointLight position={[3.5, 2.5, -2.5]} intensity={1.8} color="#E879F9" />

      {/* Swirling 3D Falling/Floating Rose Petals */}
      <FloatingPetalsSwirl
        petalGeo={petalGeo}
        bouquetBloomed={bouquetBloomed}
        petalBurstCount={petalBurstCount}
        isLowPerformance={isLowPerformance}
      />

      {/* Main Interactive 3D Bouquet Assembly */}
      <group
        ref={bouquetGroupRef}
        position={[0, -0.15, 0]}
        onClick={handleBouquetClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* 1. ALL 13 MULTI-LAYERED BLOOMING 3D ROSES */}
        {roses.map((spec) => (
          <RoseFlower
            key={spec.id}
            spec={spec}
            petalGeo={petalGeo}
            leafGeo={leafGeo}
            bouquetBloomed={bouquetBloomed}
          />
        ))}

        {/* 2. BABY'S BREATH (HOA BABY TRẮNG & VÀNG KIM LẤP LÁNH) */}
        {babysBreathClusters.map((cluster, cIdx) => (
          <group key={`babys-breath-${cIdx}`} position={cluster.pos} scale={cluster.scale}>
            {[-1, 0, 1].map((subIdx) => (
              <mesh
                key={`floret-${subIdx}`}
                position={[subIdx * 0.11, (subIdx % 2) * 0.08, (1 - Math.abs(subIdx)) * 0.09]}
              >
                <dodecahedronGeometry args={[0.055, 0]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive={cIdx % 3 === 0 ? '#FEF08A' : '#FCE7F3'}
                  emissiveIntensity={0.85}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* 3. PERIMETER LUSH GREEN FOLIAGE LEAVES */}
        {perimeterLeaves.map((item, lIdx) => (
          <group key={`foliage-${lIdx}`} rotation={[0, item.angle, 0]}>
            <mesh
              geometry={leafGeo}
              position={[0, 0.92, 1.58]}
              rotation={[0.92, 0, (lIdx % 2 === 0 ? 1 : -1) * 0.2]}
              scale={[1.05, 1.05, 1.05]}
            >
              <meshStandardMaterial
                color={lIdx % 2 === 0 ? '#15803D' : '#166534'}
                roughness={0.42}
                metalness={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}

        {/* 4. KOREAN LUXURY MULTI-LAYERED WRAPPING PAPER (GIẤY GÓI BÓ HOA) */}
        <group position={[0, -1.35, 0]}>
          {/* Back High Crown Collar Fold (Deep Berry / Rose Velvet) */}
          <mesh geometry={backCrownSheetGeo} position={[0, 0, 0]}>
            <meshPhysicalMaterial
              color="#9D174D"
              emissive="#500724"
              emissiveIntensity={0.2}
              roughness={0.48}
              metalness={0.08}
              clearcoat={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Main Outer Pleated Paper Cone (Soft Romantic Blush Pink) */}
          <mesh geometry={outerWrapGeo} position={[0, 0, 0]}>
            <meshPhysicalMaterial
              color="#FBCFE8"
              emissive="#F472B6"
              emissiveIntensity={0.12}
              roughness={0.42}
              metalness={0.05}
              clearcoat={0.2}
              sheen={0.5}
              sheenColor="#FFFFFF"
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Inner Translucent Silk Tissue Paper (Giấy Lụa Mờ Tinh Khôi) */}
          <mesh geometry={innerTissueGeo} position={[0, 0.04, 0]}>
            <meshPhysicalMaterial
              color="#FFF1F2"
              transparent
              opacity={0.78}
              roughness={0.25}
              transmission={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Lower Flared Wrapping Skirt (Phần Chân Giấy Gói Xòe) */}
          <mesh geometry={lowerSkirtOuterGeo} rotation={[Math.PI, 0, 0]}>
            <meshPhysicalMaterial
              color="#FBCFE8"
              emissive="#F472B6"
              emissiveIntensity={0.12}
              roughness={0.42}
              clearcoat={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh geometry={lowerSkirtInnerGeo} rotation={[Math.PI, 0.3, 0]}>
            <meshPhysicalMaterial
              color="#9D174D"
              roughness={0.48}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* 5. 3D SATIN RIBBON & SCULPTED BOW (RUY BĂNG LỤA & NƠ ĐÔI 3D) */}
        <group position={[0, -1.35, 0]}>
          {/* Satin Waist Cinch Band */}
          <mesh>
            <cylinderGeometry args={[0.59, 0.59, 0.28, 36]} />
            <meshPhysicalMaterial
              color="#E11D48"
              emissive="#881337"
              emissiveIntensity={0.25}
              roughness={0.22}
              metalness={0.18}
              clearcoat={0.6}
            />
          </mesh>

          {/* Upper & Lower Gold Trim Rings on the Ribbon Waist */}
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.595, 0.016, 12, 48]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#CA8A04"
              emissiveIntensity={0.5}
              metalness={0.85}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.595, 0.016, 12, 48]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#CA8A04"
              emissiveIntensity={0.5}
              metalness={0.85}
              roughness={0.18}
            />
          </mesh>

          {/* Front Sculpted 3D Bow Assembly */}
          <group position={[0, 0, 0.58]}>
            {/* Center Pillow Knot */}
            <mesh scale={[1.15, 1.0, 0.85]}>
              <sphereGeometry args={[0.14, 18, 18]} />
              <meshPhysicalMaterial
                color="#BE123C"
                emissive="#881337"
                emissiveIntensity={0.3}
                roughness={0.2}
                clearcoat={0.6}
              />
            </mesh>
            {/* Golden Pearl Brooch in Center of Bow */}
            <mesh position={[0, 0, 0.12]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial
                color="#FDE047"
                emissive="#F59E0B"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Left & Right 3D Satin Bow Loops */}
            <mesh geometry={leftBowLoopGeo} scale={[1, 1, 0.65]}>
              <meshPhysicalMaterial
                color="#E11D48"
                emissive="#9F1239"
                emissiveIntensity={0.25}
                roughness={0.22}
                metalness={0.15}
                clearcoat={0.65}
              />
            </mesh>
            <mesh geometry={rightBowLoopGeo} scale={[1, 1, 0.65]}>
              <meshPhysicalMaterial
                color="#E11D48"
                emissive="#9F1239"
                emissiveIntensity={0.25}
                roughness={0.22}
                metalness={0.15}
                clearcoat={0.65}
              />
            </mesh>

            {/* Swaying Left & Right Ribbon Tails */}
            <mesh ref={leftRibbonTailRef} geometry={leftTailGeo} scale={[1, 1, 0.45]}>
              <meshPhysicalMaterial
                color="#E11D48"
                emissive="#9F1239"
                emissiveIntensity={0.25}
                roughness={0.24}
                clearcoat={0.6}
              />
            </mesh>
            <mesh ref={rightRibbonTailRef} geometry={rightTailGeo} scale={[1, 1, 0.45]}>
              <meshPhysicalMaterial
                color="#E11D48"
                emissive="#9F1239"
                emissiveIntensity={0.25}
                roughness={0.24}
                clearcoat={0.6}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

