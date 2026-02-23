import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Ice Cliff face ---
function IceCliff() {
  return (
    <group position={[0, 4, -6]}>
      {/* Main cliff face */}
      <mesh>
        <boxGeometry args={[14, 8, 2]} />
        <meshStandardMaterial color="#4a5568" roughness={0.85} />
      </mesh>
      {/* Snow cap on top */}
      <mesh position={[0, 4.2, 0.5]}>
        <boxGeometry args={[14.5, 0.5, 3]} />
        <meshStandardMaterial color="#e8eef5" roughness={0.7} />
      </mesh>
      {/* Rock outcrops */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 6,
            1 + Math.random() * 0.5,
          ]}
        >
          <boxGeometry
            args={[
              0.8 + Math.random() * 1,
              0.6 + Math.random() * 0.8,
              0.5 + Math.random() * 0.5,
            ]}
          />
          <meshStandardMaterial color="#5a6577" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// --- Frozen Waterfall ---
function FrozenWaterfallGeometry() {
  const columns = useMemo(() => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 4
      const height = 4 + Math.random() * 4
      const radius = 0.1 + Math.random() * 0.25
      arr.push({ x, height, radius, z: -4.5 + Math.random() * 0.5 })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Ice columns */}
      {columns.map((col, i) => (
        <mesh key={i} position={[col.x, col.height / 2, col.z]}>
          <cylinderGeometry
            args={[col.radius * 0.6, col.radius, col.height, 8]}
          />
          <meshStandardMaterial
            color="#b0d4e8"
            transparent
            opacity={0.7}
            metalness={0.2}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Ice sheet behind columns */}
      <mesh position={[0, 4, -4.8]}>
        <boxGeometry args={[5, 8, 0.3]} />
        <meshStandardMaterial
          color="#a0c8e0"
          transparent
          opacity={0.5}
          metalness={0.3}
          roughness={0.05}
        />
      </mesh>
      {/* Frozen pool at base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -3]}>
        <circleGeometry args={[3, 24]} />
        <meshStandardMaterial
          color="#c0dde8"
          transparent
          opacity={0.6}
          metalness={0.5}
          roughness={0.05}
        />
      </mesh>
    </group>
  )
}

// --- Icicles ---
function Icicles() {
  const icicles = useMemo(() => {
    const arr = []
    // Along cliff top edge
    for (let i = 0; i < 20; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 12,
          7.8 - Math.random() * 0.3,
          -4.5 + Math.random() * 0.3,
        ] as [number, number, number],
        length: 0.3 + Math.random() * 0.8,
        radius: 0.02 + Math.random() * 0.04,
      })
    }
    // On overhangs
    for (let i = 0; i < 10; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 8, 5 + Math.random() * 2, -3.8] as [
          number,
          number,
          number,
        ],
        length: 0.2 + Math.random() * 0.5,
        radius: 0.015 + Math.random() * 0.03,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {icicles.map((ic, i) => (
        <mesh
          key={i}
          position={[ic.pos[0], ic.pos[1] - ic.length / 2, ic.pos[2]]}
        >
          <coneGeometry args={[ic.radius, ic.length, 5]} />
          <meshStandardMaterial
            color="#d0e8f5"
            transparent
            opacity={0.75}
            metalness={0.2}
            roughness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Pine Tree ---
function PineTree({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 6]} />
        <meshStandardMaterial color="#4a3520" roughness={0.85} />
      </mesh>
      {/* Foliage tiers */}
      {[
        { y: 0.9, r: 0.5, h: 0.5 },
        { y: 1.3, r: 0.4, h: 0.45 },
        { y: 1.65, r: 0.3, h: 0.4 },
        { y: 1.95, r: 0.18, h: 0.35 },
      ].map((tier, i) => (
        <mesh key={i} position={[0, tier.y, 0]}>
          <coneGeometry args={[tier.r, tier.h, 8]} />
          <meshStandardMaterial color="#1a4a2a" roughness={0.8} />
        </mesh>
      ))}
      {/* Snow on top */}
      {[
        { y: 1.15, r: 0.45, h: 0.08 },
        { y: 1.52, r: 0.35, h: 0.06 },
        { y: 1.85, r: 0.25, h: 0.05 },
      ].map((snow, i) => (
        <mesh key={`snow-${i}`} position={[0, snow.y, 0]}>
          <cylinderGeometry args={[0, snow.r, snow.h, 8]} />
          <meshStandardMaterial color="#e8eef5" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// --- Snow covered ground ---
function SnowGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#dce4ec" roughness={0.8} />
      </mesh>
      {/* Snow mounds */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            0.1,
            (Math.random() - 0.5) * 10 + 3,
          ]}
        >
          <sphereGeometry
            args={[
              0.5 + Math.random() * 0.8,
              8,
              6,
              0,
              Math.PI * 2,
              0,
              Math.PI / 2,
            ]}
          />
          <meshStandardMaterial color="#e0e8f0" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// --- Snow Particles ---
const SNOW_COUNT = 150
const snowDummy = new THREE.Object3D()

function SnowParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: SNOW_COUNT }, () => ({
      x: (Math.random() - 0.5) * 25,
      startY: 5 + Math.random() * 8,
      z: (Math.random() - 0.5) * 20,
      speed: 0.3 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.03,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SNOW_COUNT; i++) {
      const p = particles[i]
      const y = p.startY - ((t * p.speed + p.phase * 5) % (p.startY + 1))
      snowDummy.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * p.drift,
        y,
        p.z + Math.cos(t * 0.3 + p.phase) * p.drift * 0.5,
      )
      snowDummy.scale.setScalar(p.scale)
      snowDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, snowDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#ffffff" />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c0d0e0', 20, 60)
    scene.background = new THREE.Color('#b0c0d5')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function FrozenWaterfall() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} color="#c0d8f0" intensity={0.9} />
      <ambientLight color="#8899bb" intensity={0.35} />
      <hemisphereLight args={['#c0d8f0', '#8899aa', 0.3]} />
      <pointLight
        position={[0, 4, -4]}
        color="#88bbee"
        intensity={0.4}
        distance={12}
      />

      <SnowGround />
      <IceCliff />
      <FrozenWaterfallGeometry />
      <Icicles />

      {/* Pine Trees */}
      <PineTree position={[-5, 0, 2]} scale={1.2} />
      <PineTree position={[-7, 0, 0]} scale={0.9} />
      <PineTree position={[5, 0, 3]} scale={1.0} />
      <PineTree position={[7, 0, 1]} scale={1.3} />
      <PineTree position={[-3, 0, 5]} scale={0.8} />
      <PineTree position={[4, 0, 6]} scale={1.1} />
      <PineTree position={[0, 0, 7]} scale={0.7} />

      <SnowParticles />
    </>
  )
}
