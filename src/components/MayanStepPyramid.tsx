import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a4a2a', 30, 80)
    scene.background = new THREE.Color('#3a5a3a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function PyramidLevel({
  y,
  width,
  depth,
  height,
  color,
}: {
  y: number
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <mesh position={[0, y + height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function StoneCarving({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.3, 0.4, 0.08]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.05, 0.04]}>
        <boxGeometry args={[0.15, 0.15, 0.03]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0.04]}>
        <boxGeometry args={[0.2, 0.08, 0.03]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Altar() {
  return (
    <group position={[0, 5.5, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#7a6a4a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.0, 0.3, 1.0]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#c4a030" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Stairs() {
  const steps: JSX.Element[] = []
  for (let i = 0; i < 20; i++) {
    const y = i * 0.28
    const z = 5.5 - i * 0.35
    steps.push(
      <mesh key={i} position={[0, y + 0.14, z]}>
        <boxGeometry args={[2.0, 0.28, 0.5]} />
        <meshStandardMaterial color="#9a8a6a" roughness={0.9} />
      </mesh>,
    )
  }
  return <group>{steps}</group>
}

function JungleTree({ position }: { position: [number, number, number] }) {
  const trunkHeight = 2 + Math.random() * 2
  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, trunkHeight, 6]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {[0, 0.4, -0.3].map((yOff, i) => (
        <mesh
          key={i}
          position={[(i - 1) * 0.3, trunkHeight + yOff, (i - 1) * 0.2]}
        >
          <sphereGeometry args={[0.6 + i * 0.1, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#1a6a1a' : '#2a7a2a'} />
        </mesh>
      ))}
    </group>
  )
}

function Vegetation({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale || 1
  return (
    <group position={position}>
      <mesh position={[0, 0.15 * s, 0]}>
        <sphereGeometry args={[0.3 * s, 6, 6]} />
        <meshStandardMaterial color="#2a8a2a" />
      </mesh>
      <mesh position={[0.15 * s, 0.1 * s, 0.1 * s]}>
        <sphereGeometry args={[0.2 * s, 6, 6]} />
        <meshStandardMaterial color="#1a7a1a" />
      </mesh>
    </group>
  )
}

const dummy = new THREE.Object3D()
const FIREFLY_COUNT = 60

function Fireflies() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: 0.5 + Math.random() * 6,
        z: (Math.random() - 0.5) * 20,
        speed: 0.3 + Math.random() * 0.5,
        radius: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const d = data[i]
      dummy.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * d.radius,
        d.y + Math.sin(t * d.speed * 1.3 + d.phase) * 0.5,
        d.z + Math.cos(t * d.speed + d.phase) * d.radius,
      )
      dummy.scale.setScalar(0.04 + Math.sin(t * 3 + d.phase) * 0.02)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FIREFLY_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#aaff44"
        emissive="#aaff44"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

function Pyramid() {
  const levels = 9
  const baseWidth = 12
  const stepHeight = 0.6
  const shrink = 1.1

  const elements: JSX.Element[] = []
  for (let i = 0; i < levels; i++) {
    const w = baseWidth - i * shrink
    elements.push(
      <PyramidLevel
        key={i}
        y={i * stepHeight}
        width={w}
        depth={w}
        height={stepHeight}
        color={i % 2 === 0 ? '#8a7a5a' : '#9a8a6a'}
      />,
    )
  }

  const carvingPositions: {
    pos: [number, number, number]
    rot: [number, number, number]
  }[] = []
  for (let i = 0; i < levels - 1; i++) {
    const w = (baseWidth - i * shrink) / 2
    const y = i * stepHeight + stepHeight / 2
    carvingPositions.push(
      { pos: [w + 0.04, y, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [-w - 0.04, y, 0], rot: [0, -Math.PI / 2, 0] },
      { pos: [0, y, w + 0.04], rot: [0, 0, 0] },
      { pos: [0, y, -w - 0.04], rot: [0, Math.PI, 0] },
    )
  }

  return (
    <group>
      {elements}
      {carvingPositions
        .filter((_, i) => i % 3 === 0)
        .map((c, i) => (
          <StoneCarving key={i} position={c.pos} rotation={c.rot} />
        ))}
    </group>
  )
}

export default function MayanStepPyramid() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.1
  })

  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[5, 8, 3]}
        color="#ffe8b0"
        intensity={1.5}
        castShadow
      />
      <ambientLight intensity={0.2} />
      <hemisphereLight args={['#88aa66', '#334422', 0.5]} />

      <group ref={groupRef}>
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#3a5a2a" />
        </mesh>

        <Pyramid />
        <Stairs />
        <Altar />

        {/* Jungle trees */}
        {[
          [-8, 0, -6],
          [9, 0, -4],
          [-7, 0, 8],
          [10, 0, 7],
          [-12, 0, 0],
          [12, 0, -2],
          [-5, 0, 12],
          [6, 0, -10],
          [-10, 0, -10],
          [8, 0, 10],
          [-3, 0, -12],
          [14, 0, 3],
        ].map((pos, i) => (
          <JungleTree key={i} position={pos as [number, number, number]} />
        ))}

        {/* Vegetation around base */}
        {[
          [-5, 0, 5],
          [5, 0, 5],
          [-5, 0, -5],
          [5, 0, -5],
          [0, 0, 7],
          [-7, 0, 0],
          [7, 0, 0],
          [0, 0, -7],
          [-3, 0, 8],
          [4, 0, -8],
          [-8, 0, 4],
          [8, 0, -3],
        ].map((pos, i) => (
          <Vegetation
            key={i}
            position={pos as [number, number, number]}
            scale={0.8 + Math.random() * 0.6}
          />
        ))}

        <Fireflies />
      </group>
    </>
  )
}
