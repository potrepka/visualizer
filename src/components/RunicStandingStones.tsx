import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a1030', 10, 50)
    scene.background = new THREE.Color('#1a1030')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StandingStone({
  position,
  height = 3,
  width = 0.8,
  rotation = 0,
}: {
  position: [number, number, number]
  height?: number
  width?: number
  rotation?: number
}) {
  const runeRefs = useRef<THREE.Mesh[]>([])
  const runeCount = useMemo(() => 2 + Math.floor(Math.random() * 3), [])
  const runePositions = useMemo(() => {
    const arr: { y: number; side: number }[] = []
    for (let i = 0; i < runeCount; i++) {
      arr.push({
        y: 0.3 + (i / runeCount) * (height * 0.7),
        side: i % 2 === 0 ? 1 : -1,
      })
    }
    return arr
  }, [runeCount, height])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    runeRefs.current.forEach((ref, i) => {
      if (ref) {
        const mat = ref.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity =
          1.5 + Math.sin(t * 1.5 + i * 1.2 + position[0]) * 1.0
      }
    })
  })

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main stone */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width * 0.5]} />
        <meshStandardMaterial color="#4a4a50" roughness={0.95} />
      </mesh>
      {/* Tapered top */}
      <mesh position={[0, height + 0.3, 0]}>
        <coneGeometry args={[width * 0.45, 0.8, 4]} />
        <meshStandardMaterial color="#3e3e44" roughness={0.95} />
      </mesh>
      {/* Runes - small emissive planes */}
      {runePositions.map((rune, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) runeRefs.current[i] = el
          }}
          position={[rune.side * (width / 2 + 0.01), rune.y, 0]}
          rotation={[0, rune.side > 0 ? 0 : Math.PI, 0]}
        >
          <planeGeometry args={[0.15, 0.2]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#3366dd"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function GrassyHill() {
  return (
    <group>
      {/* Main hill */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[12, 15, 3, 24]} />
        <meshStandardMaterial color="#2a4a1a" roughness={0.95} />
      </mesh>
      {/* Top surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.49, 0]}>
        <circleGeometry args={[12, 24]} />
        <meshStandardMaterial color="#3a5a2a" roughness={0.95} />
      </mesh>
      {/* Surrounding lower ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a3010" roughness={0.95} />
      </mesh>
    </group>
  )
}

function EnergyBeam() {
  const beamRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = beamRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1.0 + Math.sin(t * 2) * 0.5
    mat.opacity = 0.2 + Math.sin(t * 3) * 0.1
    ringRef.current.rotation.y = t * 0.8
    ringRef.current.position.y = 4 + Math.sin(t) * 1.5
    const ringMat = ringRef.current.material as THREE.MeshStandardMaterial
    ringMat.emissiveIntensity = 1.5 + Math.sin(t * 2.5) * 0.8
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central beam */}
      <mesh ref={beamRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[0.15, 0.6, 16, 12]} />
        <meshStandardMaterial
          color="#6688ff"
          emissive="#4466dd"
          emissiveIntensity={1.5}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Floating ring */}
      <mesh ref={ringRef} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 8, 24]} />
        <meshStandardMaterial
          color="#88aaff"
          emissive="#6688ff"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Base glow */}
      <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial
          color="#4466cc"
          emissive="#3355bb"
          emissiveIntensity={1.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

function GrassClumps() {
  const count = 80
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const clumps = useMemo(() => {
    const arr: { x: number; z: number; s: number; rot: number }[] = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 8
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        s: 0.3 + Math.random() * 0.5,
        rot: Math.random() * Math.PI,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const c = clumps[i]
      dummy.position.set(c.x, 0.5 + c.s * 0.3, c.z)
      dummy.rotation.set(0, c.rot, Math.sin(t * 1.5 + c.x) * 0.08)
      dummy.scale.set(0.1, c.s, 0.1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color="#2e5518" roughness={0.95} />
    </instancedMesh>
  )
}

function TwilightStars() {
  const count = 120
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const stars = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; phase: number }[] =
      []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.5
      const phi = Math.random() * Math.PI * 2
      const r = 35 + Math.random() * 10
      arr.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.cos(theta) + 5,
        z: r * Math.sin(theta) * Math.sin(phi),
        s: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const s = stars[i]
      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.setScalar(s.s * (0.7 + Math.sin(t * 1.5 + s.phase) * 0.3))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ccccff"
        emissiveIntensity={3}
      />
    </instancedMesh>
  )
}

function LintelStones() {
  const count = 4
  const lintels = useMemo(() => {
    const arr: { angle: number; height: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({ angle: (i / count) * Math.PI * 2, height: 3.2 })
    }
    return arr
  }, [])

  return (
    <>
      {lintels.map((l, i) => {
        const r = 5
        const nextAngle = (((i + 1) % count) / count) * Math.PI * 2
        const midAngle = (l.angle + nextAngle) / 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(midAngle) * r,
              l.height + 0.5,
              Math.sin(midAngle) * r,
            ]}
            rotation={[0, -midAngle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[2.5, 0.4, 0.7]} />
            <meshStandardMaterial color="#555560" roughness={0.95} />
          </mesh>
        )
      })}
    </>
  )
}

export default function RunicStandingStones() {
  const stoneCount = 8
  const stones = useMemo(() => {
    const arr: { angle: number; height: number; width: number }[] = []
    for (let i = 0; i < stoneCount; i++) {
      arr.push({
        angle: (i / stoneCount) * Math.PI * 2,
        height: 2.8 + Math.random() * 1.2,
        width: 0.7 + Math.random() * 0.4,
      })
    }
    return arr
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 8, -3]} intensity={0.3} color="#6644aa" />
      <ambientLight intensity={0.06} color="#221144" />
      <pointLight
        position={[0, 3, 0]}
        intensity={3}
        color="#4466ff"
        distance={12}
      />
      <hemisphereLight args={['#332255', '#111100', 0.15]} />

      <GrassyHill />

      {/* Standing stones in a circle */}
      {stones.map((s, i) => (
        <StandingStone
          key={i}
          position={[Math.cos(s.angle) * 5, 0.5, Math.sin(s.angle) * 5]}
          height={s.height}
          width={s.width}
          rotation={s.angle + Math.PI}
        />
      ))}

      <LintelStones />
      <EnergyBeam />
      <GrassClumps />
      <TwilightStars />
    </>
  )
}
