import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#8899aa', 30, 120)
    scene.background = new THREE.Color('#8899aa')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function BridgeTower({ position }: { position: [number, number, number] }) {
  const towerHeight = 14
  const legWidth = 0.8
  const legDepth = 0.8
  const spread = 2.5

  return (
    <group position={position}>
      {/* Left leg */}
      <mesh position={[-spread / 2, towerHeight / 2, 0]}>
        <boxGeometry args={[legWidth, towerHeight, legDepth]} />
        <meshStandardMaterial color="#cc4444" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Right leg */}
      <mesh position={[spread / 2, towerHeight / 2, 0]}>
        <boxGeometry args={[legWidth, towerHeight, legDepth]} />
        <meshStandardMaterial color="#cc4444" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Cross beams */}
      <mesh position={[0, towerHeight * 0.55, 0]}>
        <boxGeometry args={[spread + legWidth, 0.5, legDepth * 0.8]} />
        <meshStandardMaterial color="#aa3333" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, towerHeight * 0.85, 0]}>
        <boxGeometry args={[spread + legWidth, 0.5, legDepth * 0.8]} />
        <meshStandardMaterial color="#aa3333" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Top caps */}
      <mesh position={[-spread / 2, towerHeight + 0.3, 0]}>
        <boxGeometry args={[legWidth + 0.2, 0.6, legDepth + 0.2]} />
        <meshStandardMaterial color="#aa3333" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[spread / 2, towerHeight + 0.3, 0]}>
        <boxGeometry args={[legWidth + 0.2, 0.6, legDepth + 0.2]} />
        <meshStandardMaterial color="#aa3333" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  )
}

function MainCable({
  side,
  towerZ1,
  towerZ2,
}: {
  side: number
  towerZ1: number
  towerZ2: number
}) {
  const segments = 40
  const elements: JSX.Element[] = []
  const cableX = side * 1.25
  const towerTopY = 14.3
  const deckY = 3.5
  const spanLength = towerZ2 - towerZ1

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const z = towerZ1 + t * spanLength
    // Catenary-like parabola
    const sag = 4 * (t - 0.5) * (t - 0.5)
    const y = deckY + (towerTopY - deckY) * sag

    if (i < segments) {
      const nextT = (i + 1) / segments
      const nextZ = towerZ1 + nextT * spanLength
      const nextSag = 4 * (nextT - 0.5) * (nextT - 0.5)
      const nextY = deckY + (towerTopY - deckY) * nextSag

      const midZ = (z + nextZ) / 2
      const midY = (y + nextY) / 2
      const dz = nextZ - z
      const dy = nextY - y
      const len = Math.sqrt(dz * dz + dy * dy)
      const angle = Math.atan2(dy, dz)

      elements.push(
        <mesh
          key={`cable-${i}`}
          position={[cableX, midY, midZ]}
          rotation={[0, 0, angle]}
        >
          <cylinderGeometry args={[0.06, 0.06, len, 4]} />
          <meshStandardMaterial
            color="#444444"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>,
      )
    }

    // Vertical suspender cables
    if (i > 2 && i < segments - 2 && i % 2 === 0) {
      const suspenderLength = y - deckY
      if (suspenderLength > 0.5) {
        elements.push(
          <mesh
            key={`sus-${i}`}
            position={[cableX, deckY + suspenderLength / 2, z]}
          >
            <cylinderGeometry args={[0.02, 0.02, suspenderLength, 4]} />
            <meshStandardMaterial
              color="#555555"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>,
        )
      }
    }
  }

  return <group>{elements}</group>
}

function RoadDeck({ z1, z2 }: { z1: number; z2: number }) {
  const length = z2 - z1
  const midZ = (z1 + z2) / 2

  return (
    <group>
      {/* Main deck */}
      <mesh position={[0, 3.2, midZ]}>
        <boxGeometry args={[5, 0.3, length + 6]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>
      {/* Road surface */}
      <mesh position={[0, 3.36, midZ]}>
        <boxGeometry args={[4.5, 0.02, length + 6]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
      {/* Lane markings */}
      {Array.from({ length: Math.floor(length / 2) }, (_, i) => (
        <mesh key={i} position={[0, 3.38, z1 + i * 2 + 1]}>
          <boxGeometry args={[0.1, 0.01, 1.0]} />
          <meshStandardMaterial color="#dddd44" />
        </mesh>
      ))}
      {/* Side barriers */}
      <mesh position={[-2.4, 3.7, midZ]}>
        <boxGeometry args={[0.08, 0.6, length + 6]} />
        <meshStandardMaterial color="#cc4444" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[2.4, 3.7, midZ]}>
        <boxGeometry args={[0.08, 0.6, length + 6]} />
        <meshStandardMaterial color="#cc4444" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Water() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.position.y = -0.1 + Math.sin(t * 0.5) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial
        color="#2a4a6a"
        metalness={0.6}
        roughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function CityBuilding({
  position,
  width,
  depth,
  height,
  color,
}: {
  position: [number, number, number]
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

function CitySkyline({ zOffset }: { zOffset: number }) {
  const buildings = useMemo(() => {
    const arr = []
    for (let i = 0; i < 20; i++) {
      arr.push({
        x: -25 + i * 2.5 + (Math.random() - 0.5) * 1.5,
        z: zOffset + (Math.random() - 0.5) * 5,
        w: 1.0 + Math.random() * 1.5,
        d: 1.0 + Math.random() * 1.5,
        h: 2 + Math.random() * 8,
        color: `#${(0x3a + Math.floor(Math.random() * 0x20)).toString(16)}${(0x3a + Math.floor(Math.random() * 0x20)).toString(16)}${(0x4a + Math.floor(Math.random() * 0x20)).toString(16)}`,
      })
    }
    return arr
  }, [zOffset])

  return (
    <group>
      {buildings.map((b, i) => (
        <CityBuilding
          key={i}
          position={[b.x, 0, b.z]}
          width={b.w}
          depth={b.d}
          height={b.h}
          color={b.color}
        />
      ))}
    </group>
  )
}

function FogBank() {
  const groupRef = useRef<THREE.Group>(null!)

  const clouds = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 50,
        y: 0.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 40,
        sx: 3 + Math.random() * 5,
        sy: 0.3 + Math.random() * 0.5,
        sz: 2 + Math.random() * 3,
        speed: 0.05 + Math.random() * 0.1,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const c = clouds[i]
      children[i].position.x = c.x + Math.sin(t * c.speed) * 3
      children[i].position.y = c.y + Math.sin(t * 0.3 + i) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.sx, c.sy, c.sz]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#aabbcc" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function AnchorBlock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#777777" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[3, 0.4, 2.5]} />
        <meshStandardMaterial color="#666666" roughness={0.9} />
      </mesh>
    </group>
  )
}

export default function SuspensionBridge() {
  const tower1Z = -10
  const tower2Z = 10

  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 15, 8]}
        color="#ccccdd"
        intensity={1.0}
      />
      <directionalLight
        position={[-8, 10, -5]}
        color="#aaaacc"
        intensity={0.4}
      />
      <ambientLight intensity={0.2} color="#8899aa" />

      <Water />

      {/* Bridge towers */}
      <BridgeTower position={[0, 0, tower1Z]} />
      <BridgeTower position={[0, 0, tower2Z]} />

      {/* Main cables */}
      <MainCable side={-1} towerZ1={tower1Z} towerZ2={tower2Z} />
      <MainCable side={1} towerZ1={tower1Z} towerZ2={tower2Z} />

      {/* Road deck */}
      <RoadDeck z1={tower1Z} z2={tower2Z} />

      {/* Anchor blocks at ends */}
      <AnchorBlock position={[0, 0, tower1Z - 8]} />
      <AnchorBlock position={[0, 0, tower2Z + 8]} />

      {/* Approach roads */}
      <mesh position={[0, 3.2, tower1Z - 11]}>
        <boxGeometry args={[5, 0.3, 10]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, tower2Z + 11]}>
        <boxGeometry args={[5, 0.3, 10]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>

      {/* City skylines on both sides */}
      <CitySkyline zOffset={-30} />
      <CitySkyline zOffset={30} />

      <FogBank />
    </>
  )
}
