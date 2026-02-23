import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a2820', 8, 25)
    scene.background = new THREE.Color('#1a1818')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function GlassContainer() {
  return (
    <group>
      {/* Main glass sphere */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8f0f0"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glass rim at top opening */}
      <mesh position={[0, 2.6, 0]}>
        <torusGeometry args={[1.3, 0.08, 8, 24]} />
        <meshPhysicalMaterial
          color="#d0e0e0"
          transparent
          opacity={0.3}
          roughness={0.05}
        />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, -2.8, 0]}>
        <torusGeometry args={[1.2, 0.12, 8, 24]} />
        <meshStandardMaterial color="#8a7858" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

function SoilLayers() {
  return (
    <group>
      {/* Bottom drainage layer */}
      <mesh position={[0, -2.4, 0]}>
        <sphereGeometry
          args={[2.2, 16, 8, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4]}
        />
        <meshStandardMaterial color="#b0a898" roughness={0.9} />
      </mesh>
      {/* Charcoal layer */}
      <mesh position={[0, -2.1, 0]}>
        <sphereGeometry
          args={[2.4, 16, 8, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.1]}
        />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
      {/* Main soil */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry
          args={[2.6, 16, 10, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.2]}
        />
        <meshStandardMaterial color="#3a2a18" roughness={0.95} />
      </mesh>
      {/* Top soil with moss texture */}
      <mesh position={[0, -1.1, 0]}>
        <sphereGeometry
          args={[2.65, 16, 8, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.08]}
        />
        <meshStandardMaterial color="#3a5a20" roughness={0.9} />
      </mesh>
    </group>
  )
}

function MiniPlant({
  position,
  height = 0.8,
  leafColor = '#3a7a28',
}: {
  position: [number, number, number]
  height?: number
  leafColor?: string
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t * 0.5 + position[0] * 10) * 0.02
  })

  const leaves = useMemo(() => {
    const arr: { angle: number; tilt: number; size: number }[] = []
    for (let i = 0; i < 6; i++) {
      arr.push({
        angle: (i / 6) * Math.PI * 2 + Math.random() * 0.3,
        tilt: 0.3 + Math.random() * 0.5,
        size: 0.1 + Math.random() * 0.12,
      })
    }
    return arr
  }, [])

  return (
    <group ref={ref} position={position}>
      {/* Stem */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.02, height, 5]} />
        <meshStandardMaterial color="#4a6a20" />
      </mesh>
      {/* Leaves */}
      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(leaf.angle) * 0.08,
            height * (0.4 + i * 0.08),
            Math.sin(leaf.angle) * 0.08,
          ]}
          rotation={[leaf.tilt, leaf.angle, 0.3]}
        >
          <boxGeometry args={[leaf.size, 0.008, leaf.size * 0.6]} />
          <meshStandardMaterial color={leafColor} />
        </mesh>
      ))}
    </group>
  )
}

function FernPlant({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.03
  })

  const fronds = useMemo(() => {
    const arr: { angle: number; curl: number }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        angle: (i / 5) * Math.PI * 2,
        curl: 0.4 + Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  return (
    <group ref={ref} position={position}>
      {fronds.map((frond, i) => (
        <group key={i} rotation={[frond.curl, frond.angle, 0]}>
          {/* Frond stem */}
          <mesh position={[0, 0.3, 0]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.012, 0.6, 4]} />
            <meshStandardMaterial color="#3a5a18" />
          </mesh>
          {/* Frond leaves */}
          {[0.15, 0.25, 0.35, 0.45].map((h, j) => (
            <group key={j}>
              <mesh
                position={[0.06, h, 0.02 * j]}
                rotation={[0.2 * j, 0, -0.4]}
              >
                <boxGeometry args={[0.08, 0.005, 0.03]} />
                <meshStandardMaterial color="#3a6a20" />
              </mesh>
              <mesh
                position={[-0.06, h, 0.02 * j]}
                rotation={[0.2 * j, 0, 0.4]}
              >
                <boxGeometry args={[0.08, 0.005, 0.03]} />
                <meshStandardMaterial color="#3a6a20" />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

function TinyRocks() {
  const rocks = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
      color: string
    }[] = []
    const colors = ['#8a8078', '#9a9088', '#7a7068', '#a09888']
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 0.3 + Math.random() * 1.5
      arr.push({
        pos: [
          Math.cos(angle) * dist,
          -1.05 + Math.random() * 0.1,
          Math.sin(angle) * dist,
        ],
        scale: [
          0.06 + Math.random() * 0.08,
          0.04 + Math.random() * 0.04,
          0.05 + Math.random() * 0.07,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale}>
          <sphereGeometry args={[1, 5, 4]} />
          <meshStandardMaterial color={rock.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function SmallWaterFeature() {
  const waterRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = waterRef.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.5 + Math.sin(t * 2) * 0.1
    waterRef.current.position.y = -1.0 + Math.sin(t * 1.5) * 0.005
  })

  return (
    <group position={[0.8, 0, 0.3]}>
      {/* Rock border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]}>
        <torusGeometry args={[0.25, 0.05, 5, 8]} />
        <meshStandardMaterial color="#6a6058" roughness={0.9} />
      </mesh>
      {/* Water surface */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.0, 0]}
      >
        <circleGeometry args={[0.22, 8]} />
        <meshStandardMaterial color="#4a8ab0" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function MossPatches() {
  const patches = useMemo(() => {
    const arr: { pos: [number, number, number]; r: number; color: string }[] =
      []
    const colors = ['#3a6a20', '#4a7a28', '#2a5a18', '#3a5a20']
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 1.8
      arr.push({
        pos: [Math.cos(angle) * dist, -1.04, Math.sin(angle) * dist],
        r: 0.1 + Math.random() * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {patches.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={p.pos}>
          <circleGeometry args={[p.r, 6]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  )
}

function DesktopSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]}>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#5a4a30" roughness={0.7} />
    </mesh>
  )
}

function InteriorGlow() {
  return (
    <group>
      <pointLight
        position={[0, 0, 0]}
        color="#ffeedd"
        intensity={1.5}
        distance={5}
      />
      <pointLight
        position={[0, -1.5, 0]}
        color="#ffe8c0"
        intensity={0.8}
        distance={3}
      />
    </group>
  )
}

function Mushroom({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.08, 5]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.03, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c85030" />
      </mesh>
    </group>
  )
}

export default function Terrarium() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 3]} intensity={0.6} color="#ffe8d0" />
      <ambientLight intensity={0.2} color="#a09080" />

      <DesktopSurface />
      <GlassContainer />
      <SoilLayers />
      <InteriorGlow />

      {/* Plants */}
      <MiniPlant
        position={[-0.5, -1.05, -0.3]}
        height={0.9}
        leafColor="#3a7a28"
      />
      <MiniPlant
        position={[0.3, -1.05, -0.8]}
        height={0.7}
        leafColor="#2a6a20"
      />
      <MiniPlant
        position={[-0.8, -1.05, 0.5]}
        height={0.6}
        leafColor="#4a8a30"
      />
      <MiniPlant
        position={[0.6, -1.05, 0.6]}
        height={0.8}
        leafColor="#3a7828"
      />

      <FernPlant position={[-0.2, -1.05, 0.6]} />
      <FernPlant position={[1.0, -1.05, -0.2]} />

      {/* Tiny mushrooms */}
      <Mushroom position={[-0.3, -1.05, 0.1]} />
      <Mushroom position={[0.15, -1.05, 0.4]} />
      <Mushroom position={[-0.6, -1.05, -0.5]} />

      <TinyRocks />
      <MossPatches />
      <SmallWaterFeature />
    </>
  )
}
