import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#87ceeb', 20, 60)
    scene.background = new THREE.Color('#87ceeb')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Outer Ocean ---
function OuterOcean() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.2 + t * 0.5) * 0.15 + Math.sin(z * 0.25 + t * 0.4) * 0.1
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[60, 60, 40, 40]} />
      <meshStandardMaterial
        color="#1a5e8a"
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Lagoon (turquoise transparent) ---
function Lagoon() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.45 + Math.sin(t * 0.3) * 0.05
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <circleGeometry args={[5, 32]} />
      <meshStandardMaterial
        color="#40e0d0"
        transparent
        opacity={0.45}
        metalness={0.2}
        roughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Lagoon Floor ---
function LagoonFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <circleGeometry args={[5.5, 32]} />
      <meshStandardMaterial color="#c2b280" roughness={0.95} />
    </mesh>
  )
}

// --- Coral Reef Ring ---
function ReefRing() {
  const corals = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
      color: string
      type: 'box' | 'sphere' | 'cylinder'
    }[] = []
    const colors = [
      '#ff6b6b',
      '#ff8e53',
      '#e77fb3',
      '#c06bff',
      '#ff5252',
      '#ff9a76',
      '#d4a5ff',
    ]
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
      const radius = 6 + (Math.random() - 0.5) * 1.5
      const h = 0.3 + Math.random() * 0.8
      const types: ('box' | 'sphere' | 'cylinder')[] = [
        'box',
        'sphere',
        'cylinder',
      ]
      arr.push({
        pos: [Math.cos(angle) * radius, -0.3 + h / 2, Math.sin(angle) * radius],
        scale: [0.3 + Math.random() * 0.5, h, 0.3 + Math.random() * 0.5],
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {corals.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          {c.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {c.type === 'sphere' && <sphereGeometry args={[0.5, 8, 8]} />}
          {c.type === 'cylinder' && (
            <cylinderGeometry args={[0.3, 0.5, 1, 6]} />
          )}
          <meshStandardMaterial color={c.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// --- White Sand Beaches ---
function SandBeaches() {
  const beaches = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scaleX: number
      scaleZ: number
      rot: number
    }[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const radius = 5.5
      arr.push({
        pos: [Math.cos(angle) * radius, -0.15, Math.sin(angle) * radius],
        scaleX: 1 + Math.random() * 0.8,
        scaleZ: 0.6 + Math.random() * 0.4,
        rot: angle,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {beaches.map((b, i) => (
        <mesh
          key={i}
          position={b.pos}
          rotation={[-Math.PI / 2, 0, b.rot]}
          scale={[b.scaleX, b.scaleZ, 1]}
        >
          <circleGeometry args={[0.8, 8]} />
          <meshStandardMaterial color="#f5f0dc" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

// --- Palm Trees ---
function PalmTree({ position }: { position: [number, number, number] }) {
  const trunkRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    trunkRef.current.rotation.z = Math.sin(t * 0.5 + position[0]) * 0.05
  })

  const fronds = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      rot: (i / 6) * Math.PI * 2,
      droop: 0.4 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <group ref={trunkRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} rotation={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.08, 1.6, 6]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      {/* Coconut cluster */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#5a3a10" />
      </mesh>
      {/* Fronds */}
      {fronds.map((f, i) => (
        <group key={i} position={[0, 1.6, 0]} rotation={[f.droop, f.rot, 0]}>
          <mesh position={[0, 0, 0.35]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.7]} />
            <meshStandardMaterial
              color="#228b22"
              roughness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PalmTrees() {
  const trees = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3
      const radius = 5.3 + Math.random() * 0.5
      arr.push([Math.cos(angle) * radius, -0.1, Math.sin(angle) * radius])
    }
    return arr
  }, [])

  return (
    <group>
      {trees.map((pos, i) => (
        <PalmTree key={i} position={pos} />
      ))}
    </group>
  )
}

// --- Reef Ridge (visible ring structure) ---
function ReefRidge() {
  return (
    <group>
      {/* Outer reef wall */}
      <mesh position={[0, -0.8, 0]}>
        <torusGeometry args={[7, 0.8, 8, 32]} />
        <meshStandardMaterial color="#8a7a60" roughness={0.9} />
      </mesh>
      {/* Inner reef wall */}
      <mesh position={[0, -0.5, 0]}>
        <torusGeometry args={[5.5, 0.5, 8, 32]} />
        <meshStandardMaterial color="#a0906a" roughness={0.85} />
      </mesh>
    </group>
  )
}

// --- Underwater Fish ---
const FISH_COUNT = 20
const fishDummy = new THREE.Object3D()

function Fish() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const fishData = useMemo(() => {
    return Array.from({ length: FISH_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 3,
      y: -0.8 - Math.random() * 1,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FISH_COUNT; i++) {
      const f = fishData[i]
      const a = f.angle + t * f.speed
      fishDummy.position.set(
        Math.cos(a) * f.radius,
        f.y + Math.sin(t * 2 + f.phase) * 0.1,
        Math.sin(a) * f.radius,
      )
      fishDummy.rotation.set(0, -a + Math.PI / 2, 0)
      fishDummy.scale.setScalar(0.08)
      fishDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fishDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FISH_COUNT]}>
      <coneGeometry args={[0.5, 2, 4]} />
      <meshStandardMaterial color="#ffaa33" />
    </instancedMesh>
  )
}

// --- Main Scene ---
export default function CoralAtoll() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.5} color="#aaddff" />
      <directionalLight position={[8, 12, 5]} intensity={1.2} color="#fff5e0" />
      <directionalLight
        position={[-5, 8, -3]}
        intensity={0.3}
        color="#88bbff"
      />
      <OuterOcean />
      <LagoonFloor />
      <Lagoon />
      <ReefRidge />
      <ReefRing />
      <SandBeaches />
      <PalmTrees />
      <Fish />
    </>
  )
}
