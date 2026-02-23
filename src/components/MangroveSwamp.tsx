import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Mangrove Tree with visible root system ---
function MangroveTree({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  const rootCount = useMemo(() => 5 + Math.floor(Math.random() * 5), [])

  return (
    <group position={position}>
      {/* Main trunk */}
      <mesh position={[0, height / 2 + 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.12, height, 8]} />
        <meshStandardMaterial color="#4a3a20" roughness={0.85} />
      </mesh>
      {/* Aerial root system */}
      {Array.from({ length: rootCount }, (_, i) => {
        const angle = (i / rootCount) * Math.PI * 2 + Math.random() * 0.5
        const spread = 0.5 + Math.random() * 0.8
        const rootHeight = 1 + Math.random() * 0.5
        return (
          <group key={`root-${i}`}>
            {/* Root going down to water */}
            <mesh
              position={[
                Math.cos(angle) * spread * 0.5,
                rootHeight / 2,
                Math.sin(angle) * spread * 0.5,
              ]}
              rotation={[Math.sin(angle) * 0.3, 0, -Math.cos(angle) * 0.4]}
            >
              <cylinderGeometry args={[0.015, 0.025, rootHeight, 5]} />
              <meshStandardMaterial color="#3a2a15" roughness={0.9} />
            </mesh>
            {/* Root tip in water */}
            <mesh
              position={[
                Math.cos(angle) * spread,
                -0.1,
                Math.sin(angle) * spread,
              ]}
            >
              <cylinderGeometry args={[0.008, 0.02, 0.4, 4]} />
              <meshStandardMaterial color="#3a2a15" roughness={0.9} />
            </mesh>
          </group>
        )
      })}
      {/* Canopy */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const r = 0.3 + Math.random() * 0.5
        return (
          <mesh
            key={`canopy-${i}`}
            position={[Math.cos(angle) * r, height + 0.8, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.5 + Math.random() * 0.4, 8, 6]} />
            <meshStandardMaterial color="#2a5a1a" roughness={0.75} />
          </mesh>
        )
      })}
      {/* Hanging moss strands */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.random()
        const r = 0.4 + Math.random() * 0.3
        const mossLength = 0.5 + Math.random() * 1.0
        return (
          <mesh
            key={`moss-${i}`}
            position={[
              Math.cos(angle) * r,
              height + 0.3 - mossLength / 2,
              Math.sin(angle) * r,
            ]}
          >
            <cylinderGeometry args={[0.008, 0.005, mossLength, 3]} />
            <meshStandardMaterial
              color="#6a8a4a"
              transparent
              opacity={0.7}
              roughness={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Lily Pad ---
function LilyPad({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.01
    ref.current.rotation.z = Math.sin(t * 0.3 + phase) * 0.02
  })

  return (
    <group>
      <mesh
        ref={ref}
        position={position}
        rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
      >
        <circleGeometry args={[0.15 + Math.random() * 0.1, 12]} />
        <meshStandardMaterial
          color="#3a7a2a"
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// --- Murky Water ---
function MurkyWater() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = 0.01 + Math.sin(t * 0.2) * 0.005
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#2a4a2a"
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// --- Muddy ground (patches above water) ---
function MudPatches() {
  const patches = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      pos: [(Math.random() - 0.5) * 14, 0.05, (Math.random() - 0.5) * 14] as [
        number,
        number,
        number,
      ],
      scale: 0.5 + Math.random() * 1.0,
    }))
  }, [])

  return (
    <group>
      {/* Underwater mud floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a2a18" roughness={0.95} />
      </mesh>
      {/* Mud mounds */}
      {patches.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry
            args={[p.scale, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#4a3a20" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// --- Reeds ---
function Reeds({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(t * 0.4 + phase) * 0.03
    ref.current.rotation.z = Math.cos(t * 0.35 + phase) * 0.03
  })

  return (
    <group position={position} ref={ref}>
      {Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => {
        const x = (Math.random() - 0.5) * 0.15
        const z = (Math.random() - 0.5) * 0.15
        const h = 0.8 + Math.random() * 0.6
        return (
          <mesh key={i} position={[x, h / 2, z]}>
            <cylinderGeometry args={[0.01, 0.015, h, 4]} />
            <meshStandardMaterial color="#5a6a3a" roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Fog / humidity particles ---
const FOG_COUNT = 70
const fogDummy = new THREE.Object3D()

function HumidityFog() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: FOG_COUNT }, () => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      y: 0.5 + Math.random() * 2,
      speed: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
      scale: 0.8 + Math.random() * 1.5,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FOG_COUNT; i++) {
      const p = particles[i]
      fogDummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 2,
        p.y + Math.sin(t * 0.2 + p.phase) * 0.15,
        p.z + Math.cos(t * p.speed * 0.8 + p.phase) * 2,
      )
      fogDummy.scale.set(p.scale, 0.1, p.scale)
      fogDummy.rotation.y = t * 0.03 + p.phase
      fogDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fogDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FOG_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#8aaa7a"
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

// --- Firefly particles ---
const FIREFLY_COUNT = 40
const fireflyDummy = new THREE.Object3D()

function Fireflies() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const fireflies = useMemo(() => {
    return Array.from({ length: FIREFLY_COUNT }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: 0.5 + Math.random() * 3,
      z: (Math.random() - 0.5) * 14,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      blinkSpeed: 1 + Math.random() * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const f = fireflies[i]
      const brightness = Math.max(0, Math.sin(t * f.blinkSpeed + f.phase))
      fireflyDummy.position.set(
        f.x + Math.sin(t * f.speed * 0.3 + f.phase) * 0.5,
        f.y + Math.sin(t * 0.5 + f.phase) * 0.3,
        f.z + Math.cos(t * f.speed * 0.3 + f.phase) * 0.5,
      )
      fireflyDummy.scale.setScalar(0.015 * brightness)
      fireflyDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fireflyDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FIREFLY_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ccff66"
        emissive="#aaee44"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#3a5a3a', 8, 30)
    scene.background = new THREE.Color('#3a5a3a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function MangroveSwamp() {
  const trees = useMemo(
    () => [
      { pos: [-3, 0, -2] as [number, number, number], height: 3.5 },
      { pos: [4, 0, -4] as [number, number, number], height: 4.0 },
      { pos: [-5, 0, 3] as [number, number, number], height: 3.0 },
      { pos: [2, 0, 4] as [number, number, number], height: 3.8 },
      { pos: [6, 0, 1] as [number, number, number], height: 3.2 },
      { pos: [-1, 0, -5] as [number, number, number], height: 4.2 },
      { pos: [-6, 0, -3] as [number, number, number], height: 3.6 },
      { pos: [3, 0, -1] as [number, number, number], height: 2.8 },
      { pos: [0, 0, 6] as [number, number, number], height: 3.4 },
    ],
    [],
  )

  const lilyPads = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      pos: [(Math.random() - 0.5) * 10, 0.03, (Math.random() - 0.5) * 10] as [
        number,
        number,
        number,
      ],
    }))
  }, [])

  const reeds = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      pos: [(Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12] as [
        number,
        number,
        number,
      ],
    }))
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 6, 4]} color="#aabb88" intensity={0.6} />
      <ambientLight color="#334422" intensity={0.3} />
      <hemisphereLight args={['#88aa66', '#223311', 0.25]} />

      <MudPatches />
      <MurkyWater />

      {trees.map((t, i) => (
        <MangroveTree key={i} position={t.pos} height={t.height} />
      ))}

      {lilyPads.map((lp, i) => (
        <LilyPad key={i} position={lp.pos} />
      ))}

      {reeds.map((r, i) => (
        <Reeds key={i} position={r.pos} />
      ))}

      <HumidityFog />
      <Fireflies />
    </>
  )
}
