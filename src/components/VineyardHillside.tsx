import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#d4c89a', 30, 90)
    scene.background = new THREE.Color('#e8d8a0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RollingTerrain() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 60, 60)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z =
        Math.sin(x * 0.08) * 2.5 +
        Math.cos(y * 0.06) * 1.8 +
        Math.sin(x * 0.15 + y * 0.1) * 1.0
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial color="#5a7a3a" />
    </mesh>
  )
}

function GrapeCluster({ position }: { position: [number, number, number] }) {
  const grapes = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 6; i++) {
      arr.push([
        (Math.random() - 0.5) * 0.12,
        -Math.random() * 0.2,
        (Math.random() - 0.5) * 0.12,
      ])
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {grapes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#4a2060" />
        </mesh>
      ))}
    </group>
  )
}

function GrapeVine({ position }: { position: [number, number, number] }) {
  const clusters = useMemo(() => {
    const arr: [number, number, number][] = []
    const count = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * 0.4,
        0.6 + Math.random() * 0.3,
        (Math.random() - 0.5) * 0.2,
      ])
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Main vine post */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 1.0, 5]} />
        <meshStandardMaterial color="#5c3a1a" />
      </mesh>
      {/* Horizontal wire */}
      <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.8, 4]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.85, 0]} scale={[0.5, 0.15, 0.3]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshStandardMaterial color="#4a8030" />
      </mesh>
      {/* Grape clusters */}
      {clusters.map((pos, i) => (
        <GrapeCluster key={i} position={pos} />
      ))}
    </group>
  )
}

function VineyardRow({
  position,
  count,
  rotation,
}: {
  position: [number, number, number]
  count: number
  rotation?: number
}) {
  const vines = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < count; i++) {
      arr.push([i * 0.6, 0, 0])
    }
    return arr
  }, [count])

  return (
    <group position={position} rotation={[0, rotation ?? 0, 0]}>
      {vines.map((pos, i) => (
        <GrapeVine key={i} position={pos} />
      ))}
    </group>
  )
}

function StoneWall({
  position,
  length,
}: {
  position: [number, number, number]
  length: number
}) {
  const stones = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
    }[] = []
    let x = 0
    while (x < length) {
      const w = 0.3 + Math.random() * 0.5
      const h = 0.2 + Math.random() * 0.3
      const d = 0.3 + Math.random() * 0.2
      arr.push({ pos: [x, h / 2, 0], size: [w, h, d] })
      // Second layer
      if (Math.random() > 0.3) {
        arr.push({
          pos: [x + Math.random() * 0.2, h + 0.15, 0],
          size: [w * 0.8, 0.2, d * 0.9],
        })
      }
      x += w + 0.05
    }
    return arr
  }, [length])

  return (
    <group position={position}>
      {stones.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={s.size} />
          <meshStandardMaterial color={i % 3 === 0 ? '#a09080' : '#8a7a6a'} />
        </mesh>
      ))}
    </group>
  )
}

function WineryBuilding({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 5]} />
        <meshStandardMaterial color="#d4b896" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4.6, 0.3, 5.6]} />
        <meshStandardMaterial color="#8a4a2a" />
      </mesh>
      <mesh position={[0, 4.0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.5, 1.5, 4]} />
        <meshStandardMaterial color="#9a5a3a" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.8, 2.51]}>
        <boxGeometry args={[0.8, 1.6, 0.05]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Windows */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 2.51]}>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial color="#6a8090" />
        </mesh>
      ))}
      {/* Barrel */}
      <mesh position={[2.5, 0.4, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.6, 8]} />
        <meshStandardMaterial color="#6a4020" />
      </mesh>
    </group>
  )
}

function CypressTree({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height * 0.4, 0]}>
        <coneGeometry args={[0.4, height * 0.85, 6]} />
        <meshStandardMaterial color="#2a4a1a" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 5]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
    </group>
  )
}

function Butterfly() {
  const ref = useRef<THREE.Group>(null!)
  const offset = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * offset.speed
    ref.current.position.set(
      offset.x + Math.sin(t + offset.phase) * 3,
      2 + Math.sin(t * 2) * 0.5,
      offset.z + Math.cos(t + offset.phase) * 3,
    )
    ref.current.rotation.y = t + offset.phase
  })

  return (
    <group ref={ref}>
      <mesh
        position={[0.06, 0, 0]}
        rotation={[0, 0, Math.sin(Date.now() * 0.01) * 0.4]}
      >
        <planeGeometry args={[0.1, 0.06]} />
        <meshStandardMaterial color="#e8a030" side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[-0.06, 0, 0]}
        rotation={[0, 0, -Math.sin(Date.now() * 0.01) * 0.4]}
      >
        <planeGeometry args={[0.1, 0.06]} />
        <meshStandardMaterial color="#e8a030" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function VineyardHillside() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.2}
        color="#ffe8b0"
        castShadow
      />
      <ambientLight intensity={0.35} color="#ffd890" />
      <hemisphereLight args={['#ffe0a0', '#4a6a30', 0.3]} />

      <RollingTerrain />

      {/* Vineyard rows */}
      {Array.from({ length: 8 }, (_, i) => (
        <VineyardRow
          key={i}
          position={[-8, 0, -10 + i * 2.5]}
          count={12}
          rotation={0.05}
        />
      ))}

      {/* Stone walls */}
      <StoneWall position={[-10, 0, -12]} length={6} />
      <StoneWall position={[5, 0, 5]} length={8} />

      {/* Winery */}
      <WineryBuilding position={[10, 0, -5]} />

      {/* Cypress trees */}
      <CypressTree position={[12, 0, 2]} height={4} />
      <CypressTree position={[13.5, 0, 0]} height={3.5} />
      <CypressTree position={[-12, 0, -4]} height={4.5} />
      <CypressTree position={[-11, 0, -6]} height={3.8} />

      {/* Butterflies */}
      {Array.from({ length: 5 }, (_, i) => (
        <Butterfly key={i} />
      ))}
    </>
  )
}
