import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a1a2a', 40, 120)
    scene.background = new THREE.Color('#1a1a2a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function BuildingTier({
  y,
  width,
  depth,
  height,
  color,
}: {
  y: number
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <mesh position={[0, y + height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
    </mesh>
  )
}

function WindowGrid({
  position,
  width,
  height,
  rows,
  cols,
  rotation,
}: {
  position: [number, number, number]
  width: number
  height: number
  rows: number
  cols: number
  rotation?: [number, number, number]
}) {
  const windows: JSX.Element[] = []
  const winW = (width / cols) * 0.6
  const winH = (height / rows) * 0.5
  const spacingX = width / cols
  const spacingY = height / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -width / 2 + spacingX / 2 + c * spacingX
      const y = -height / 2 + spacingY / 2 + r * spacingY
      const lit = Math.random() > 0.3
      windows.push(
        <mesh key={`${r}-${c}`} position={[x, y, 0]}>
          <planeGeometry args={[winW, winH]} />
          <meshStandardMaterial
            color={lit ? '#ffdd88' : '#2a2a3a'}
            emissive={lit ? '#ffcc44' : '#000000'}
            emissiveIntensity={lit ? 0.8 : 0}
          />
        </mesh>,
      )
    }
  }

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {windows}
    </group>
  )
}

function GeometricDecoration({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Chevron pattern */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.06, 0.4 - Math.abs(i - 2) * 0.08, 0.05]} />
          <meshStandardMaterial
            color="#c8a030"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Sunburst rays */}
      {Array.from({ length: 7 }, (_, i) => {
        const angle = -Math.PI / 3 + (i / 6) * ((2 * Math.PI) / 3)
        return (
          <mesh
            key={`ray-${i}`}
            position={[Math.cos(angle) * 0.3, 0.4 + Math.sin(angle) * 0.3, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <boxGeometry args={[0.03, 0.2, 0.03]} />
            <meshStandardMaterial
              color="#c8a030"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Spire({ baseY }: { baseY: number }) {
  return (
    <group position={[0, baseY, 0]}>
      {/* Tapered base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshStandardMaterial color="#c8a030" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Needle */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.2, 3.0, 8]} />
        <meshStandardMaterial color="#d4b040" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Decorative rings */}
      {[0.3, 0.6, 0.9].map((y, i) => (
        <mesh key={i} position={[0, 1.0 + y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25 - i * 0.05, 0.03, 8, 16]} />
          <meshStandardMaterial
            color="#c8a030"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Top sphere */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#d4b040" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CityBlock({ position }: { position: [number, number, number] }) {
  const buildings = useMemo(() => {
    const arr = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6,
        w: 0.8 + Math.random() * 1.5,
        d: 0.8 + Math.random() * 1.5,
        h: 2 + Math.random() * 6,
        color: `#${(0x2a + Math.floor(Math.random() * 0x20)).toString(16)}${(0x2a + Math.floor(Math.random() * 0x20)).toString(16)}${(0x3a + Math.floor(Math.random() * 0x20)).toString(16)}`,
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={b.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function RotatingSpotlight() {
  const lightRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    lightRef.current.rotation.y = t * 0.5
  })

  return (
    <group ref={lightRef} position={[0, 30, 0]}>
      <spotLight
        position={[0, 0, 0]}
        target-position={[10, 0, 0]}
        color="#ffdd88"
        intensity={5}
        angle={0.15}
        penumbra={0.5}
        distance={60}
      />
    </group>
  )
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 3.0, 6]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#ffdd88"
          emissive="#ffcc44"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight
        position={[position[0], position[1] + 3.1, position[2]]}
        color="#ffcc44"
        intensity={2}
        distance={8}
      />
    </group>
  )
}

function MainBuilding() {
  const tiers = [
    { y: 0, w: 6, d: 6, h: 8, color: '#4a4a5a' },
    { y: 8, w: 5, d: 5, h: 6, color: '#5a5a6a' },
    { y: 14, w: 4, d: 4, h: 5, color: '#5a5a6a' },
    { y: 19, w: 3, d: 3, h: 4, color: '#6a6a7a' },
    { y: 23, w: 2, d: 2, h: 3, color: '#6a6a7a' },
  ]

  return (
    <group>
      {tiers.map((t, i) => (
        <BuildingTier
          key={i}
          y={t.y}
          width={t.w}
          depth={t.d}
          height={t.h}
          color={t.color}
        />
      ))}

      {/* Windows on front face */}
      <WindowGrid
        position={[0, 4, 3.01]}
        width={5.5}
        height={7}
        rows={8}
        cols={6}
      />
      <WindowGrid
        position={[0, 11, 2.51]}
        width={4.5}
        height={5}
        rows={6}
        cols={5}
      />
      <WindowGrid
        position={[0, 16.5, 2.01]}
        width={3.5}
        height={4}
        rows={5}
        cols={4}
      />

      {/* Windows on back face */}
      <WindowGrid
        position={[0, 4, -3.01]}
        width={5.5}
        height={7}
        rows={8}
        cols={6}
        rotation={[0, Math.PI, 0]}
      />

      {/* Side windows */}
      <WindowGrid
        position={[3.01, 4, 0]}
        width={5.5}
        height={7}
        rows={8}
        cols={6}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WindowGrid
        position={[-3.01, 4, 0]}
        width={5.5}
        height={7}
        rows={8}
        cols={6}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Decorations at setbacks */}
      <GeometricDecoration position={[0, 8.3, 3.01]} />
      <GeometricDecoration position={[0, 14.3, 2.51]} />
      <GeometricDecoration position={[0, 19.3, 2.01]} />
      <GeometricDecoration
        position={[0, 8.3, -3.01]}
        rotation={[0, Math.PI, 0]}
      />

      <Spire baseY={26} />
    </group>
  )
}

export default function ArtDecoSkyscraper() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 20, 8]}
        color="#ffddaa"
        intensity={0.8}
      />
      <ambientLight intensity={0.1} color="#222244" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <MainBuilding />

      {/* City blocks */}
      <CityBlock position={[-15, 0, -10]} />
      <CityBlock position={[15, 0, -10]} />
      <CityBlock position={[-15, 0, 10]} />
      <CityBlock position={[15, 0, 10]} />
      <CityBlock position={[-10, 0, -20]} />
      <CityBlock position={[10, 0, -20]} />

      {/* Street lamps */}
      <StreetLamp position={[-5, 0, 5]} />
      <StreetLamp position={[5, 0, 5]} />
      <StreetLamp position={[-5, 0, -5]} />
      <StreetLamp position={[5, 0, -5]} />

      <RotatingSpotlight />
    </>
  )
}
