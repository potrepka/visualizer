import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#a0c4d8', 25, 70)
    scene.background = new THREE.Color('#87b5cc')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CoastalRock({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const segments = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
      rot: number
    }[] = []
    for (let i = 0; i < 3; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 0.5,
          Math.random() * 0.2,
          (Math.random() - 0.5) * 0.5,
        ],
        size: [
          0.5 + Math.random() * 0.8,
          0.3 + Math.random() * 0.5,
          0.5 + Math.random() * 0.8,
        ],
        rot: Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  return (
    <group position={position} scale={scale}>
      {segments.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[s.rot, 0, s.rot * 0.5]}>
          <boxGeometry args={s.size} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#5a5a58' : '#6e6e6a'}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function TidePool({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  const waterRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    waterRef.current.position.y = position[1] + 0.02 + Math.sin(t * 1.5) * 0.005
  })

  return (
    <group>
      {/* Pool basin */}
      <mesh
        position={[position[0], position[1] - 0.05, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[radius + 0.15, 24]} />
        <meshStandardMaterial color="#4a4a48" roughness={0.95} />
      </mesh>
      {/* Water surface */}
      <mesh ref={waterRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 24]} />
        <meshStandardMaterial
          color="#2a7a8a"
          transparent
          opacity={0.7}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

function Starfish({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const arms = useMemo(() => {
    const arr: { rot: number }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({ rot: (i * Math.PI * 2) / 5 })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Center */}
      <mesh>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      {arms.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a.rot) * 0.06, 0, Math.sin(a.rot) * 0.06]}
          rotation={[0, -a.rot, Math.PI / 2]}
        >
          <coneGeometry args={[0.015, 0.1, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

function Anemone({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    for (let i = 1; i < children.length; i++) {
      const angle = ((i - 1) / (children.length - 1)) * Math.PI * 2
      children[i].rotation.x = Math.sin(t * 2 + angle) * 0.2
      children[i].rotation.z = Math.cos(t * 2 + angle) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Base */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.025, 0.05, Math.sin(angle) * 0.025]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.06, 4]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Seaweed({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = Math.sin(t * 1.5 + position[0]) * 0.15
    groupRef.current.rotation.x = Math.sin(t * 1.2 + position[2]) * 0.1
  })

  return (
    <group ref={groupRef} position={position}>
      {[0, 0.08, 0.16, 0.24].map((y, i) => (
        <mesh key={i} position={[Math.sin(i * 0.4) * 0.02, y, 0]}>
          <boxGeometry args={[0.03, 0.08, 0.01]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#2a6e2a' : '#1e5e1e'} />
        </mesh>
      ))}
    </group>
  )
}

function WaveCrash({ zPosition }: { zPosition: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const cycle = (t * 0.4) % 1
    groupRef.current.position.z = zPosition - 3 + cycle * 6
    groupRef.current.scale.y = 0.5 + Math.sin(cycle * Math.PI) * 0.8
    const mat = (groupRef.current.children[0] as THREE.Mesh)
      .material as THREE.MeshStandardMaterial
    mat.opacity = 0.3 + Math.sin(cycle * Math.PI) * 0.3
  })

  return (
    <group ref={groupRef} position={[0, 0.2, zPosition]}>
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[20, 0.4, 0.3]} />
        <meshStandardMaterial color="#e0f0f8" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function OceanSurface() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.03
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 8]}>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial
        color="#1a5a7a"
        transparent
        opacity={0.8}
        metalness={0.4}
        roughness={0.1}
      />
    </mesh>
  )
}

function SandyGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#c4aa78" />
    </mesh>
  )
}

export default function TidePools() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 8, 3]} intensity={1.1} color="#fff5e0" />
      <ambientLight intensity={0.3} color="#a0c0d0" />
      <hemisphereLight args={['#87ceeb', '#c4aa78', 0.3]} />

      <SandyGround />
      <OceanSurface />

      {/* Coastal rocks */}
      <CoastalRock position={[-3, 0, -1]} scale={1.5} />
      <CoastalRock position={[2, 0, 0]} scale={1.2} />
      <CoastalRock position={[-1, 0, 2]} scale={1.8} />
      <CoastalRock position={[4, 0, -2]} scale={1.0} />
      <CoastalRock position={[-5, 0, 1]} scale={2.0} />
      <CoastalRock position={[0, 0, -3]} scale={1.3} />

      {/* Tide pools */}
      <TidePool position={[-1.5, 0.05, 0]} radius={0.6} />
      <TidePool position={[1, 0.03, -1]} radius={0.4} />
      <TidePool position={[-3, 0.04, 1.5]} radius={0.5} />
      <TidePool position={[3, 0.05, 0.5]} radius={0.35} />

      {/* Starfish */}
      <Starfish position={[-1.3, 0.08, 0.1]} color="#cc4422" />
      <Starfish position={[1.2, 0.06, -0.8]} color="#dd6633" />
      <Starfish position={[-3.2, 0.07, 1.3]} color="#cc3355" />

      {/* Anemones */}
      <Anemone position={[-1.6, 0.06, -0.2]} color="#9944aa" />
      <Anemone position={[0.8, 0.05, -1.2]} color="#cc4488" />
      <Anemone position={[-2.8, 0.06, 1.8]} color="#6644cc" />

      {/* Seaweed */}
      <Seaweed position={[-2, 0, 0.5]} />
      <Seaweed position={[0.5, 0, -0.5]} />
      <Seaweed position={[-4, 0, 1]} />
      <Seaweed position={[2.5, 0, -1.5]} />

      {/* Wave crashes */}
      <WaveCrash zPosition={5} />
      <WaveCrash zPosition={6} />
      <WaveCrash zPosition={7} />
    </>
  )
}
