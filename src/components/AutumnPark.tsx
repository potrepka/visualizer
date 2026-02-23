import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8a870', 20, 60)
    scene.background = new THREE.Color('#d0b880')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Ground() {
  return (
    <group>
      {/* Main grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#6a7a38" />
      </mesh>
    </group>
  )
}

function WalkingPath() {
  const segments = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      rot: number
      len: number
      wid: number
    }[] = []
    const points: [number, number][] = [
      [-20, 8],
      [-12, 6],
      [-5, 4],
      [0, 2],
      [5, 0],
      [10, -2],
      [18, -5],
      [25, -4],
    ]
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const dx = curr[0] - prev[0]
      const dz = curr[1] - prev[1]
      arr.push({
        pos: [(prev[0] + curr[0]) / 2, 0.01, (prev[1] + curr[1]) / 2],
        rot: Math.atan2(dx, dz),
        len: Math.sqrt(dx * dx + dz * dz),
        wid: 2,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {segments.map((seg, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, -seg.rot]} position={seg.pos}>
          <planeGeometry args={[seg.wid, seg.len]} />
          <meshStandardMaterial color="#a09068" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

function AutumnTree({
  position,
  foliageColor = '#c85020',
  height = 5,
  spread = 2.5,
}: {
  position: [number, number, number]
  foliageColor?: string
  height?: number
  spread?: number
}) {
  const foliageRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    foliageRef.current.rotation.y = Math.sin(t * 0.3 + position[0]) * 0.02
  })

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.25, height * 0.6, 6]} />
        <meshStandardMaterial color="#5a3a18" roughness={0.85} />
      </mesh>
      {/* Branches */}
      <mesh position={[0.5, height * 0.5, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.05, 0.08, height * 0.3, 5]} />
        <meshStandardMaterial color="#5a3a18" />
      </mesh>
      <mesh position={[-0.4, height * 0.55, 0.2]} rotation={[0.2, 0, 0.5]}>
        <cylinderGeometry args={[0.04, 0.07, height * 0.25, 5]} />
        <meshStandardMaterial color="#5a3a18" />
      </mesh>
      {/* Main foliage */}
      <mesh ref={foliageRef} position={[0, height * 0.7, 0]}>
        <sphereGeometry args={[spread, 8, 8]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      {/* Secondary foliage clusters */}
      <mesh position={[spread * 0.4, height * 0.6, spread * 0.3]}>
        <sphereGeometry args={[spread * 0.6, 7, 7]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      <mesh position={[-spread * 0.3, height * 0.65, -spread * 0.2]}>
        <sphereGeometry args={[spread * 0.5, 7, 7]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
    </group>
  )
}

function ParkBench({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.8, 0.08, 0.5]} />
        <meshStandardMaterial color="#5a4020" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.22]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.06]} />
        <meshStandardMaterial color="#5a4020" roughness={0.8} />
      </mesh>
      {/* Legs */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.22, 0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 6]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[x, 0.22, -0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 6]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 4, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Lamp housing */}
      <mesh position={[0, 4.1, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.35]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Light */}
      <mesh position={[0, 3.85, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#fff8d0"
          emissive="#ffa830"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight
        position={[0, 3.8, 0]}
        color="#ffa830"
        intensity={2}
        distance={10}
      />
    </group>
  )
}

const LEAF_COUNT = 150
const leafDummy = new THREE.Object3D()

function FallenLeaves() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const leaves = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
      rotSpeed: number
      settled: boolean
    }[] = []
    for (let i = 0; i < LEAF_COUNT; i++) {
      const settled = i < 80
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: settled ? 0.02 : 2 + Math.random() * 8,
        z: (Math.random() - 0.5) * 30,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: 0.5 + Math.random() * 2,
        settled,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const colors = [
      new THREE.Color('#c85020'),
      new THREE.Color('#e0a020'),
      new THREE.Color('#d06030'),
      new THREE.Color('#b84018'),
    ]

    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = leaves[i]
      if (leaf.settled) {
        leafDummy.position.set(leaf.x, leaf.y, leaf.z)
        leafDummy.rotation.set(-Math.PI / 2, Math.random() * 0.1, leaf.phase)
        leafDummy.scale.setScalar(0.8 + Math.random() * 0.4)
      } else {
        const y = (((leaf.y - t * leaf.speed) % 10) + 10) % 10
        const x = leaf.x + Math.sin(t * 0.5 + leaf.phase) * 1.5
        const z = leaf.z + Math.cos(t * 0.4 + leaf.phase) * 1.0
        leafDummy.position.set(x, y, z)
        leafDummy.rotation.set(t * leaf.rotSpeed, t * 0.3, leaf.phase)
        leafDummy.scale.setScalar(1)
      }
      leafDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, leafDummy.matrix)
      meshRef.current.setColorAt(i, colors[i % colors.length])
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LEAF_COUNT]}>
      <boxGeometry args={[0.08, 0.005, 0.05]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}

export default function AutumnPark() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 10, 5]} intensity={1.0} color="#ffe0a0" />
      <ambientLight intensity={0.3} color="#c0a060" />
      <hemisphereLight args={['#d0b880', '#5a6a30', 0.35]} />

      <Ground />
      <WalkingPath />

      {/* Trees in autumn colors */}
      <AutumnTree
        position={[-8, 0, -3]}
        foliageColor="#c85020"
        height={6}
        spread={3}
      />
      <AutumnTree
        position={[-4, 0, -6]}
        foliageColor="#e0a020"
        height={5}
        spread={2.5}
      />
      <AutumnTree
        position={[3, 0, -5]}
        foliageColor="#d06030"
        height={7}
        spread={3.5}
      />
      <AutumnTree
        position={[8, 0, 2]}
        foliageColor="#b84018"
        height={5.5}
        spread={2.8}
      />
      <AutumnTree
        position={[14, 0, -3]}
        foliageColor="#c89020"
        height={6}
        spread={3}
      />
      <AutumnTree
        position={[-12, 0, 5]}
        foliageColor="#d87028"
        height={5}
        spread={2.5}
      />
      <AutumnTree
        position={[0, 0, 8]}
        foliageColor="#c86828"
        height={4.5}
        spread={2.2}
      />
      <AutumnTree
        position={[-6, 0, 10]}
        foliageColor="#e8b030"
        height={5.5}
        spread={2.8}
      />
      <AutumnTree
        position={[12, 0, 6]}
        foliageColor="#c06020"
        height={6.5}
        spread={3.2}
      />

      {/* Park benches */}
      <ParkBench position={[-2, 0, 3]} rotation={-0.3} />
      <ParkBench position={[7, 0, -1]} rotation={0.5} />

      {/* Lamp posts */}
      <LampPost position={[-6, 0, 4]} />
      <LampPost position={[4, 0, 1]} />
      <LampPost position={[15, 0, -4]} />

      {/* Falling and fallen leaves */}
      <FallenLeaves />
    </>
  )
}
