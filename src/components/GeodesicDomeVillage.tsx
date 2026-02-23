import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8e8d0', 30, 100)
    scene.background = new THREE.Color('#88ccaa')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function GeodesicDome({
  position,
  radius,
  color,
  opacity,
}: {
  position: [number, number, number]
  radius: number
  color: string
  opacity?: number
}) {
  return (
    <group position={position}>
      {/* Dome shell - icosahedron approximation */}
      <mesh position={[0, radius * 0.45, 0]}>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial
          color={color}
          transparent={opacity !== undefined}
          opacity={opacity ?? 1}
          metalness={0.2}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh position={[0, radius * 0.45, 0]}>
        <icosahedronGeometry args={[radius * 1.002, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.85, 0.1, 8, 24]} />
        <meshStandardMaterial color="#666666" roughness={0.8} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.85, 24]} />
        <meshStandardMaterial color="#ddd8c8" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Walkway({
  start,
  end,
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  const dx = end[0] - start[0]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  const midX = (start[0] + end[0]) / 2
  const midZ = (start[2] + end[2]) / 2

  return (
    <group>
      {/* Path surface */}
      <mesh position={[midX, 0.05, midZ]} rotation={[0, angle, 0]}>
        <boxGeometry args={[1.0, 0.1, length]} />
        <meshStandardMaterial color="#bbbbaa" roughness={0.8} />
      </mesh>
      {/* Side rails */}
      <mesh
        position={[
          midX + Math.cos(angle) * 0.55,
          0.3,
          midZ - Math.sin(angle) * 0.55,
        ]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.05, 0.4, length]} />
        <meshStandardMaterial color="#888877" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh
        position={[
          midX - Math.cos(angle) * 0.55,
          0.3,
          midZ + Math.sin(angle) * 0.55,
        ]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.05, 0.4, length]} />
        <meshStandardMaterial color="#888877" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

function GardenPatch({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  const plants = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const r = radius * 0.5 * (0.5 + Math.random() * 0.5)
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        h: 0.2 + Math.random() * 0.3,
        color: ['#2a8a3a', '#3a9a4a', '#4aaa5a', '#1a7a2a'][
          Math.floor(Math.random() * 4)
        ],
      })
    }
    return arr
  }, [radius])

  return (
    <group position={position}>
      {/* Soil bed */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 12]} />
        <meshStandardMaterial color="#5a4a2a" />
      </mesh>
      {/* Plants */}
      {plants.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 + 0.05, p.z]}>
          <sphereGeometry args={[p.h * 0.8, 6, 6]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  )
}

function SolarPanel({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 6]} />
        <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.6]} />
        <meshStandardMaterial color="#2244aa" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function WindTurbine({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    bladesRef.current.rotation.z = clock.getElapsedTime() * 2
  })

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 6, 8]} />
        <meshStandardMaterial color="#dddddd" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Hub */}
      <mesh position={[0, 6.1, 0.1]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef} position={[0, 6.1, 0.2]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, 0, (i * Math.PI * 2) / 3]}
          >
            <boxGeometry args={[0.12, 2.5, 0.02]} />
            <meshStandardMaterial color="#eeeeee" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function GlowingPathLight({
  position,
}: {
  position: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + position[0]) * 0.3
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh ref={meshRef} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#aaffaa"
          emissive="#66ff66"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export default function GeodesicDomeVillage() {
  const domes = useMemo(
    () => [
      {
        pos: [0, 0, 0] as [number, number, number],
        r: 3,
        color: '#aaddee',
        opacity: 0.6,
      },
      {
        pos: [-7, 0, -3] as [number, number, number],
        r: 2,
        color: '#bbddaa',
        opacity: 0.5,
      },
      {
        pos: [6, 0, -4] as [number, number, number],
        r: 2.5,
        color: '#ddbbaa',
        opacity: 0.55,
      },
      {
        pos: [-4, 0, 5] as [number, number, number],
        r: 1.8,
        color: '#ddddaa',
        opacity: 0.5,
      },
      {
        pos: [5, 0, 5] as [number, number, number],
        r: 2.2,
        color: '#aabbdd',
        opacity: 0.55,
      },
      {
        pos: [-8, 0, -8] as [number, number, number],
        r: 1.5,
        color: '#ccaadd',
        opacity: 0.5,
      },
      {
        pos: [9, 0, 1] as [number, number, number],
        r: 1.8,
        color: '#aaddcc',
        opacity: 0.5,
      },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} color="#ffffff" intensity={1.3} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#88ccff', '#44aa44', 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#5a8a4a" />
      </mesh>

      {/* Domes */}
      {domes.map((d, i) => (
        <GeodesicDome
          key={i}
          position={d.pos}
          radius={d.r}
          color={d.color}
          opacity={d.opacity}
        />
      ))}

      {/* Walkways connecting domes */}
      <Walkway start={[0, 0, 0]} end={[-7, 0, -3]} />
      <Walkway start={[0, 0, 0]} end={[6, 0, -4]} />
      <Walkway start={[0, 0, 0]} end={[-4, 0, 5]} />
      <Walkway start={[0, 0, 0]} end={[5, 0, 5]} />
      <Walkway start={[-7, 0, -3]} end={[-8, 0, -8]} />
      <Walkway start={[6, 0, -4]} end={[9, 0, 1]} />

      {/* Garden patches */}
      <GardenPatch position={[3, 0, -1]} radius={1.2} />
      <GardenPatch position={[-3, 0, 2]} radius={1.0} />
      <GardenPatch position={[1, 0, 7]} radius={1.5} />
      <GardenPatch position={[-6, 0, 1]} radius={0.8} />

      {/* Solar panels */}
      <SolarPanel position={[10, 0, -8]} />
      <SolarPanel position={[11, 0, -7]} />
      <SolarPanel position={[12, 0, -8]} />

      {/* Wind turbine */}
      <WindTurbine position={[-12, 0, -5]} />

      {/* Path lights */}
      {[
        [-2, 0, -1],
        [2, 0, -1],
        [-1, 0, 2],
        [1, 0, 2],
        [-5, 0, -1],
        [4, 0, -2],
        [-2, 0, 4],
        [3, 0, 4],
        [-6, 0, -5],
        [7, 0, -1],
      ].map((pos, i) => (
        <GlowingPathLight key={i} position={pos as [number, number, number]} />
      ))}
    </>
  )
}
