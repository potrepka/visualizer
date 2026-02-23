import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Sand Dune ---
function SandDune({
  position,
  scaleX,
  scaleY,
  scaleZ,
}: {
  position: [number, number, number]
  scaleX: number
  scaleY: number
  scaleZ: number
}) {
  return (
    <mesh position={position} scale={[scaleX, scaleY, scaleZ]}>
      <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#deb887" roughness={0.95} />
    </mesh>
  )
}

// --- Palm Tree ---
function PalmTree({ position }: { position: [number, number, number] }) {
  const trunkRef = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    trunkRef.current.rotation.x = Math.sin(t * 0.5 + phase) * 0.02
    trunkRef.current.rotation.z = Math.cos(t * 0.4 + phase) * 0.02
  })

  const fronds = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2
      return {
        rotation: [0.6, angle, 0] as [number, number, number],
      }
    })
  }, [])

  return (
    <group position={position} ref={trunkRef}>
      {/* Trunk segments - slight curve */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[Math.sin(i * 0.15) * 0.1, i * 0.5 + 0.25, 0]}>
          <cylinderGeometry
            args={[0.08 - i * 0.008, 0.1 - i * 0.008, 0.5, 8]}
          />
          <meshStandardMaterial color="#8b6914" roughness={0.85} />
        </mesh>
      ))}
      {/* Coconuts */}
      {[
        [-0.12, 3.1, 0.05],
        [0.1, 3.05, -0.08],
        [0, 3.08, 0.12],
      ].map((pos, i) => (
        <mesh key={`coconut-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#5a3a0a" roughness={0.8} />
        </mesh>
      ))}
      {/* Fronds */}
      {fronds.map((f, i) => (
        <group key={i} position={[0, 3.2, 0]} rotation={f.rotation}>
          <mesh position={[0, 0, 0.8]}>
            <boxGeometry args={[0.3, 0.02, 1.6]} />
            <meshStandardMaterial
              color="#2e8b2e"
              roughness={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Water Pool ---
function OasisPool() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = 0.02 + Math.sin(t * 0.8) * 0.01
  })

  return (
    <group>
      {/* Pool depression */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[3.5, 4, 0.4, 24]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>
      {/* Water surface */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.2, 32]} />
        <meshStandardMaterial
          color="#2a8b8b"
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Shore rocks */}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3
        const r = 3.3 + Math.random() * 0.5
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.12 + Math.random() * 0.15, 5, 4]} />
            <meshStandardMaterial color="#8a8a7a" roughness={0.85} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Scattered Rocks ---
function DesertRocks() {
  const rocks = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      pos: [
        (Math.random() - 0.5) * 16,
        Math.random() * 0.2,
        (Math.random() - 0.5) * 16,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.35,
      rot: Math.random() * Math.PI,
    }))
  }, [])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh
          key={i}
          position={r.pos}
          rotation={[Math.random() * 0.3, r.rot, 0]}
          scale={r.scale}
        >
          <boxGeometry args={[1, 0.6, 0.8]} />
          <meshStandardMaterial color="#a09070" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// --- Small desert plants ---
function DesertShrub({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.1, 0.15, Math.sin(angle) * 0.1]}
            rotation={[0.3, angle, 0]}
          >
            <cylinderGeometry args={[0.01, 0.02, 0.3, 4]} />
            <meshStandardMaterial color="#6b8e23" roughness={0.8} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#556b2f" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Heat shimmer particles ---
const SHIMMER_COUNT = 50
const shimmerDummy = new THREE.Object3D()

function HeatShimmer() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: SHIMMER_COUNT }, () => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      speed: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      baseY: 0.5 + Math.random() * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SHIMMER_COUNT; i++) {
      const p = particles[i]
      shimmerDummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * 0.3,
        p.baseY + Math.sin(t * p.speed + p.phase) * 0.5,
        p.z + Math.cos(t * 0.3 + p.phase) * 0.3,
      )
      shimmerDummy.scale.set(0.3, 0.05, 0.3)
      shimmerDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, shimmerDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SHIMMER_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#ffe8c0"
        transparent
        opacity={0.03}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8c88a', 30, 80)
    scene.background = new THREE.Color('#d4a56a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function DesertOasis() {
  const duneConfigs = useMemo(
    () => [
      { pos: [-8, 0, -8] as [number, number, number], sx: 6, sy: 1.5, sz: 4 },
      { pos: [10, 0, -6] as [number, number, number], sx: 5, sy: 2, sz: 5 },
      { pos: [-12, 0, 5] as [number, number, number], sx: 7, sy: 1.2, sz: 5 },
      { pos: [8, 0, 8] as [number, number, number], sx: 6, sy: 1.8, sz: 4.5 },
      { pos: [0, 0, -12] as [number, number, number], sx: 8, sy: 1.5, sz: 5 },
      { pos: [-6, 0, 12] as [number, number, number], sx: 5, sy: 1.3, sz: 6 },
    ],
    [],
  )

  const shrubPositions = useMemo(
    () => [
      [4.5, 0, 1] as [number, number, number],
      [-4, 0, 2] as [number, number, number],
      [2, 0, -4.5] as [number, number, number],
      [-3, 0, -3] as [number, number, number],
      [5, 0, -3] as [number, number, number],
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 4]} color="#ffe0a0" intensity={1.8} />
      <ambientLight color="#cc9955" intensity={0.3} />
      <hemisphereLight args={['#ffd080', '#c8a060', 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#deb887" roughness={0.95} />
      </mesh>

      {/* Dunes */}
      {duneConfigs.map((d, i) => (
        <SandDune
          key={i}
          position={d.pos}
          scaleX={d.sx}
          scaleY={d.sy}
          scaleZ={d.sz}
        />
      ))}

      <OasisPool />

      {/* Palm trees around oasis */}
      <PalmTree position={[-2, 0, -2]} />
      <PalmTree position={[2.5, 0, -1.5]} />
      <PalmTree position={[-1, 0, 3]} />
      <PalmTree position={[3, 0, 2.5]} />

      <DesertRocks />

      {shrubPositions.map((pos, i) => (
        <DesertShrub key={i} position={pos} />
      ))}

      <HeatShimmer />
    </>
  )
}
