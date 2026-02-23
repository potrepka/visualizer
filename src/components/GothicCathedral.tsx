import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a12', 15, 50)
    scene.background = new THREE.Color('#0a0a12')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Column({ position }: { position: [number, number, number] }) {
  const height = 10
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.7, 0.3, 0.7]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.8} />
      </mesh>
      {/* Main shaft */}
      <mesh position={[0, height / 2 + 0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.25, height, 12]} />
        <meshStandardMaterial color="#9a9a90" roughness={0.7} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height + 0.3 + 0.15, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.6]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.8} />
      </mesh>
    </group>
  )
}

function PointedArch({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left side */}
      <mesh position={[-0.8, 0.8, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.15, 2, 0.15]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.8} />
      </mesh>
      {/* Right side */}
      <mesh position={[0.8, 0.8, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.15, 2, 0.15]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.8} />
      </mesh>
      {/* Peak */}
      <mesh position={[0, 1.65, 0]}>
        <coneGeometry args={[0.15, 0.3, 4]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.8} />
      </mesh>
    </group>
  )
}

function StainedGlassPanel({
  position,
  color,
  rotation,
}: {
  position: [number, number, number]
  color: string
  rotation?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + Math.sin(t * 0.8 + position[0]) * 0.2
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[1.5, 3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function RoseWindow({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const colors = [
    '#cc2244',
    '#2244cc',
    '#22aa44',
    '#ccaa22',
    '#8822cc',
    '#cc6622',
  ]
  return (
    <group position={position} rotation={rotation}>
      {/* Outer ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.1, 8, 24]} />
        <meshStandardMaterial color="#6a6a60" roughness={0.8} />
      </mesh>
      {/* Inner segments */}
      {colors.map((color, i) => {
        const angle = (i / colors.length) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0]}
          >
            <circleGeometry args={[0.4, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
      {/* Center */}
      <mesh>
        <circleGeometry args={[0.3, 12]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ffcc44"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function VaultedCeiling() {
  const ribs = useMemo(() => {
    const arr: { x: number; z: number; angle: number }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({ x: 0, z: -8 + i * 4, angle: 0 })
    }
    return arr
  }, [])

  return (
    <group position={[0, 11, 0]}>
      {/* Ceiling plane */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshStandardMaterial
          color="#4a4a44"
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>
      {/* Ribs */}
      {ribs.map((r, i) => (
        <group key={i} position={[r.x, 0, r.z]}>
          <mesh>
            <boxGeometry args={[8, 0.15, 0.15]} />
            <meshStandardMaterial color="#6a6a60" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Cross ribs */}
      {ribs.map((r, i) => (
        <group key={`cross-${i}`} position={[r.x, 0, r.z]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[10, 0.12, 0.12]} />
            <meshStandardMaterial color="#5a5a54" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[10, 0.12, 0.12]} />
            <meshStandardMaterial color="#5a5a54" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    flameRef.current.scale.y = 0.8 + Math.sin(t * 8 + position[0] * 10) * 0.3
    flameRef.current.scale.x = 0.8 + Math.sin(t * 6 + position[2] * 10) * 0.2
  })

  return (
    <group position={position}>
      {/* Candle body */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
        <meshStandardMaterial color="#e8dcc0" />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial
          color="#ffaa22"
          emissive="#ffcc44"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0, 0.25, 0]}
        color="#ffaa44"
        intensity={0.3}
        distance={3}
      />
    </group>
  )
}

function CandleRow({ z }: { z: number }) {
  return (
    <group>
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <Candle key={i} position={[x, 0, z]} />
      ))}
    </group>
  )
}

function Floor() {
  const tiles = useMemo(() => {
    const arr: { pos: [number, number, number]; dark: boolean }[] = []
    for (let x = -4; x <= 4; x++) {
      for (let z = -10; z <= 10; z++) {
        arr.push({
          pos: [x, -0.01, z],
          dark: (x + z) % 2 === 0,
        })
      }
    }
    return arr
  }, [])

  return (
    <group>
      {tiles.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={t.dark ? '#3a3a38' : '#5a5a55'}
            roughness={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

function SideWalls() {
  return (
    <group>
      {/* Left wall */}
      <mesh position={[-4, 5.5, 0]}>
        <boxGeometry args={[0.3, 11, 20]} />
        <meshStandardMaterial color="#5a5a54" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[4, 5.5, 0]}>
        <boxGeometry args={[0.3, 11, 20]} />
        <meshStandardMaterial color="#5a5a54" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 5.5, -10]}>
        <boxGeometry args={[8, 11, 0.3]} />
        <meshStandardMaterial color="#5a5a54" roughness={0.9} />
      </mesh>
    </group>
  )
}

export default function GothicCathedral() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[2, 10, 5]}
        intensity={0.15}
        color="#aab0c0"
      />
      <ambientLight intensity={0.05} color="#1a1a2a" />

      <Floor />
      <SideWalls />
      <VaultedCeiling />

      {/* Columns - left row */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <Column key={`l-${i}`} position={[-3, 0, z]} />
      ))}
      {/* Columns - right row */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <Column key={`r-${i}`} position={[3, 0, z]} />
      ))}

      {/* Pointed arches between columns */}
      {[-6, -2, 2, 6].map((z, i) => (
        <PointedArch
          key={`al-${i}`}
          position={[-3, 10.5, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
      {[-6, -2, 2, 6].map((z, i) => (
        <PointedArch
          key={`ar-${i}`}
          position={[3, 10.5, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}

      {/* Stained glass windows - left wall */}
      <StainedGlassPanel
        position={[-3.8, 7, -6]}
        color="#cc2244"
        rotation={[0, Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[-3.8, 7, -2]}
        color="#2244cc"
        rotation={[0, Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[-3.8, 7, 2]}
        color="#22aa44"
        rotation={[0, Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[-3.8, 7, 6]}
        color="#ccaa22"
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Stained glass windows - right wall */}
      <StainedGlassPanel
        position={[3.8, 7, -6]}
        color="#8822cc"
        rotation={[0, -Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[3.8, 7, -2]}
        color="#cc6622"
        rotation={[0, -Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[3.8, 7, 2]}
        color="#cc2288"
        rotation={[0, -Math.PI / 2, 0]}
      />
      <StainedGlassPanel
        position={[3.8, 7, 6]}
        color="#2288cc"
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Rose window at back */}
      <RoseWindow position={[0, 8, -9.8]} rotation={[0, 0, 0]} />

      {/* Candle rows */}
      <CandleRow z={-4} />
      <CandleRow z={0} />
      <CandleRow z={4} />
    </>
  )
}
