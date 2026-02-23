import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a18', 15, 60)
    scene.background = new THREE.Color('#0a0a18')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

const LANTERN_COUNT = 250
const lanternDummy = new THREE.Object3D()

function Lanterns() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const lanterns = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      drift: number
      phase: number
      scale: number
    }[] = []
    for (let i = 0; i < LANTERN_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 25,
        z: (Math.random() - 0.5) * 40,
        speed: 0.2 + Math.random() * 0.4,
        drift: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.15 + Math.random() * 0.15,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < LANTERN_COUNT; i++) {
      const l = lanterns[i]
      const y = ((l.y + t * l.speed) % 28) - 2
      const x = l.x + Math.sin(t * 0.3 + l.phase) * l.drift * 2
      const z = l.z + Math.cos(t * 0.25 + l.phase) * l.drift * 2
      lanternDummy.position.set(x, y, z)
      lanternDummy.scale.setScalar(l.scale)
      lanternDummy.rotation.set(
        Math.sin(t * 0.5 + l.phase) * 0.1,
        t * 0.1 + l.phase,
        Math.cos(t * 0.4 + l.phase) * 0.1,
      )
      lanternDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, lanternDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LANTERN_COUNT]}>
      <boxGeometry args={[1, 1.4, 1]} />
      <meshStandardMaterial
        color="#ff9944"
        emissive="#ff7722"
        emissiveIntensity={2.5}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  )
}

function WaterSurface() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.15 + Math.sin(t * 0.5) * 0.05
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#0a1a2a"
        emissive="#331a00"
        emissiveIntensity={0.15}
        roughness={0.1}
        metalness={0.6}
      />
    </mesh>
  )
}

function WaterReflections() {
  const count = 100
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const reflections = useMemo(() => {
    const arr: { x: number; z: number; phase: number; s: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        phase: Math.random() * Math.PI * 2,
        s: 0.2 + Math.random() * 0.4,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const r = reflections[i]
      dummy.position.set(
        r.x + Math.sin(t * 0.3 + r.phase) * 0.5,
        -0.48,
        r.z + Math.cos(t * 0.2 + r.phase) * 0.5,
      )
      dummy.rotation.set(-Math.PI / 2, 0, 0)
      const pulse = r.s * (0.6 + Math.sin(t * 1.5 + r.phase) * 0.4)
      dummy.scale.set(pulse, pulse, 0.01)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ff8833"
        emissive="#ff6611"
        emissiveIntensity={1}
        transparent
        opacity={0.3}
      />
    </instancedMesh>
  )
}

function Bridge() {
  const planks = 20
  const bridgeLength = 12
  return (
    <group position={[0, -0.2, 5]}>
      {/* Planks */}
      {Array.from({ length: planks }).map((_, i) => {
        const x = (i / planks) * bridgeLength - bridgeLength / 2
        const curve = Math.sin((i / planks) * Math.PI) * 0.5
        return (
          <mesh key={i} position={[x, curve, 0]}>
            <boxGeometry args={[(bridgeLength / planks) * 0.9, 0.06, 1.2]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Railings */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Posts */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = (i / 5) * bridgeLength - bridgeLength / 2
            const curve = Math.sin((i / 5) * Math.PI) * 0.5
            return (
              <mesh key={i} position={[x, curve + 0.4, side * 0.55]}>
                <boxGeometry args={[0.06, 0.8, 0.06]} />
                <meshStandardMaterial color="#4a2e14" roughness={0.9} />
              </mesh>
            )
          })}
          {/* Top rail */}
          {Array.from({ length: 5 }).map((_, i) => {
            const x1 = (i / 5) * bridgeLength - bridgeLength / 2
            const x2 = ((i + 1) / 5) * bridgeLength - bridgeLength / 2
            const y1 = Math.sin((i / 5) * Math.PI) * 0.5
            const y2 = Math.sin(((i + 1) / 5) * Math.PI) * 0.5
            return (
              <mesh
                key={i}
                position={[(x1 + x2) / 2, (y1 + y2) / 2 + 0.8, side * 0.55]}
              >
                <boxGeometry args={[(bridgeLength / 5) * 1.05, 0.04, 0.04]} />
                <meshStandardMaterial color="#4a2e14" roughness={0.9} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function Shoreline() {
  return (
    <>
      {/* Banks */}
      <mesh position={[-8, 0, 5]}>
        <boxGeometry args={[5, 0.8, 8]} />
        <meshStandardMaterial color="#2a3a20" roughness={0.95} />
      </mesh>
      <mesh position={[8, 0, 5]}>
        <boxGeometry args={[5, 0.8, 8]} />
        <meshStandardMaterial color="#2a3a20" roughness={0.95} />
      </mesh>
      {/* Trees on shore */}
      {[
        [-9, 0, 3],
        [-7, 0, 7],
        [9, 0, 4],
        [7, 0, 8],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 3, 6]} />
            <meshStandardMaterial color="#3a2818" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#1a3a10" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function DistantHills() {
  return (
    <>
      {[
        [-15, -1, -20],
        [10, -1, -25],
        [25, -1, -18],
        [-25, -1, -22],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry
            args={[8 + i * 2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#0a1510" roughness={0.95} />
        </mesh>
      ))}
    </>
  )
}

function LanternStand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 2, 6]} />
        <meshStandardMaterial color="#3a2818" roughness={0.9} />
      </mesh>
      {/* Hanging lantern */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#ff8833"
          emissive="#ff6611"
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight
        position={[0, 2.1, 0]}
        intensity={1}
        color="#ff8833"
        distance={4}
      />
    </group>
  )
}

export default function FloatingLanternFestival() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} intensity={0.1} color="#ffaa66" />
      <ambientLight intensity={0.03} color="#221100" />

      <WaterSurface />
      <WaterReflections />
      <Lanterns />
      <Bridge />
      <Shoreline />
      <DistantHills />

      <LanternStand position={[-5.3, 0.4, 5]} />
      <LanternStand position={[5.3, 0.4, 5]} />
      <LanternStand position={[-5.3, 0.4, 2]} />
      <LanternStand position={[5.3, 0.4, 2]} />
    </>
  )
}
