import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#0a0e1a')
    scene.fog = new THREE.Fog('#0a0e1a', 8, 30)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Mushroom({
  position,
  scale = 1,
  capColor = '#cc3344',
  hasDots = true,
}: {
  position: [number, number, number]
  scale?: number
  capColor?: string
  hasDots?: boolean
}) {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.7} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={capColor} roughness={0.6} />
      </mesh>
      {/* Dots on cap */}
      {hasDots &&
        Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2
          const r = 0.1
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0.5, Math.sin(a) * r]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshStandardMaterial color="#ffffee" />
            </mesh>
          )
        })}
      {/* Gills under cap */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.16, 0.06, 12]} />
        <meshStandardMaterial color="#ddc8b0" roughness={0.8} />
      </mesh>
    </group>
  )
}

function MushroomRing() {
  const mushrooms = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: number
      color: string
      dots: boolean
    }[] = []
    const count = 14
    const radius = 2.5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 0.3
      arr.push({
        pos: [Math.sin(angle) * r, 0, Math.cos(angle) * r],
        scale: 0.6 + Math.random() * 0.8,
        color: ['#cc3344', '#cc5544', '#dd4455', '#bb2233'][
          Math.floor(Math.random() * 4)
        ],
        dots: Math.random() > 0.3,
      })
    }
    return arr
  }, [])

  return (
    <>
      {mushrooms.map((m, i) => (
        <Mushroom
          key={i}
          position={m.pos}
          scale={m.scale}
          capColor={m.color}
          hasDots={m.dots}
        />
      ))}
    </>
  )
}

const FAIRY_COUNT = 30
const fairyDummy = new THREE.Object3D()

function FairyLights() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  const data = useMemo(
    () =>
      Array.from({ length: FAIRY_COUNT }).map(() => ({
        angle: Math.random() * Math.PI * 2,
        radius: 1 + Math.random() * 3,
        height: 0.3 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.6,
        wobble: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FAIRY_COUNT; i++) {
      const d = data[i]
      const currentAngle = d.angle + t * d.speed
      fairyDummy.position.set(
        Math.sin(currentAngle) * d.radius +
          Math.sin(t * 2 + d.phase) * d.wobble,
        d.height + Math.sin(t * 1.5 + d.phase) * 0.3,
        Math.cos(currentAngle) * d.radius +
          Math.cos(t * 2 + d.phase) * d.wobble,
      )
      const pulse = 0.5 + Math.sin(t * 4 + d.phase) * 0.5
      fairyDummy.scale.setScalar(0.02 + pulse * 0.02)
      fairyDummy.updateMatrix()
      ref.current.setMatrixAt(i, fairyDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FAIRY_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ffeeaa"
        emissive="#ffdd66"
        emissiveIntensity={5}
      />
    </instancedMesh>
  )
}

function AncientTree({
  position,
  height = 5,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.15, 0.3, height, 8]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.95} />
      </mesh>
      {/* Root bulges */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.25, 0.15, Math.cos(angle) * 0.25]}
          >
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial color="#2a1a0e" roughness={0.95} />
          </mesh>
        )
      })}
      {/* Canopy */}
      <mesh position={[0, height + 0.5, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#0e2a0e" roughness={0.85} />
      </mesh>
      <mesh position={[0.5, height + 0.2, 0.5]}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#142e14" roughness={0.85} />
      </mesh>
      <mesh position={[-0.6, height, -0.3]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#0e2a0e" roughness={0.85} />
      </mesh>
      {/* Moss on trunk */}
      <mesh position={[0.15, height * 0.3, 0.15]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function MossyGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.95} />
      </mesh>
      {/* Moss patches */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * 8
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
            position={[Math.cos(angle) * r, 0.01, Math.sin(angle) * r]}
          >
            <circleGeometry args={[0.3 + Math.random() * 0.5, 8]} />
            <meshStandardMaterial color="#2a4a2a" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function MistParticles() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 25

  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        baseScale: 1 + Math.random() * 2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const d = data[i]
      dummy.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * 1,
        0.15 + Math.sin(t * 0.5 + d.phase) * 0.1,
        d.z + Math.cos(t * d.speed + d.phase) * 1,
      )
      dummy.scale.set(d.baseScale, 0.15, d.baseScale)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#aaccaa" transparent opacity={0.08} />
    </instancedMesh>
  )
}

function Moon() {
  return (
    <group position={[8, 15, -12]}>
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial
          color="#eeeedd"
          emissive="#ddddcc"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

function CenterGlow() {
  const ref = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.intensity = 0.8 + Math.sin(t * 1.5) * 0.3
  })

  return (
    <group>
      <pointLight
        ref={ref}
        position={[0, 0.5, 0]}
        color="#aaffaa"
        intensity={0.8}
        distance={6}
      />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 24]} />
        <meshStandardMaterial
          color="#224422"
          emissive="#225522"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

export default function FairyRing() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[8, 15, -12]}
        intensity={0.3}
        color="#aaaacc"
      />
      <ambientLight intensity={0.04} />

      <MossyGround />
      <Moon />
      <MushroomRing />
      <FairyLights />
      <CenterGlow />
      <MistParticles />

      <AncientTree position={[-5, 0, -4]} height={6} />
      <AncientTree position={[5, 0, -3]} height={5} />
      <AncientTree position={[-4, 0, 5]} height={7} />
      <AncientTree position={[4.5, 0, 4.5]} height={5.5} />
      <AncientTree position={[-6, 0, 1]} height={6.5} />
      <AncientTree position={[6, 0, 0]} height={5} />
    </>
  )
}
