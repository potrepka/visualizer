import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Coral Branch: recursive-looking branching cylinders ---
function CoralBranch({
  position,
  color,
  height,
  radius,
}: {
  position: [number, number, number]
  color: string
  height: number
  radius: number
}) {
  const branches: {
    pos: [number, number, number]
    rot: [number, number, number]
    h: number
    r: number
  }[] = useMemo(() => {
    const arr = []
    const count = 3 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const tilt = 0.3 + Math.random() * 0.5
      const h = height * (0.4 + Math.random() * 0.3)
      const r = radius * (0.5 + Math.random() * 0.3)
      arr.push({
        pos: [
          Math.sin(angle) * radius * 0.8,
          height * 0.6 + Math.random() * height * 0.3,
          Math.cos(angle) * radius * 0.8,
        ] as [number, number, number],
        rot: [tilt * Math.cos(angle), 0, tilt * Math.sin(angle)] as [
          number,
          number,
          number,
        ],
        h,
        r,
      })
    }
    return arr
  }, [height, radius])

  return (
    <group position={position}>
      {/* Main trunk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius * 0.6, radius, height, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Tip sphere */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[radius * 0.7, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Sub-branches */}
      {branches.map((b, i) => (
        <group key={i} position={b.pos} rotation={b.rot}>
          <mesh position={[0, b.h / 2, 0]}>
            <cylinderGeometry args={[b.r * 0.4, b.r * 0.7, b.h, 6]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[0, b.h, 0]}>
            <sphereGeometry args={[b.r * 0.5, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Seaweed: animated thin cylinders ---
function Seaweed({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  const segments = useMemo(() => {
    const count = 5 + Math.floor(Math.random() * 4)
    return Array.from({ length: count }, (_, i) => ({
      height: 0.3 + Math.random() * 0.15,
      offset: i,
    }))
  }, [])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    let cumY = 0
    for (let i = 0; i < children.length; i++) {
      const sway = Math.sin(t * 0.8 + phase + i * 0.5) * 0.08 * (i + 1)
      children[i].position.x = sway
      children[i].position.y = cumY + segments[i].height / 2
      cumY += segments[i].height
    }
  })

  return (
    <group position={position} ref={groupRef}>
      {segments.map((seg, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[0.02, 0.03, seg.height, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#1a6b3a' : '#228b22'}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Fish school using instanced mesh ---
const FISH_COUNT = 30
const fishDummy = new THREE.Object3D()

interface FishData {
  centerX: number
  centerZ: number
  y: number
  orbitRadius: number
  speed: number
  phase: number
  scale: number
}

function FishSchool() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const fish = useMemo<FishData[]>(() => {
    const arr: FishData[] = []
    for (let i = 0; i < FISH_COUNT; i++) {
      arr.push({
        centerX: (Math.random() - 0.5) * 12,
        centerZ: (Math.random() - 0.5) * 12,
        y: 1 + Math.random() * 5,
        orbitRadius: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.08 + Math.random() * 0.08,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FISH_COUNT; i++) {
      const f = fish[i]
      const angle = t * f.speed + f.phase
      const x = f.centerX + Math.cos(angle) * f.orbitRadius
      const z = f.centerZ + Math.sin(angle) * f.orbitRadius
      const y = f.y + Math.sin(t * 0.5 + f.phase) * 0.3
      fishDummy.position.set(x, y, z)
      fishDummy.rotation.set(0, -angle + Math.PI / 2, 0)
      fishDummy.scale.set(f.scale, f.scale * 0.5, f.scale * 1.8)
      fishDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fishDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FISH_COUNT]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#ff8c42" roughness={0.4} metalness={0.2} />
    </instancedMesh>
  )
}

// --- Bubbles using instanced mesh ---
const BUBBLE_COUNT = 80
const bubbleDummy = new THREE.Object3D()

interface BubbleData {
  x: number
  z: number
  speed: number
  phase: number
  scale: number
  startY: number
}

function Bubbles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const bubbles = useMemo<BubbleData[]>(() => {
    const arr: BubbleData[] = []
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 16,
        z: (Math.random() - 0.5) * 16,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.04,
        startY: Math.random() * 8,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = bubbles[i]
      const y = (b.startY + t * b.speed) % 10
      const wobble = Math.sin(t * 2 + b.phase) * 0.1
      bubbleDummy.position.set(b.x + wobble, y, b.z + wobble * 0.5)
      bubbleDummy.scale.setScalar(b.scale)
      bubbleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, bubbleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#aae8ff"
        transparent
        opacity={0.4}
        metalness={0.8}
        roughness={0.1}
      />
    </instancedMesh>
  )
}

// --- Light Rays from above ---
function LightRays() {
  const rays = useMemo(() => {
    return Array.from({ length: 6 }, () => ({
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      rotZ: (Math.random() - 0.5) * 0.3,
    }))
  }, [])

  return (
    <group>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 5, r.z]} rotation={[0, 0, r.rotZ]}>
          <cylinderGeometry args={[0.1, 0.8, 10, 6]} />
          <meshBasicMaterial
            color="#88ccff"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Sandy bottom with rocks ---
function SeaFloor() {
  const rocks = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      pos: [
        (Math.random() - 0.5) * 14,
        Math.random() * 0.15,
        (Math.random() - 0.5) * 14,
      ] as [number, number, number],
      scale: [
        0.2 + Math.random() * 0.4,
        0.15 + Math.random() * 0.2,
        0.2 + Math.random() * 0.4,
      ] as [number, number, number],
    }))
  }, [])

  return (
    <group>
      {/* Sandy ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#c2a678" roughness={0.9} />
      </mesh>
      {/* Rocks */}
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.scale}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshStandardMaterial color="#7a7a6d" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0a3d5c', 0.035)
    scene.background = new THREE.Color('#062a3e')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function UnderwaterCoralReef() {
  const coralConfigs = useMemo(
    () => [
      {
        pos: [-3, 0, -2] as [number, number, number],
        color: '#ff4466',
        height: 2.5,
        radius: 0.25,
      },
      {
        pos: [2, 0, -4] as [number, number, number],
        color: '#ff7733',
        height: 2.0,
        radius: 0.2,
      },
      {
        pos: [-5, 0, 1] as [number, number, number],
        color: '#cc33aa',
        height: 1.8,
        radius: 0.18,
      },
      {
        pos: [4, 0, 2] as [number, number, number],
        color: '#ff5588',
        height: 2.2,
        radius: 0.22,
      },
      {
        pos: [0, 0, -6] as [number, number, number],
        color: '#ee6644',
        height: 1.6,
        radius: 0.2,
      },
      {
        pos: [-1, 0, 3] as [number, number, number],
        color: '#dd44bb',
        height: 2.8,
        radius: 0.28,
      },
      {
        pos: [6, 0, -1] as [number, number, number],
        color: '#ff6655',
        height: 1.4,
        radius: 0.15,
      },
    ],
    [],
  )

  const seaweedPositions = useMemo(
    () => [
      [-2, 0, 1] as [number, number, number],
      [3, 0, -3] as [number, number, number],
      [-4, 0, -3] as [number, number, number],
      [1, 0, 4] as [number, number, number],
      [5, 0, 0] as [number, number, number],
      [-6, 0, -1] as [number, number, number],
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <directionalLight position={[0, 10, 2]} color="#4499cc" intensity={0.8} />
      <ambientLight color="#1a5577" intensity={0.4} />
      <pointLight
        position={[0, 8, 0]}
        color="#66bbee"
        intensity={0.6}
        distance={20}
      />

      <SeaFloor />
      <LightRays />

      {coralConfigs.map((c, i) => (
        <CoralBranch
          key={i}
          position={c.pos}
          color={c.color}
          height={c.height}
          radius={c.radius}
        />
      ))}

      {seaweedPositions.map((pos, i) => (
        <Seaweed key={i} position={pos} />
      ))}

      <FishSchool />
      <Bubbles />
    </>
  )
}
