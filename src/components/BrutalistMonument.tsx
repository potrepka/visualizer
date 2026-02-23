import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#8a8a8a', 20, 80)
    scene.background = new THREE.Color('#9a9a9a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

const concreteMat = {
  color: '#8a8a80',
  roughness: 0.95,
  metalness: 0.05,
}

const darkConcrete = {
  color: '#6a6a60',
  roughness: 0.95,
  metalness: 0.05,
}

function MassiveBlock({
  position,
  size,
  rotation,
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...concreteMat} />
    </mesh>
  )
}

function CantileverBeam({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.6, 2]} />
        <meshStandardMaterial {...concreteMat} />
      </mesh>
      {/* Ribbing underneath */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0]}>
          <boxGeometry args={[0.3, 0.2, 1.8]} />
          <meshStandardMaterial {...darkConcrete} />
        </mesh>
      ))}
    </group>
  )
}

function MonolithicTower({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  const slits: JSX.Element[] = []
  const slitCount = Math.floor(height / 1.5)
  for (let i = 0; i < slitCount; i++) {
    const y = 1.5 + i * 1.5
    slits.push(
      <mesh key={`front-${i}`} position={[0, y, 1.01]}>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>,
      <mesh key={`back-${i}`} position={[0, y, -1.01]}>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>,
    )
  }

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[2, height, 2]} />
        <meshStandardMaterial {...concreteMat} />
      </mesh>
      {slits}
    </group>
  )
}

function BrutalStaircase({ position }: { position: [number, number, number] }) {
  const steps: JSX.Element[] = []
  for (let i = 0; i < 10; i++) {
    steps.push(
      <mesh key={i} position={[0, i * 0.4 + 0.2, i * 0.5]}>
        <boxGeometry args={[2.5, 0.4, 0.5]} />
        <meshStandardMaterial {...darkConcrete} />
      </mesh>,
    )
  }

  return (
    <group position={position}>
      {steps}
      {/* Railing walls */}
      <mesh position={[-1.4, 2.2, 2.5]} rotation={[Math.atan2(4, 5), 0, 0]}>
        <boxGeometry args={[0.15, 0.8, 6.5]} />
        <meshStandardMaterial {...concreteMat} />
      </mesh>
      <mesh position={[1.4, 2.2, 2.5]} rotation={[Math.atan2(4, 5), 0, 0]}>
        <boxGeometry args={[0.15, 0.8, 6.5]} />
        <meshStandardMaterial {...concreteMat} />
      </mesh>
    </group>
  )
}

function PlazaGrid() {
  const lines: JSX.Element[] = []
  for (let i = -10; i <= 10; i++) {
    lines.push(
      <mesh key={`x-${i}`} position={[i * 2, 0.02, 0]}>
        <boxGeometry args={[0.05, 0.01, 40]} />
        <meshStandardMaterial color="#7a7a70" />
      </mesh>,
      <mesh key={`z-${i}`} position={[0, 0.02, i * 2]}>
        <boxGeometry args={[40, 0.01, 0.05]} />
        <meshStandardMaterial color="#7a7a70" />
      </mesh>,
    )
  }
  return <group>{lines}</group>
}

function ReflectingPool() {
  return (
    <group position={[0, 0, 10]}>
      {/* Pool border */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[6.4, 0.16, 3.4]} />
        <meshStandardMaterial {...darkConcrete} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color="#3a4a5a"
          metalness={0.8}
          roughness={0.05}
        />
      </mesh>
    </group>
  )
}

function LightFixture({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial
          color="#ffeecc"
          emissive="#ffddaa"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

function FloatingElement() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.position.y = 12 + Math.sin(t * 0.3) * 0.5
    meshRef.current.rotation.y = t * 0.1
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 12, 0]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial {...concreteMat} />
    </mesh>
  )
}

function MonumentComplex() {
  return (
    <group>
      {/* Central massive slab, tilted */}
      <MassiveBlock
        position={[0, 4, 0]}
        size={[5, 8, 3]}
        rotation={[0, 0, 0.08]}
      />

      {/* Flanking towers */}
      <MonolithicTower position={[-6, 0, -2]} height={10} />
      <MonolithicTower position={[6, 0, -2]} height={8} />

      {/* Cantilever beams */}
      <CantileverBeam position={[0, 8.3, 0]} />
      <CantileverBeam position={[-3, 5, -3]} rotation={[0, Math.PI / 4, 0]} />

      {/* Angular walls */}
      <MassiveBlock
        position={[-4, 1.5, 4]}
        size={[6, 3, 0.4]}
        rotation={[0, 0.3, 0]}
      />
      <MassiveBlock
        position={[4, 2, 5]}
        size={[5, 4, 0.4]}
        rotation={[0, -0.2, 0.05]}
      />

      {/* Horizontal platform */}
      <MassiveBlock position={[0, 0.3, -5]} size={[12, 0.6, 4]} />

      {/* Stacked offset blocks */}
      <MassiveBlock
        position={[8, 1.5, 3]}
        size={[3, 3, 3]}
        rotation={[0, 0.4, 0]}
      />
      <MassiveBlock
        position={[8.5, 4, 3.2]}
        size={[2.5, 2, 2.5]}
        rotation={[0, 0.6, 0.05]}
      />

      {/* Vertical fin */}
      <MassiveBlock
        position={[-8, 4, 0]}
        size={[0.3, 8, 4]}
        rotation={[0, 0, -0.1]}
      />
    </group>
  )
}

export default function BrutalistMonument() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 15, 5]}
        color="#ffffff"
        intensity={1.5}
      />
      <directionalLight
        position={[-8, 10, -5]}
        color="#aaaacc"
        intensity={0.5}
      />
      <ambientLight intensity={0.15} />

      {/* Ground plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#7a7a70" roughness={0.9} />
      </mesh>

      <PlazaGrid />
      <MonumentComplex />
      <FloatingElement />
      <BrutalStaircase position={[0, 0, 6]} />
      <ReflectingPool />

      {/* Light fixtures */}
      <LightFixture position={[-8, 0, 8]} />
      <LightFixture position={[8, 0, 8]} />
      <LightFixture position={[-8, 0, -8]} />
      <LightFixture position={[8, 0, -8]} />
      <LightFixture position={[0, 0, 12]} />
    </>
  )
}
