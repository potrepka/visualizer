import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#000000', 15, 40)
    scene.background = new THREE.Color('#050510')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Tunnel ring segment ---
function TunnelRing({
  z,
  radius,
  symmetry,
  colorOffset,
}: {
  z: number
  radius: number
  symmetry: number
  colorOffset: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = t * 0.3 + phase
  })

  const segments = useMemo(() => {
    const arr: {
      angle: number
      shape: 'box' | 'torus' | 'sphere' | 'cone'
      scale: [number, number, number]
      dist: number
    }[] = []
    for (let i = 0; i < symmetry; i++) {
      const angle = (i / symmetry) * Math.PI * 2
      const shapes: ('box' | 'torus' | 'sphere' | 'cone')[] = [
        'box',
        'torus',
        'sphere',
        'cone',
      ]
      arr.push({
        angle,
        shape: shapes[i % shapes.length],
        scale: [
          0.2 + Math.random() * 0.4,
          0.2 + Math.random() * 0.4,
          0.2 + Math.random() * 0.3,
        ],
        dist: radius * (0.7 + Math.random() * 0.3),
      })
    }
    return arr
  }, [symmetry, radius])

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      {segments.map((seg, i) => {
        const x = Math.cos(seg.angle) * seg.dist
        const y = Math.sin(seg.angle) * seg.dist
        const hue = (colorOffset + i / symmetry) % 1
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5)
        const emissive = new THREE.Color().setHSL(hue, 0.9, 0.3)

        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, seg.angle]}>
            {seg.shape === 'box' && <boxGeometry args={seg.scale} />}
            {seg.shape === 'torus' && (
              <torusGeometry
                args={[seg.scale[0] * 0.5, seg.scale[1] * 0.2, 8, 12]}
              />
            )}
            {seg.shape === 'sphere' && (
              <sphereGeometry args={[seg.scale[0] * 0.4, 8, 8]} />
            )}
            {seg.shape === 'cone' && (
              <coneGeometry args={[seg.scale[0] * 0.3, seg.scale[1], 6]} />
            )}
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={1.5}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Streaking light beams ---
const BEAM_COUNT = 80
const beamDummy = new THREE.Object3D()

function LightBeams() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const beams = useMemo(
    () =>
      Array.from({ length: BEAM_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 2 + Math.random() * 3,
        z: Math.random() * 40 - 5,
        speed: 5 + Math.random() * 10,
        hue: Math.random(),
        scale: 0.02 + Math.random() * 0.03,
        length: 0.5 + Math.random() * 2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < BEAM_COUNT; i++) {
      const b = beams[i]
      const z = ((((b.z - t * b.speed) % 45) + 50) % 45) - 5
      beamDummy.position.set(
        Math.cos(b.angle + t * 0.2) * b.radius,
        Math.sin(b.angle + t * 0.2) * b.radius,
        z,
      )
      beamDummy.scale.set(b.scale, b.scale, b.length)
      beamDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, beamDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BEAM_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={3}
      />
    </instancedMesh>
  )
}

// --- Pulsing center glow ---
function CenterGlow() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    const hue = (t * 0.05) % 1
    mat.emissive.setHSL(hue, 1, 0.5)
    mat.emissiveIntensity = 2 + Math.sin(t * 2) * 1
    ref.current.scale.setScalar(0.3 + 0.1 * Math.sin(t * 3))
  })

  return (
    <mesh ref={ref} position={[0, 0, 35]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#000000"
        emissive="#ff0000"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// --- Geometric mandala patterns ---
function MandalaRing({ z, radius }: { z: number; radius: number }) {
  const ref = useRef<THREE.Group>(null!)
  const segments = 12

  useFrame(({ clock }) => {
    ref.current.rotation.z = -clock.getElapsedTime() * 0.5
  })

  return (
    <group ref={ref} position={[0, 0, z]}>
      {Array.from({ length: segments }, (_, i) => {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <cylinderGeometry args={[0.05, 0.05, radius * 0.8, 4]} />
            <meshStandardMaterial
              color="#ff44ff"
              emissive="#aa22aa"
              emissiveIntensity={1.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Spiral helix along tunnel ---
function HelixSpiral({ offset }: { offset: number }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.2
  })

  const points = useMemo(() => {
    const arr: { pos: [number, number, number]; hue: number }[] = []
    for (let i = 0; i < 60; i++) {
      const t = i / 60
      const angle = t * Math.PI * 8 + offset
      const z = t * 35
      const r = 4.5
      arr.push({
        pos: [Math.cos(angle) * r, Math.sin(angle) * r, z],
        hue: t,
      })
    }
    return arr
  }, [offset])

  return (
    <group ref={ref}>
      {points.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(p.hue, 1, 0.6)}
            emissive={new THREE.Color().setHSL(p.hue, 1, 0.4)}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Camera animation ---
function CameraAnimation() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    camera.position.set(
      Math.sin(t * 0.3) * 0.5,
      Math.cos(t * 0.4) * 0.5,
      (t * 2) % 35,
    )
    camera.lookAt(
      Math.sin(t * 0.3) * 0.2,
      Math.cos(t * 0.4) * 0.2,
      camera.position.z + 10,
    )
  })
  return null
}

// --- Main Scene ---
export default function KaleidoscopeTunnel() {
  const rings = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        z: i * 1.5,
        radius: 4 + Math.sin(i * 0.5) * 1,
        symmetry: 6 + (i % 4) * 2,
        colorOffset: i * 0.08,
      })),
    [],
  )

  return (
    <>
      <SceneSetup />
      <CameraAnimation />
      <ambientLight intensity={0.05} color="#220044" />
      <pointLight
        position={[0, 0, 5]}
        color="#ff66ff"
        intensity={1}
        distance={15}
      />
      <pointLight
        position={[0, 0, 20]}
        color="#66ffff"
        intensity={1}
        distance={15}
      />
      <pointLight
        position={[0, 0, 35]}
        color="#ffff66"
        intensity={1}
        distance={15}
      />

      {rings.map((r, i) => (
        <TunnelRing
          key={i}
          z={r.z}
          radius={r.radius}
          symmetry={r.symmetry}
          colorOffset={r.colorOffset}
        />
      ))}

      <MandalaRing z={10} radius={4} />
      <MandalaRing z={25} radius={3.5} />

      <HelixSpiral offset={0} />
      <HelixSpiral offset={Math.PI} />

      <LightBeams />
      <CenterGlow />
    </>
  )
}
