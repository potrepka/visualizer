import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8d8e8', 40, 120)
    scene.background = new THREE.Color('#87CEEB')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Pillar({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <meshStandardMaterial color="#c8b898" roughness={0.9} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.3 + height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color="#d4c4a4" roughness={0.85} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 0.3 + height + 0.15, 0]}>
        <boxGeometry args={[1.1, 0.3, 1.1]} />
        <meshStandardMaterial color="#c8b898" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Arch({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  const archSegments = 12
  const archRadius = 2.0
  const elements: JSX.Element[] = []

  for (let i = 0; i <= archSegments; i++) {
    const angle = (Math.PI / archSegments) * i
    const x = Math.cos(angle) * archRadius
    const y = Math.sin(angle) * archRadius + height - archRadius
    elements.push(
      <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
        <boxGeometry args={[0.25, 0.4, 0.7]} />
        <meshStandardMaterial color="#d4c4a4" roughness={0.85} />
      </mesh>,
    )
  }

  return <group position={position}>{elements}</group>
}

function AqueductSpan({ x }: { x: number }) {
  const pillarHeight = 5
  const spacing = 5

  return (
    <group position={[x, 0, 0]}>
      <Pillar position={[-spacing / 2, 0, 0]} height={pillarHeight} />
      <Pillar position={[spacing / 2, 0, 0]} height={pillarHeight} />
      <Arch position={[0, 0.3, 0]} height={pillarHeight} />

      {/* Top beam */}
      <mesh position={[0, pillarHeight + 0.6, 0]}>
        <boxGeometry args={[spacing + 1.2, 0.4, 1.0]} />
        <meshStandardMaterial color="#c8b898" roughness={0.85} />
      </mesh>
    </group>
  )
}

function WaterChannel({ length }: { length: number }) {
  return (
    <group position={[0, 6.1, 0]}>
      {/* Channel walls */}
      <mesh position={[0, 0.15, 0.35]}>
        <boxGeometry args={[length, 0.3, 0.1]} />
        <meshStandardMaterial color="#b8a888" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, -0.35]}>
        <boxGeometry args={[length, 0.3, 0.1]} />
        <meshStandardMaterial color="#b8a888" roughness={0.9} />
      </mesh>
      {/* Channel floor */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, 0.06, 0.6]} />
        <meshStandardMaterial color="#b8a888" roughness={0.9} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[length, 0.12, 0.5]} />
        <meshStandardMaterial
          color="#4488aa"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function RollingHill({
  position,
  scaleXZ,
  height,
  color,
}: {
  position: [number, number, number]
  scaleXZ: number
  height: number
  color: string
}) {
  return (
    <mesh position={position} scale={[scaleXZ, height, scaleXZ]}>
      <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function MediterraneanTree({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.6, 6]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, 1.8, 0]} scale={[1, 1.4, 1]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#4a7a3a" />
      </mesh>
    </group>
  )
}

function CypressTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 2.0, 6]} />
        <meshStandardMaterial color="#4a2a1a" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.25, 2.0, 6]} />
        <meshStandardMaterial color="#2a5a2a" />
      </mesh>
    </group>
  )
}

function WaterFlow() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.1 + Math.sin(t * 2) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 6.22, 0]}>
      <boxGeometry args={[30, 0.02, 0.45]} />
      <meshStandardMaterial
        color="#66aacc"
        emissive="#4488aa"
        emissiveIntensity={0.1}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

function Clouds() {
  const groupRef = useRef<THREE.Group>(null!)
  const clouds = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 60,
        y: 15 + Math.random() * 8,
        z: -15 - Math.random() * 20,
        scale: 1.5 + Math.random() * 2.0,
        speed: 0.2 + Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      children[i].position.x = clouds[i].x + t * clouds[i].speed
      if (children[i].position.x > 35) children[i].position.x = -35
    }
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.y, c.z]}
          scale={[c.scale * 2, c.scale * 0.4, c.scale]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default function RomanAqueduct() {
  const spans = 5
  const spacing = 5

  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} color="#fff5e0" intensity={1.4} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#87CEEB', '#8a7a5a', 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#8aaa5a" />
      </mesh>

      {/* Aqueduct spans */}
      {Array.from({ length: spans }, (_, i) => (
        <AqueductSpan key={i} x={(i - (spans - 1) / 2) * spacing} />
      ))}

      <WaterChannel length={spans * spacing + 2} />
      <WaterFlow />

      {/* Rolling hills */}
      <RollingHill
        position={[-20, 0, -15]}
        scaleXZ={12}
        height={3}
        color="#7a9a5a"
      />
      <RollingHill
        position={[15, 0, -20]}
        scaleXZ={10}
        height={2.5}
        color="#6a8a4a"
      />
      <RollingHill
        position={[0, 0, -25]}
        scaleXZ={15}
        height={4}
        color="#7a9a5a"
      />
      <RollingHill
        position={[-25, 0, 10]}
        scaleXZ={8}
        height={2}
        color="#6a8a4a"
      />

      {/* Mediterranean trees */}
      {[
        [-8, 0, 5],
        [10, 0, 6],
        [-12, 0, -3],
        [14, 0, -5],
        [-6, 0, -8],
        [8, 0, -7],
        [-15, 0, 8],
        [16, 0, 3],
      ].map((pos, i) => (
        <MediterraneanTree key={i} position={pos as [number, number, number]} />
      ))}

      {/* Cypress trees */}
      {[
        [-4, 0, 10],
        [5, 0, 9],
        [-10, 0, 12],
        [12, 0, 11],
      ].map((pos, i) => (
        <CypressTree key={i} position={pos as [number, number, number]} />
      ))}

      <Clouds />
    </>
  )
}
