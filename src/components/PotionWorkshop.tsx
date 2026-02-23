import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a0e08', 5, 30)
    scene.background = new THREE.Color('#1a0e08')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function PotionBottle({
  position,
  liquidColor,
  glowIntensity = 1,
}: {
  position: [number, number, number]
  liquidColor: string
  glowIntensity?: number
}) {
  const liquidRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = liquidRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity =
      glowIntensity * (0.6 + Math.sin(t * 2 + position[0] * 3) * 0.4)
  })

  return (
    <group position={position}>
      {/* Bottle body */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.6, 8]} />
        <meshPhysicalMaterial
          color="#8899aa"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      {/* Bottle neck */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.25, 8]} />
        <meshPhysicalMaterial
          color="#8899aa"
          transparent
          opacity={0.3}
          roughness={0.05}
        />
      </mesh>
      {/* Cork */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.1, 6]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      {/* Liquid inside */}
      <mesh ref={liquidRef} position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.4, 8]} />
        <meshStandardMaterial
          color={liquidColor}
          emissive={liquidColor}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function Shelf({
  position,
  width,
}: {
  position: [number, number, number]
  width: number
}) {
  return (
    <group position={position}>
      {/* Shelf plank */}
      <mesh>
        <boxGeometry args={[width, 0.06, 0.35]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.85} />
      </mesh>
      {/* Left bracket */}
      <mesh position={[-width / 2 + 0.1, -0.12, 0.12]}>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#3a2510" roughness={0.9} />
      </mesh>
      {/* Right bracket */}
      <mesh position={[width / 2 - 0.1, -0.12, 0.12]}>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#3a2510" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Cauldron() {
  const bubblesRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const bubbleCount = 30
  const bubbleData = useMemo(() => {
    const arr: { x: number; z: number; speed: number; phase: number }[] = []
    for (let i = 0; i < bubbleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * 0.35
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < bubbleCount; i++) {
      const b = bubbleData[i]
      const y = (t * b.speed + b.phase) % 1.2
      dummy.position.set(b.x, y + 0.4, b.z)
      const s = 0.02 + Math.sin(t * 3 + b.phase) * 0.01
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      bubblesRef.current.setMatrixAt(i, dummy.matrix)
    }
    bubblesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Cauldron body */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.35, 0.8, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.82, 0]}>
        <torusGeometry args={[0.5, 0.04, 8, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Liquid surface */}
      <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.47, 16]} />
        <meshStandardMaterial
          color="#22cc44"
          emissive="#11aa33"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Legs */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.3, 0.08, Math.sin(angle) * 0.3]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[undefined, undefined, bubbleCount]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#44ff66"
          emissive="#22dd44"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </instancedMesh>
    </group>
  )
}

function SpellBook({
  position,
  rotation = [0, 0, 0],
  color = '#5c1a1a',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cover */}
      <mesh>
        <boxGeometry args={[0.25, 0.04, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.29]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.95} />
      </mesh>
      {/* Spine detail */}
      <mesh position={[-0.125, 0, 0]}>
        <boxGeometry args={[0.02, 0.05, 0.32]} />
        <meshStandardMaterial color="#3a0e0e" roughness={0.7} />
      </mesh>
    </group>
  )
}

function WorkTable() {
  return (
    <group position={[2, 0, -1]}>
      {/* Table top */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.85} />
      </mesh>
      {/* Legs */}
      {[
        [-0.8, 0.45, -0.3],
        [0.8, 0.45, -0.3],
        [-0.8, 0.45, 0.3],
        [0.8, 0.45, 0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#4a2e14" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function IngredientJar({
  position,
  contentColor,
}: {
  position: [number, number, number]
  contentColor: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.24, 8]} />
        <meshPhysicalMaterial
          color="#aabbcc"
          transparent
          opacity={0.25}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.14, 8]} />
        <meshStandardMaterial color={contentColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.04, 8]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
    </group>
  )
}

function WallAndFloor() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#3a2810" roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 3, -3]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      {/* Side wall */}
      <mesh position={[-4, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
    </>
  )
}

function FloatingParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 40
  const particles = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: 0.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 6,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.5,
        p.y + Math.sin(t * 0.5 + p.phase) * 0.3,
        p.z + Math.cos(t * p.speed + p.phase) * 0.5,
      )
      dummy.scale.setScalar(0.015 + Math.sin(t * 2 + p.phase) * 0.005)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffcc44"
        emissive="#ffaa22"
        emissiveIntensity={3}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

export default function PotionWorkshop() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[2, 5, 3]} intensity={0.3} color="#ff9944" />
      <ambientLight intensity={0.08} color="#442200" />
      <pointLight
        position={[0, 1.2, 0]}
        intensity={2}
        color="#22cc44"
        distance={5}
      />
      <pointLight
        position={[2, 1.5, -1]}
        intensity={1.5}
        color="#ff8833"
        distance={6}
      />
      <pointLight
        position={[-2, 2, 1]}
        intensity={0.8}
        color="#9944ff"
        distance={5}
      />

      <WallAndFloor />
      <Cauldron />

      {/* Shelves with potions */}
      <Shelf position={[-3.9, 1.5, -1]} width={2.2} />
      <PotionBottle
        position={[-4.4, 1.56, -1]}
        liquidColor="#ff2244"
        glowIntensity={1.2}
      />
      <PotionBottle
        position={[-4.0, 1.56, -1]}
        liquidColor="#4422ff"
        glowIntensity={0.8}
      />
      <PotionBottle
        position={[-3.6, 1.56, -1]}
        liquidColor="#ff8800"
        glowIntensity={1.0}
      />
      <PotionBottle
        position={[-3.2, 1.56, -1]}
        liquidColor="#cc22ff"
        glowIntensity={1.5}
      />

      <Shelf position={[-3.9, 2.3, -1]} width={2.2} />
      <PotionBottle
        position={[-4.3, 2.36, -1]}
        liquidColor="#00ccff"
        glowIntensity={1.0}
      />
      <PotionBottle
        position={[-3.7, 2.36, -1]}
        liquidColor="#ffcc00"
        glowIntensity={0.7}
      />
      <IngredientJar position={[-3.4, 2.36, -1]} contentColor="#664422" />

      {/* Work table with items */}
      <WorkTable />
      <PotionBottle
        position={[1.5, 0.97, -1]}
        liquidColor="#22ffaa"
        glowIntensity={1.3}
      />
      <PotionBottle
        position={[1.9, 0.97, -1]}
        liquidColor="#ff44aa"
        glowIntensity={0.9}
      />
      <SpellBook
        position={[2.3, 0.97, -0.8]}
        rotation={[0, 0.3, 0]}
        color="#5c1a1a"
      />
      <SpellBook
        position={[2.5, 0.97, -1.1]}
        rotation={[0, -0.5, 0]}
        color="#1a3a5c"
      />
      <IngredientJar position={[2.7, 0.97, -0.7]} contentColor="#886622" />
      <IngredientJar position={[1.3, 0.97, -0.8]} contentColor="#228844" />

      {/* Stacked books on floor */}
      <SpellBook
        position={[-2, 0.02, 1]}
        rotation={[0, 0.8, 0]}
        color="#3a1a3a"
      />
      <SpellBook
        position={[-2.02, 0.06, 1.02]}
        rotation={[0, 0.4, 0]}
        color="#1a3a1a"
      />
      <SpellBook
        position={[-1.98, 0.1, 0.98]}
        rotation={[0, 1.2, 0]}
        color="#5c4a1a"
      />

      <FloatingParticles />
    </>
  )
}
