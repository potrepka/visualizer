import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#3a4555', 12, 45)
    scene.background = new THREE.Color('#3a4555')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Ocean ---
function Ocean() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.25 + t * 0.9) * 0.4 +
        Math.sin(z * 0.3 + t * 0.6) * 0.3 +
        Math.sin((x - z) * 0.15 + t * 1.1) * 0.2
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    ref.current.geometry.computeVertexNormals()
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[60, 60, 64, 64]} />
      <meshStandardMaterial
        color="#1a3a5a"
        metalness={0.5}
        roughness={0.35}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Viking Hull ---
function VikingHull() {
  return (
    <group>
      {/* Main hull - elongated */}
      <mesh position={[0, 0, 0]} scale={[4, 0.6, 0.8]}>
        <sphereGeometry args={[1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a5c30" roughness={0.85} />
      </mesh>
      {/* Hull planking detail */}
      {[-0.3, 0, 0.3].map((z, i) => (
        <mesh key={i} position={[0, -0.15, z]} scale={[3.8, 0.03, 0.01]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5a4020" />
        </mesh>
      ))}
      {/* Keel */}
      <mesh position={[0, -0.6, 0]} scale={[4.2, 0.08, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a2810" roughness={0.9} />
      </mesh>
    </group>
  )
}

// --- Dragon Prow ---
function DragonProw() {
  return (
    <group position={[4.2, 0.8, 0]}>
      {/* Neck curve - series of angled cylinders */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
        <meshStandardMaterial color="#5a3a15" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.25, 0.2]} />
        <meshStandardMaterial color="#5a3a15" roughness={0.8} />
      </mesh>
      {/* Jaw */}
      <mesh position={[0.55, 0.85, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.08, 0.15]} />
        <meshStandardMaterial color="#4a2a10" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.45, 1.05, 0.11]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color="#cc3333"
          emissive="#cc3333"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.45, 1.05, -0.11]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color="#cc3333"
          emissive="#cc3333"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Horns */}
      <mesh position={[0.3, 1.2, 0.08]} rotation={[0.3, 0, -0.5]}>
        <coneGeometry args={[0.04, 0.3, 6]} />
        <meshStandardMaterial color="#8a7a60" />
      </mesh>
      <mesh position={[0.3, 1.2, -0.08]} rotation={[-0.3, 0, -0.5]}>
        <coneGeometry args={[0.04, 0.3, 6]} />
        <meshStandardMaterial color="#8a7a60" />
      </mesh>
    </group>
  )
}

// --- Stern Ornament ---
function SternOrnament() {
  return (
    <group position={[-4.2, 0.5, 0]}>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.05, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="#5a3a15" roughness={0.8} />
      </mesh>
      {/* Tail curl */}
      <mesh position={[-0.3, 1.1, 0]}>
        <torusGeometry args={[0.15, 0.04, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#5a3a15" />
      </mesh>
    </group>
  )
}

// --- Mast and Striped Sail ---
function MastAndSail() {
  const sailRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pos = sailRef.current.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const bulge = Math.sin((y + 1.2) * 1.3) * 0.35
      const wave = Math.sin(x * 3 + t * 2.5) * 0.04
      pos.setZ(i, bulge + wave)
    }
    pos.needsUpdate = true
    sailRef.current.geometry.computeVertexNormals()
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Mast */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
        <meshStandardMaterial color="#4a3015" roughness={0.9} />
      </mesh>
      {/* Yard arm */}
      <mesh position={[0, 3.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.2, 6]} />
        <meshStandardMaterial color="#4a3015" />
      </mesh>
      {/* Sail */}
      <mesh ref={sailRef} position={[0, 2.6, 0]}>
        <planeGeometry args={[3, 2.4, 16, 12]} />
        <meshStandardMaterial
          color="#cc3333"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Sail stripes (yellow) */}
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={i} position={[0, 2.6 + y, 0.02]}>
          <planeGeometry args={[2.9, 0.25]} />
          <meshStandardMaterial color="#ddb833" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// --- Shield Row ---
function ShieldRow() {
  const shields = useMemo(() => {
    const arr: { x: number; color: string }[] = []
    const colors = [
      '#cc3333',
      '#ddb833',
      '#3355aa',
      '#cc3333',
      '#ddb833',
      '#3355aa',
    ]
    for (let i = 0; i < 6; i++) {
      arr.push({ x: -2 + i * 0.8, color: colors[i] })
    }
    return arr
  }, [])

  return (
    <group>
      {shields.map((s, i) => (
        <group key={i}>
          {/* Port side shields */}
          <mesh position={[s.x, 0.15, 0.82]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.15, 12]} />
            <meshStandardMaterial
              color={s.color}
              side={THREE.DoubleSide}
              metalness={0.3}
            />
          </mesh>
          {/* Shield boss */}
          <mesh position={[s.x, 0.15, 0.84]}>
            <sphereGeometry
              args={[0.04, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color="#ccaa44" metalness={0.8} />
          </mesh>
          {/* Starboard side shields */}
          <mesh position={[s.x, 0.15, -0.82]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.15, 12]} />
            <meshStandardMaterial
              color={s.color}
              side={THREE.DoubleSide}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[s.x, 0.15, -0.84]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry
              args={[0.04, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color="#ccaa44" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Oars ---
function Oars() {
  const oarData = useMemo(() => {
    const arr: { x: number; phase: number }[] = []
    for (let i = 0; i < 8; i++) {
      arr.push({ x: -2.5 + i * 0.7, phase: i * 0.3 })
    }
    return arr
  }, [])

  return (
    <group>
      {oarData.map((o, i) => (
        <OarPair key={i} x={o.x} phase={o.phase} />
      ))}
    </group>
  )
}

function OarPair({ x, phase }: { x: number; phase: number }) {
  const portRef = useRef<THREE.Group>(null!)
  const starRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const angle = Math.sin(t * 1.5 + phase) * 0.3
    portRef.current.rotation.x = angle
    starRef.current.rotation.x = angle
  })
  return (
    <>
      <group ref={portRef} position={[x, -0.1, 0.8]}>
        <mesh position={[0, -0.4, 0.6]} rotation={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
          <meshStandardMaterial color="#6a5030" />
        </mesh>
        {/* Oar blade */}
        <mesh position={[0, -0.9, 1.1]} rotation={[0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.3, 0.02]} />
          <meshStandardMaterial color="#5a4020" />
        </mesh>
      </group>
      <group ref={starRef} position={[x, -0.1, -0.8]}>
        <mesh position={[0, -0.4, -0.6]} rotation={[-0.8, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
          <meshStandardMaterial color="#6a5030" />
        </mesh>
        <mesh position={[0, -0.9, -1.1]} rotation={[-0.8, 0, 0]}>
          <boxGeometry args={[0.08, 0.3, 0.02]} />
          <meshStandardMaterial color="#5a4020" />
        </mesh>
      </group>
    </>
  )
}

// --- Ship Rocking ---
function ShipGroup() {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.05
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.03
    ref.current.position.y = Math.sin(t * 0.6) * 0.2
  })
  return (
    <group ref={ref}>
      <VikingHull />
      <DragonProw />
      <SternOrnament />
      <MastAndSail />
      <ShieldRow />
      <Oars />
    </group>
  )
}

// --- Main Scene ---
export default function VikingLongship() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.2} color="#667799" />
      <directionalLight position={[4, 8, 3]} intensity={0.8} color="#ccaa88" />
      <directionalLight
        position={[-5, 3, -4]}
        intensity={0.3}
        color="#5566aa"
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#aabbcc" />
      <ShipGroup />
      <Ocean />
    </>
  )
}
