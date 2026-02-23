import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a18', 20, 80)
    scene.background = new THREE.Color('#0a0a18')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RooftopFloor() {
  return (
    <group>
      {/* Main roof surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333340" roughness={0.8} />
      </mesh>
      {/* Roof edge parapet */}
      {[
        {
          pos: [0, 0.4, -10] as [number, number, number],
          size: [20, 0.8, 0.3] as [number, number, number],
        },
        {
          pos: [0, 0.4, 10] as [number, number, number],
          size: [20, 0.8, 0.3] as [number, number, number],
        },
        {
          pos: [-10, 0.4, 0] as [number, number, number],
          size: [0.3, 0.8, 20] as [number, number, number],
        },
        {
          pos: [10, 0.4, 0] as [number, number, number],
          size: [0.3, 0.8, 20] as [number, number, number],
        },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#444450" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function WaterTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Legs */}
      {[
        [-0.8, 0, -0.8],
        [0.8, 0, -0.8],
        [-0.8, 0, 0.8],
        [0.8, 0, 0.8],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 1.5, pos[2]]}>
          <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
        </mesh>
      ))}
      {/* Tank */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.2, 1.0, 2, 12]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 4.7, 0]}>
        <coneGeometry args={[1.3, 0.8, 12]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      {/* Cross braces */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 0.06, 0.06]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2, 0.06, 0.06]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
    </group>
  )
}

function ACUnit({ position }: { position: [number, number, number] }) {
  const fanRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    fanRef.current.rotation.z = clock.getElapsedTime() * 4
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#667777" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Fan grille */}
      <mesh position={[0, 0.4, 0.41]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color="#334444" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Fan */}
      <mesh ref={fanRef} position={[0, 0.4, 0.42]}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
        <meshStandardMaterial color="#556666" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function SatelliteDish({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Base pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1.5, 6]} />
        <meshStandardMaterial color="#778888" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Dish */}
      <mesh position={[0, 1.6, 0]} rotation={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial
          color="#aabbcc"
          metalness={0.7}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Receiver */}
      <mesh position={[0, 1.9, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
        <meshStandardMaterial color="#889999" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function CitySkyline() {
  const buildings = useMemo(() => {
    const arr = []
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 25 + Math.random() * 40
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        width: 2 + Math.random() * 4,
        height: 5 + Math.random() * 25,
        depth: 2 + Math.random() * 4,
        hue: Math.random() > 0.7 ? 200 + Math.random() * 160 : 0,
        saturation: Math.random() > 0.7 ? 60 : 0,
        emissive: Math.random() > 0.6,
      })
    }
    return arr
  }, [])

  return (
    <group position={[0, -10, 0]}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.height / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color={`hsl(${b.hue}, ${b.saturation}%, 15%)`}
              emissive={b.emissive ? `hsl(${b.hue}, 70%, 20%)` : '#000000'}
              emissiveIntensity={b.emissive ? 0.5 : 0}
            />
          </mesh>
          {/* Rooftop light */}
          {Math.random() > 0.5 && (
            <mesh position={[0, b.height / 2 + 0.1, 0]}>
              <sphereGeometry args={[0.15, 6, 6]} />
              <meshStandardMaterial
                color={Math.random() > 0.5 ? '#ff3366' : '#3366ff'}
                emissive={Math.random() > 0.5 ? '#ff3366' : '#3366ff'}
                emissiveIntensity={2}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function NeonGlowBelow() {
  const colors = ['#ff0066', '#00ffff', '#ff6600', '#aa00ff', '#00ff66']
  return (
    <group position={[0, -9, 0]}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const dist = 15 + Math.random() * 30
        const color = colors[Math.floor(Math.random() * colors.length)]
        return (
          <pointLight
            key={i}
            position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}
            color={color}
            intensity={8}
            distance={15}
          />
        )
      })}
    </group>
  )
}

function Antenna({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = lightRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = Math.sin(t * 2) > 0 ? 2 : 0.2
  })

  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 4, 6]} />
        <meshStandardMaterial color="#667777" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={lightRef} position={[0, 4.1, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

function NightSky() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 200
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4
      const r = 80
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi) + 10,
        z: r * Math.sin(phi) * Math.sin(theta),
        scale: 0.03 + Math.random() * 0.06,
      })
    }
    return arr
  }, [count])

  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const s = stars[i]
      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

export default function NeonCityRooftop() {
  return (
    <>
      <SceneSetup />

      <ambientLight intensity={0.06} />
      <directionalLight position={[5, 10, 3]} color="#4466aa" intensity={0.3} />

      <NightSky />
      <RooftopFloor />

      {/* Water tower */}
      <WaterTower position={[-6, 0, -5]} />

      {/* AC units */}
      <ACUnit position={[3, 0, -4]} />
      <ACUnit position={[5, 0, -4]} />
      <ACUnit position={[4, 0, -6]} />

      {/* Satellite dishes */}
      <SatelliteDish position={[7, 0, 3]} rotation={[0, -0.5, 0]} />
      <SatelliteDish position={[-5, 0, 6]} rotation={[0, 1.2, 0]} />

      {/* Antennas */}
      <Antenna position={[8, 0, -8]} />
      <Antenna position={[-8, 0, 7]} />

      {/* City skyline below */}
      <CitySkyline />

      {/* Neon glow from streets below */}
      <NeonGlowBelow />
    </>
  )
}
