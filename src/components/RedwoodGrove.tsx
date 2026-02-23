import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Massive Redwood Tree ---
function RedwoodTree({
  position,
  height,
  radius,
}: {
  position: [number, number, number]
  height: number
  radius: number
}) {
  const buttressCount = useMemo(() => 3 + Math.floor(Math.random() * 3), [])

  return (
    <group position={position}>
      {/* Main trunk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius * 0.7, radius, height, 12]} />
        <meshStandardMaterial color="#5a2d0c" roughness={0.9} />
      </mesh>
      {/* Bark texture rings */}
      {Array.from({ length: Math.floor(height / 2) }, (_, i) => (
        <mesh key={`ring-${i}`} position={[0, i * 2 + 1, 0]}>
          <torusGeometry args={[radius * (0.72 - i * 0.01), 0.03, 4, 12]} />
          <meshStandardMaterial color="#4a2008" roughness={0.95} />
        </mesh>
      ))}
      {/* Root buttresses */}
      {Array.from({ length: buttressCount }, (_, i) => {
        const angle = (i / buttressCount) * Math.PI * 2
        return (
          <mesh
            key={`root-${i}`}
            position={[
              Math.cos(angle) * radius * 0.8,
              0.5,
              Math.sin(angle) * radius * 0.8,
            ]}
            rotation={[0.3 * Math.sin(angle), angle, 0.3 * Math.cos(angle)]}
          >
            <boxGeometry args={[0.3, 1.2, radius * 0.8]} />
            <meshStandardMaterial color="#4a2d0c" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Canopy - high up, multiple sphere clusters */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 1 + Math.random() * 2
        const y = height - 2 + Math.random() * 3
        return (
          <mesh
            key={`canopy-${i}`}
            position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[1.5 + Math.random() * 1.5, 8, 6]} />
            <meshStandardMaterial color="#1a4a1a" roughness={0.8} />
          </mesh>
        )
      })}
      {/* Some lower branches */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.random()
        const branchY = height * 0.4 + i * height * 0.12
        return (
          <group
            key={`branch-${i}`}
            position={[0, branchY, 0]}
            rotation={[0, angle, 0]}
          >
            <mesh position={[radius + 0.5, 0, 0]} rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.05, 0.08, 1.2, 5]} />
              <meshStandardMaterial color="#4a2d0c" roughness={0.85} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// --- Fern ---
function Fern({ position }: { position: [number, number, number] }) {
  const fronds = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2 + Math.random() * 0.3,
      tilt: 0.6 + Math.random() * 0.4,
      length: 0.3 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <group position={position}>
      {fronds.map((f, i) => (
        <mesh
          key={i}
          position={[Math.cos(f.angle) * 0.1, 0.1, Math.sin(f.angle) * 0.1]}
          rotation={[f.tilt, f.angle, 0]}
        >
          <planeGeometry args={[0.08, f.length]} />
          <meshStandardMaterial
            color="#2a6a1a"
            side={THREE.DoubleSide}
            roughness={0.7}
          />
        </mesh>
      ))}
      {/* Center curl */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.03, 5, 5]} />
        <meshStandardMaterial color="#3a8a2a" roughness={0.7} />
      </mesh>
    </group>
  )
}

// --- Creek ---
function Creek() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.metalness = 0.5 + Math.sin(t * 0.5) * 0.1
  })

  const creekStones = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      pos: [
        Math.sin(i * 0.5) * 0.6 + (Math.random() - 0.5) * 0.3,
        0.02,
        -6 + i * 1.2,
      ] as [number, number, number],
      scale: 0.04 + Math.random() * 0.06,
    }))
  }, [])

  return (
    <group position={[-3, 0, 0]}>
      {/* Water surface */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.2, 14]} />
        <meshStandardMaterial
          color="#2a5a5a"
          metalness={0.6}
          roughness={0.15}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Creek bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[1.4, 14.5]} />
        <meshStandardMaterial color="#3a3a28" roughness={0.95} />
      </mesh>
      {/* Stones */}
      {creekStones.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[s.scale, 5, 4]} />
          <meshStandardMaterial color="#7a7a6a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// --- Light Shafts ---
function LightShafts() {
  const shafts = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 14,
      tilt: (Math.random() - 0.5) * 0.2,
      width: 0.3 + Math.random() * 0.5,
    }))
  }, [])

  return (
    <group>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, 7, s.z]} rotation={[0, 0, s.tilt]}>
          <cylinderGeometry args={[s.width * 0.3, s.width, 14, 6]} />
          <meshBasicMaterial
            color="#aabb66"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Mist / fog particles ---
const MIST_COUNT = 50
const mistDummy = new THREE.Object3D()

function ForestMist() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: MIST_COUNT }, () => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      y: 0.5 + Math.random() * 3,
      speed: 0.03 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
      scale: 1 + Math.random() * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < MIST_COUNT; i++) {
      const p = particles[i]
      mistDummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 2,
        p.y,
        p.z + Math.cos(t * p.speed * 0.7 + p.phase) * 2,
      )
      mistDummy.scale.set(p.scale, 0.15, p.scale)
      mistDummy.rotation.y = t * 0.02 + p.phase
      mistDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, mistDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MIST_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#aabb99"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

// --- Forest Floor Debris ---
function ForestFloor() {
  const debris = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      pos: [(Math.random() - 0.5) * 16, 0.01, (Math.random() - 0.5) * 16] as [
        number,
        number,
        number,
      ],
      rot: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.5,
    }))
  }, [])

  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial color="#2a3a1a" roughness={0.95} />
      </mesh>
      {/* Fallen leaves / debris patches */}
      {debris.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[-Math.PI / 2, d.rot, 0]}>
          <circleGeometry args={[d.scale, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#3a2a10' : '#4a3a18'}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#5a7a4a', 12, 40)
    scene.background = new THREE.Color('#6a8a5a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function RedwoodGrove() {
  const trees = useMemo(
    () => [
      { pos: [0, 0, -3] as [number, number, number], height: 18, radius: 0.8 },
      { pos: [5, 0, -5] as [number, number, number], height: 20, radius: 0.9 },
      { pos: [-4, 0, -6] as [number, number, number], height: 16, radius: 0.7 },
      { pos: [7, 0, 2] as [number, number, number], height: 22, radius: 1.0 },
      { pos: [-6, 0, 1] as [number, number, number], height: 15, radius: 0.65 },
      { pos: [2, 0, 5] as [number, number, number], height: 17, radius: 0.75 },
      { pos: [-2, 0, 7] as [number, number, number], height: 19, radius: 0.85 },
    ],
    [],
  )

  const ferns = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      pos: [(Math.random() - 0.5) * 14, 0, (Math.random() - 0.5) * 14] as [
        number,
        number,
        number,
      ],
    }))
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[4, 15, 5]} color="#aabb77" intensity={0.6} />
      <ambientLight color="#334422" intensity={0.25} />
      <hemisphereLight args={['#88aa66', '#223311', 0.35]} />

      <ForestFloor />
      <Creek />

      {trees.map((t, i) => (
        <RedwoodTree
          key={i}
          position={t.pos}
          height={t.height}
          radius={t.radius}
        />
      ))}

      {ferns.map((f, i) => (
        <Fern key={i} position={f.pos} />
      ))}

      <LightShafts />
      <ForestMist />
    </>
  )
}
