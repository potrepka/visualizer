import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#6baadd', 25, 70)
    scene.background = new THREE.Color('#6baadd')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Ocean Surface ---
function Ocean() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.15 + t * 0.7) * 0.2 +
        Math.sin(z * 0.2 + t * 0.5) * 0.15 +
        Math.sin((x + z) * 0.1 + t * 0.9) * 0.1
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[80, 80, 60, 60]} />
      <meshStandardMaterial
        color="#1a6aaa"
        metalness={0.5}
        roughness={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Sailboat ---
function Sailboat({
  position,
  color,
  sailColor,
  speed,
  courseAngle,
}: {
  position: [number, number, number]
  color: string
  sailColor: string
  speed: number
  courseAngle: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const sailRef = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Forward motion
    groupRef.current.position.x =
      position[0] + Math.sin(courseAngle) * t * speed
    groupRef.current.position.z =
      position[2] + Math.cos(courseAngle) * t * speed
    // Rocking
    groupRef.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.06
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + phase) * 0.1
    groupRef.current.rotation.y = courseAngle
    // Sail billow
    const geo = sailRef.current.geometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const bulge = Math.sin((y + 1) * 1.2) * 0.15 * (1 - Math.abs(x) * 0.8)
      pos.setZ(i, bulge + Math.sin(t * 2 + x) * 0.02)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Hull */}
      <mesh position={[0, 0, 0]} scale={[1.2, 0.3, 0.4]}>
        <sphereGeometry args={[1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Deck */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 0.75]} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 2.6, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Main sail (triangle approx via plane) */}
      <mesh ref={sailRef} position={[0.3, 1.2, 0.05]}>
        <planeGeometry args={[1, 2, 8, 8]} />
        <meshStandardMaterial
          color={sailColor}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Jib sail */}
      <mesh position={[0.8, 1.0, 0.05]} rotation={[0, 0.2, 0]}>
        <planeGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Keel */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.04]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Number on sail */}
      <mesh position={[0.3, 1.4, 0.06]}>
        <boxGeometry args={[0.15, 0.15, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

// --- Buoy Marker ---
function Buoy({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1
    ref.current.rotation.z = Math.sin(t * 0.8 + position[2]) * 0.1
  })
  return (
    <group ref={ref} position={position}>
      {/* Buoy body */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.27, 0.15, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Top pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Flag on top */}
      <mesh position={[0.08, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.01]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// --- Wind Indicator (streamer lines) ---
const STREAMER_COUNT = 30
const streamerDummy = new THREE.Object3D()

function WindStreamers() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(() => {
    return Array.from({ length: STREAMER_COUNT }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: 3 + Math.random() * 5,
      z: (Math.random() - 0.5) * 40,
      speed: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < STREAMER_COUNT; i++) {
      const d = data[i]
      streamerDummy.position.set(
        d.x + Math.sin(t * 0.3 + d.phase) * 2,
        d.y,
        d.z + t * d.speed * 0.3,
      )
      // Wrap around
      if (streamerDummy.position.z > 20) {
        streamerDummy.position.z -= 40
      }
      streamerDummy.scale.set(0.8 + Math.sin(t + d.phase) * 0.3, 0.02, 0.02)
      streamerDummy.rotation.set(0, Math.sin(t * 0.5 + d.phase) * 0.3, 0)
      streamerDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, streamerDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STREAMER_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  )
}

// --- Race Course Boats ---
function RaceFleet() {
  const boats = useMemo(
    () => [
      {
        pos: [0, 0, 0] as [number, number, number],
        color: '#cc2222',
        sail: '#ffffff',
        speed: 0.4,
        angle: 0.3,
      },
      {
        pos: [3, 0, 2] as [number, number, number],
        color: '#2244cc',
        sail: '#ffffcc',
        speed: 0.35,
        angle: 0.25,
      },
      {
        pos: [-2, 0, 4] as [number, number, number],
        color: '#22aa44',
        sail: '#ffffff',
        speed: 0.38,
        angle: 0.35,
      },
      {
        pos: [5, 0, -1] as [number, number, number],
        color: '#ddaa22',
        sail: '#eeeeff',
        speed: 0.42,
        angle: 0.2,
      },
      {
        pos: [-4, 0, 1] as [number, number, number],
        color: '#cc44cc',
        sail: '#ffffff',
        speed: 0.36,
        angle: 0.32,
      },
      {
        pos: [1, 0, 6] as [number, number, number],
        color: '#ee6622',
        sail: '#ffffee',
        speed: 0.37,
        angle: 0.28,
      },
      {
        pos: [-6, 0, -3] as [number, number, number],
        color: '#44cccc',
        sail: '#ffffff',
        speed: 0.33,
        angle: 0.22,
      },
    ],
    [],
  )

  return (
    <group>
      {boats.map((b, i) => (
        <Sailboat
          key={i}
          position={b.pos}
          color={b.color}
          sailColor={b.sail}
          speed={b.speed}
          courseAngle={b.angle}
        />
      ))}
    </group>
  )
}

// --- Buoy Course ---
function BuoyCourse() {
  const buoys = useMemo(
    () => [
      { pos: [-8, 0, -8] as [number, number, number], color: '#ff4444' },
      { pos: [8, 0, -8] as [number, number, number], color: '#ff4444' },
      { pos: [12, 0, 8] as [number, number, number], color: '#ffaa22' },
      { pos: [-12, 0, 8] as [number, number, number], color: '#ffaa22' },
      { pos: [0, 0, 15] as [number, number, number], color: '#ff4444' },
    ],
    [],
  )

  return (
    <group>
      {buoys.map((b, i) => (
        <Buoy key={i} position={b.pos} color={b.color} />
      ))}
    </group>
  )
}

// --- Main Scene ---
export default function SailingRegatta() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.4} color="#aaddff" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.4}
        color="#fff8e0"
      />
      <directionalLight
        position={[-5, 8, -8]}
        intensity={0.3}
        color="#88aaff"
      />
      <Ocean />
      <RaceFleet />
      <BuoyCourse />
      <WindStreamers />
    </>
  )
}
