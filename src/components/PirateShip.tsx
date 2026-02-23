import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2a3a', 15, 60)
    scene.background = new THREE.Color('#1a2a3a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Ocean Waves ---
const WAVE_SEG = 80
function Ocean() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = ref.current.geometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.3 + t * 0.8) * 0.3 +
        Math.sin(z * 0.4 + t * 0.6) * 0.2 +
        Math.sin((x + z) * 0.2 + t * 1.2) * 0.15
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[60, 60, WAVE_SEG, WAVE_SEG]} />
      <meshStandardMaterial
        color="#0a3d5c"
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Hull ---
function Hull() {
  const ref = useRef<THREE.Group>(null!)
  return (
    <group ref={ref}>
      {/* Main hull body */}
      <mesh position={[0, 0, 0]} scale={[3, 0.8, 1]}>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5c3317" roughness={0.8} />
      </mesh>
      {/* Deck */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.8, 1.9]} />
        <meshStandardMaterial
          color="#8b6914"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bow extension */}
      <mesh position={[3.2, 0.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.2, 0.15, 0.6]} />
        <meshStandardMaterial color="#5c3317" roughness={0.8} />
      </mesh>
      {/* Stern cabin */}
      <mesh position={[-2.2, 0.6, 0]}>
        <boxGeometry args={[1.4, 1.0, 1.4]} />
        <meshStandardMaterial color="#6b3a1f" roughness={0.7} />
      </mesh>
      {/* Stern cabin roof */}
      <mesh position={[-2.2, 1.15, 0]}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#4a2810" roughness={0.8} />
      </mesh>
      {/* Railing posts */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-1.5 + i * 0.6, 0.3, 0.9]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
          <meshStandardMaterial color="#3e2510" />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`r${i}`} position={[-1.5 + i * 0.6, 0.3, -0.9]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
          <meshStandardMaterial color="#3e2510" />
        </mesh>
      ))}
    </group>
  )
}

// --- Mast with Sail ---
function Mast({
  position,
  height,
  sailWidth,
  sailHeight,
}: {
  position: [number, number, number]
  height: number
  sailWidth: number
  sailHeight: number
}) {
  const sailRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = sailRef.current.geometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const bulge = Math.sin((y / sailHeight + 0.5) * Math.PI) * 0.3
      const wave = Math.sin(x * 2 + t * 2) * 0.05
      pos.setZ(i, bulge + wave)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })
  return (
    <group position={position}>
      {/* Mast pole */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.07, height, 8]} />
        <meshStandardMaterial color="#3e2510" roughness={0.9} />
      </mesh>
      {/* Yard arm */}
      <mesh position={[0, height * 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, sailWidth + 0.4, 6]} />
        <meshStandardMaterial color="#3e2510" />
      </mesh>
      {/* Sail */}
      <mesh ref={sailRef} position={[0, height * 0.75 - sailHeight / 2, 0.1]}>
        <planeGeometry args={[sailWidth, sailHeight, 12, 12]} />
        <meshStandardMaterial
          color="#e8dcc8"
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// --- Crow's Nest ---
function CrowsNest({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.25, 0.3, 8, 1, true]} />
        <meshStandardMaterial
          color="#3e2510"
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 8]} />
        <meshStandardMaterial color="#5c3317" />
      </mesh>
    </group>
  )
}

// --- Cannon ---
function Cannon({
  position,
  side,
}: {
  position: [number, number, number]
  side: number
}) {
  return (
    <group
      position={position}
      rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.08, -0.06, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
        <meshStandardMaterial color="#3e2510" />
      </mesh>
      <mesh position={[0.08, -0.06, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
        <meshStandardMaterial color="#3e2510" />
      </mesh>
    </group>
  )
}

// --- Jolly Roger Flag ---
function JollyRoger({ position }: { position: [number, number, number] }) {
  const flagRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = flagRef.current.geometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      pos.setZ(i, Math.sin(x * 4 + t * 3) * 0.05)
    }
    pos.needsUpdate = true
  })
  return (
    <group position={position}>
      {/* Flag pole */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 4]} />
        <meshStandardMaterial color="#3e2510" />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.25, 0.45, 0]}>
        <planeGeometry args={[0.5, 0.35, 8, 4]} />
        <meshStandardMaterial color="#111111" side={THREE.DoubleSide} />
      </mesh>
      {/* Skull approximation */}
      <mesh position={[0.22, 0.48, 0.01]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      {/* Crossbones */}
      <mesh position={[0.22, 0.4, 0.01]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0.22, 0.4, 0.01]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  )
}

// --- Ship Rocking ---
function ShipBody() {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.02
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.15
  })

  const cannons = useMemo(() => {
    const arr: { pos: [number, number, number]; side: number }[] = []
    for (let i = 0; i < 4; i++) {
      arr.push({ pos: [-1 + i * 0.7, -0.1, 1.0], side: 1 })
      arr.push({ pos: [-1 + i * 0.7, -0.1, -1.0], side: -1 })
    }
    return arr
  }, [])

  return (
    <group ref={groupRef}>
      <Hull />
      <Mast position={[0, 0, 0]} height={5} sailWidth={2.2} sailHeight={2} />
      <Mast
        position={[1.5, 0, 0]}
        height={4}
        sailWidth={1.8}
        sailHeight={1.6}
      />
      <Mast
        position={[-1.2, 0, 0]}
        height={4.5}
        sailWidth={2}
        sailHeight={1.8}
      />
      <CrowsNest position={[0, 5, 0]} />
      <JollyRoger position={[0, 5.3, 0]} />
      {cannons.map((c, i) => (
        <Cannon key={i} position={c.pos} side={c.side} />
      ))}
    </group>
  )
}

// --- Main Scene ---
export default function PirateShip() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.2} color="#4466aa" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color="#ffaa55"
        castShadow
      />
      <pointLight position={[-3, 6, -2]} intensity={0.4} color="#ff6633" />
      <ShipBody />
      <Ocean />
    </>
  )
}
