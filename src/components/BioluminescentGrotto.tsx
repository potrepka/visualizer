import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Bioluminescent Mushroom ---
function GlowMushroom({
  position,
  color,
  emissive,
  scale,
}: {
  position: [number, number, number]
  color: string
  emissive: string
  scale: number
}) {
  const capRef = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = capRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.8 + 0.6 * Math.sin(t * 0.6 + phase)
  })

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 8]} />
        <meshStandardMaterial color="#334455" roughness={0.7} />
      </mesh>
      {/* Cap */}
      <mesh ref={capRef} position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Gill lines under cap */}
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.08, 8]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// --- Mushroom Cluster ---
function MushroomCluster({
  position,
  palette,
}: {
  position: [number, number, number]
  palette: 'blue' | 'green' | 'purple'
}) {
  const colors = useMemo(() => {
    const p = {
      blue: { color: '#1a3a6a', emissive: '#2266ff' },
      green: { color: '#1a4a2a', emissive: '#22ff66' },
      purple: { color: '#3a1a5a', emissive: '#aa44ff' },
    }
    return p[palette]
  }, [palette])

  const mushrooms = useMemo(() => {
    return Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => ({
      offset: [(Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6] as [
        number,
        number,
        number,
      ],
      scale: 0.5 + Math.random() * 1.2,
    }))
  }, [])

  return (
    <group position={position}>
      {mushrooms.map((m, i) => (
        <GlowMushroom
          key={i}
          position={m.offset}
          color={colors.color}
          emissive={colors.emissive}
          scale={m.scale}
        />
      ))}
    </group>
  )
}

// --- Glowing Vines/Tendrils hanging from ceiling ---
function GlowingTendril({
  position,
  height,
  color,
}: {
  position: [number, number, number]
  height: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const segments = useMemo(() => Math.floor(height / 0.3), [height])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      const sway = Math.sin(t * 0.4 + phase + i * 0.4) * 0.05 * (i + 1)
      children[i].position.x = sway
    }
  })

  return (
    <group position={position} ref={groupRef}>
      {Array.from({ length: segments }, (_, i) => (
        <mesh key={i} position={[0, -i * 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.3, 5]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6 + 0.3 * Math.sin(i * 0.8)}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      {/* Tip glow */}
      <mesh position={[0, -segments * 0.3, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

// --- Water Pool ---
function WaterPool() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = 0.02 + Math.sin(t * 0.5) * 0.01
  })

  return (
    <group>
      {/* Pool basin */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[4, 4.5, 0.3, 24]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.95} />
      </mesh>
      {/* Water surface */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.8, 32]} />
        <meshStandardMaterial
          color="#0a1a3a"
          emissive="#0033aa"
          emissiveIntensity={0.15}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

// --- Cave structure ---
function GrottoWalls() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.95} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050510" roughness={0.95} />
      </mesh>
      {/* Cave boulders */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const dist = 9 + Math.random() * 3
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * dist,
              Math.random() * 3,
              Math.sin(angle) * dist,
            ]}
          >
            <sphereGeometry args={[1 + Math.random() * 1.5, 6, 5]} />
            <meshStandardMaterial color="#111118" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Floating Spore Particles ---
const SPORE_COUNT = 120
const sporeDummy = new THREE.Object3D()

function FloatingSpores() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const spores = useMemo(() => {
    return Array.from({ length: SPORE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: 0.5 + Math.random() * 5,
      z: (Math.random() - 0.5) * 16,
      speedY: 0.05 + Math.random() * 0.15,
      driftSpeed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.025,
      colorIdx: Math.floor(Math.random() * 3),
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPORE_COUNT; i++) {
      const s = spores[i]
      const y = ((s.y + t * s.speedY) % 6) + 0.5
      sporeDummy.position.set(
        s.x + Math.sin(t * s.driftSpeed + s.phase) * 0.8,
        y,
        s.z + Math.cos(t * s.driftSpeed + s.phase) * 0.8,
      )
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + s.phase)
      sporeDummy.scale.setScalar(s.scale * (0.7 + 0.3 * pulse))
      sporeDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sporeDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPORE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#66ffaa"
        emissive="#44ff88"
        emissiveIntensity={1.5}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#050510', 0.04)
    scene.background = new THREE.Color('#030308')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function BioluminescentGrotto() {
  const mushroomClusters = useMemo(
    () => [
      {
        pos: [-3, -0.2, -2] as [number, number, number],
        palette: 'blue' as const,
      },
      {
        pos: [4, -0.2, -5] as [number, number, number],
        palette: 'green' as const,
      },
      {
        pos: [-5, -0.2, 3] as [number, number, number],
        palette: 'purple' as const,
      },
      {
        pos: [2, -0.2, 4] as [number, number, number],
        palette: 'blue' as const,
      },
      {
        pos: [6, -0.2, 1] as [number, number, number],
        palette: 'green' as const,
      },
      {
        pos: [-1, -0.2, -6] as [number, number, number],
        palette: 'purple' as const,
      },
      {
        pos: [-6, -0.2, -4] as [number, number, number],
        palette: 'blue' as const,
      },
      {
        pos: [3, -0.2, -1] as [number, number, number],
        palette: 'green' as const,
      },
    ],
    [],
  )

  const tendrils = useMemo(
    () => [
      {
        pos: [-2, 7, -3] as [number, number, number],
        height: 3,
        color: '#22ff66',
      },
      {
        pos: [3, 7, -4] as [number, number, number],
        height: 2.5,
        color: '#2266ff',
      },
      {
        pos: [-4, 7, 1] as [number, number, number],
        height: 4,
        color: '#aa44ff',
      },
      {
        pos: [5, 7, 2] as [number, number, number],
        height: 3.5,
        color: '#22ff66',
      },
      {
        pos: [0, 7, 5] as [number, number, number],
        height: 2,
        color: '#2266ff',
      },
      {
        pos: [-6, 7, -1] as [number, number, number],
        height: 3,
        color: '#aa44ff',
      },
      {
        pos: [1, 7, -7] as [number, number, number],
        height: 2.8,
        color: '#22ff66',
      },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <ambientLight color="#0a0a2a" intensity={0.1} />
      <pointLight
        position={[-3, 1, -2]}
        color="#2266ff"
        intensity={0.5}
        distance={10}
      />
      <pointLight
        position={[4, 1, -5]}
        color="#22ff66"
        intensity={0.5}
        distance={10}
      />
      <pointLight
        position={[-5, 1, 3]}
        color="#aa44ff"
        intensity={0.5}
        distance={10}
      />
      <pointLight
        position={[0, 0.5, 0]}
        color="#0044aa"
        intensity={0.3}
        distance={8}
      />

      <GrottoWalls />
      <WaterPool />

      {mushroomClusters.map((c, i) => (
        <MushroomCluster key={i} position={c.pos} palette={c.palette} />
      ))}

      {tendrils.map((t, i) => (
        <GlowingTendril
          key={i}
          position={t.pos}
          height={t.height}
          color={t.color}
        />
      ))}

      <FloatingSpores />
    </>
  )
}
