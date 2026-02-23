import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Crystal Formation ---
function Crystal({
  position,
  rotation,
  height,
  radius,
  color,
  emissiveColor,
  emissiveIntensity,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  height: number
  radius: number
  color: string
  emissiveColor: string
  emissiveIntensity: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity =
      emissiveIntensity * (0.6 + 0.4 * Math.sin(t * 0.8 + phase))
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation || [0, 0, 0]}>
      <cylinderGeometry args={[0, radius, height, 6]} />
      <meshStandardMaterial
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={0.75}
        metalness={0.3}
        roughness={0.1}
      />
    </mesh>
  )
}

// --- Crystal Cluster ---
function CrystalCluster({
  position,
  palette,
}: {
  position: [number, number, number]
  palette: 'purple' | 'blue' | 'cyan'
}) {
  const colors = useMemo(() => {
    const palettes = {
      purple: { color: '#6a1b9a', emissive: '#9c27b0' },
      blue: { color: '#1565c0', emissive: '#2196f3' },
      cyan: { color: '#00838f', emissive: '#00bcd4' },
    }
    return palettes[palette]
  }, [palette])

  const crystals = useMemo(() => {
    const arr = []
    const count = 3 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 0.4
      arr.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist] as [
          number,
          number,
          number,
        ],
        rot: [
          (Math.random() - 0.5) * 0.5,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.5,
        ] as [number, number, number],
        height: 0.5 + Math.random() * 1.5,
        radius: 0.05 + Math.random() * 0.12,
        intensity: 0.5 + Math.random() * 1.5,
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {crystals.map((c, i) => (
        <Crystal
          key={i}
          position={c.pos}
          rotation={c.rot}
          height={c.height}
          radius={c.radius}
          color={colors.color}
          emissiveColor={colors.emissive}
          emissiveIntensity={c.intensity}
        />
      ))}
    </group>
  )
}

// --- Stalactites and Stalagmites ---
function Stalactites() {
  const formations = useMemo(() => {
    const arr = []
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 18
      const z = (Math.random() - 0.5) * 18
      const height = 0.5 + Math.random() * 2
      const fromCeiling = Math.random() > 0.4
      arr.push({
        pos: [x, fromCeiling ? 8 - height / 2 : height / 2, z] as [
          number,
          number,
          number,
        ],
        height,
        radius: 0.08 + Math.random() * 0.15,
        fromCeiling,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {formations.map((f, i) => (
        <mesh
          key={i}
          position={f.pos}
          rotation={f.fromCeiling ? [Math.PI, 0, 0] : [0, 0, 0]}
        >
          <coneGeometry args={[f.radius, f.height, 6]} />
          <meshStandardMaterial color="#4a4a52" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// --- Cave walls and ceiling ---
function CaveShell() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.9} metalness={0.3} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial color="#0f0f18" roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 4, -12]}>
        <planeGeometry args={[25, 8]} />
        <meshStandardMaterial color="#15151e" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-12, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[25, 8]} />
        <meshStandardMaterial color="#15151e" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[12, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[25, 8]} />
        <meshStandardMaterial color="#15151e" roughness={0.9} />
      </mesh>
    </group>
  )
}

// --- Floating sparkle particles ---
const SPARKLE_COUNT = 100
const sparkleDummy = new THREE.Object3D()

function Sparkles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: SPARKLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: 0.5 + Math.random() * 6,
      z: (Math.random() - 0.5) * 16,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.02,
      driftX: (Math.random() - 0.5) * 0.5,
      driftZ: (Math.random() - 0.5) * 0.5,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const p = particles[i]
      const brightness = 0.3 + 0.7 * Math.abs(Math.sin(t * p.speed + p.phase))
      sparkleDummy.position.set(
        p.x + Math.sin(t * 0.3 + p.phase) * p.driftX,
        p.y + Math.sin(t * 0.5 + p.phase) * 0.3,
        p.z + Math.cos(t * 0.3 + p.phase) * p.driftZ,
      )
      sparkleDummy.scale.setScalar(p.scale * brightness)
      sparkleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sparkleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARKLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#aaccff"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a14', 8, 30)
    scene.background = new THREE.Color('#060610')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function CrystalCave() {
  const clusters = useMemo(
    () => [
      {
        pos: [-3, 0, -4] as [number, number, number],
        palette: 'purple' as const,
      },
      { pos: [4, 0, -6] as [number, number, number], palette: 'blue' as const },
      { pos: [-6, 0, 2] as [number, number, number], palette: 'cyan' as const },
      {
        pos: [2, 0, 3] as [number, number, number],
        palette: 'purple' as const,
      },
      { pos: [6, 0, -2] as [number, number, number], palette: 'blue' as const },
      {
        pos: [-2, 0, -8] as [number, number, number],
        palette: 'cyan' as const,
      },
      {
        pos: [0, 0, 6] as [number, number, number],
        palette: 'purple' as const,
      },
      {
        pos: [-5, 0, -6] as [number, number, number],
        palette: 'blue' as const,
      },
      // Wall-mounted clusters
      {
        pos: [-10, 3, -3] as [number, number, number],
        palette: 'cyan' as const,
      },
      {
        pos: [10, 4, 2] as [number, number, number],
        palette: 'purple' as const,
      },
      { pos: [3, 7, -5] as [number, number, number], palette: 'blue' as const },
      { pos: [-4, 7, 1] as [number, number, number], palette: 'cyan' as const },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <ambientLight color="#1a1a3a" intensity={0.15} />
      <pointLight
        position={[-3, 2, -4]}
        color="#9c27b0"
        intensity={0.8}
        distance={12}
      />
      <pointLight
        position={[4, 2, -6]}
        color="#2196f3"
        intensity={0.8}
        distance={12}
      />
      <pointLight
        position={[-6, 2, 2]}
        color="#00bcd4"
        intensity={0.8}
        distance={12}
      />
      <pointLight
        position={[2, 2, 3]}
        color="#9c27b0"
        intensity={0.6}
        distance={10}
      />

      <CaveShell />
      <Stalactites />

      {clusters.map((c, i) => (
        <CrystalCluster key={i} position={c.pos} palette={c.palette} />
      ))}

      <Sparkles />
    </>
  )
}
