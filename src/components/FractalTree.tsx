import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2a1a', 12, 40)
    scene.background = new THREE.Color('#1a2a1a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Branch Data Generation (recursive) ---
interface BranchData {
  startX: number
  startY: number
  startZ: number
  endX: number
  endY: number
  endZ: number
  radius: number
  depth: number
  phase: number
}

function generateBranches(
  sx: number,
  sy: number,
  sz: number,
  angle: number,
  tilt: number,
  length: number,
  radius: number,
  depth: number,
  maxDepth: number,
  branches: BranchData[],
): void {
  if (depth > maxDepth) return

  const ex = sx + Math.sin(angle) * Math.cos(tilt) * length
  const ey = sy + Math.sin(tilt) * length
  const ez = sz + Math.cos(angle) * Math.cos(tilt) * length

  branches.push({
    startX: sx,
    startY: sy,
    startZ: sz,
    endX: ex,
    endY: ey,
    endZ: ez,
    radius,
    depth,
    phase: sx * 3.14 + sy * 2.71 + sz * 1.62,
  })

  // Branch into 2-3 sub-branches
  const branchCount = depth < 2 ? 3 : 2
  const spreadAngle = 0.5 + depth * 0.1
  const lengthFactor = 0.68 + Math.random() * 0.08
  const radiusFactor = 0.6

  for (let i = 0; i < branchCount; i++) {
    const angleOffset = (i - (branchCount - 1) / 2) * spreadAngle
    const tiltReduction = 0.05 + Math.random() * 0.1
    const newAngle = angle + angleOffset + (Math.random() - 0.5) * 0.3
    const newTilt = tilt - tiltReduction
    const newLength = length * lengthFactor

    generateBranches(
      ex,
      ey,
      ez,
      newAngle,
      newTilt,
      newLength,
      radius * radiusFactor,
      depth + 1,
      maxDepth,
      branches,
    )
  }
}

// --- Single Branch Mesh ---
function Branch({ data }: { data: BranchData }) {
  const dx = data.endX - data.startX
  const dy = data.endY - data.startY
  const dz = data.endZ - data.startZ
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const midX = (data.startX + data.endX) / 2
  const midY = (data.startY + data.endY) / 2
  const midZ = (data.startZ + data.endZ) / 2

  const direction = new THREE.Vector3(dx, dy, dz).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
  const euler = new THREE.Euler().setFromQuaternion(quaternion)

  // Color gradient: brown trunk to green tips
  const t = data.depth / 7
  const brown = new THREE.Color('#4a3020')
  const green = new THREE.Color('#2a5a20')
  const color = brown.clone().lerp(green, t)

  return (
    <mesh position={[midX, midY, midZ]} rotation={euler}>
      <cylinderGeometry args={[data.radius * 0.7, data.radius, length, 6]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

// --- Leaf Cluster (at terminal branches) ---
function LeafCluster({
  position,
  size,
  phase,
}: {
  position: [number, number, number]
  size: number
  phase: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const sway = Math.sin(t * 0.8 + phase) * 0.1
    ref.current.rotation.z = sway
    ref.current.rotation.x = Math.sin(t * 0.6 + phase * 1.3) * 0.08
  })

  const greenShade = useMemo(() => {
    const hue = 0.25 + Math.random() * 0.1
    const sat = 0.5 + Math.random() * 0.3
    const lightness = 0.25 + Math.random() * 0.15
    return new THREE.Color().setHSL(hue, sat, lightness)
  }, [])

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshStandardMaterial
        color={greenShade}
        roughness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

// --- Ground ---
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[8, 24]} />
        <meshStandardMaterial color="#2a3a1a" roughness={0.95} />
      </mesh>
      {/* Grass tufts */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const dist = 1 + Math.random() * 5
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * dist, 0.05, Math.sin(angle) * dist]}
          >
            <boxGeometry args={[0.15, 0.1, 0.15]} />
            <meshStandardMaterial color="#3a5a20" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Root bumps at tree base */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={`root${i}`}
            position={[Math.cos(angle) * 0.5, 0.05, Math.sin(angle) * 0.5]}
            rotation={[0, angle, Math.PI / 6]}
          >
            <cylinderGeometry args={[0.05, 0.12, 0.6, 5]} />
            <meshStandardMaterial color="#3a2515" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Fireflies ---
const FIREFLY_COUNT = 30
const fireflyDummy = new THREE.Object3D()

function Fireflies() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(
    () =>
      Array.from({ length: FIREFLY_COUNT }, () => ({
        cx: (Math.random() - 0.5) * 8,
        cy: 1 + Math.random() * 6,
        cz: (Math.random() - 0.5) * 8,
        radius: 0.5 + Math.random() * 1.5,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        blinkSpeed: 1 + Math.random() * 2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const d = data[i]
      const angle = t * d.speed + d.phase
      fireflyDummy.position.set(
        d.cx + Math.cos(angle) * d.radius,
        d.cy + Math.sin(t * 0.5 + d.phase) * 0.5,
        d.cz + Math.sin(angle) * d.radius,
      )
      const blink = Math.max(0, Math.sin(t * d.blinkSpeed + d.phase))
      fireflyDummy.scale.setScalar(0.03 * blink)
      fireflyDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fireflyDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FIREFLY_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ccff66"
        emissive="#aaee33"
        emissiveIntensity={3}
      />
    </instancedMesh>
  )
}

// --- Trunk Sway ---
function SwayingTree() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.02
    groupRef.current.rotation.x = Math.sin(t * 0.15 + 1) * 0.015
  })

  const { branches, leaves } = useMemo(() => {
    const branchArr: BranchData[] = []
    generateBranches(0, 0, 0, 0, Math.PI / 2.2, 2, 0.2, 0, 6, branchArr)

    const leafArr: {
      pos: [number, number, number]
      size: number
      phase: number
    }[] = []
    for (const b of branchArr) {
      if (b.depth >= 5) {
        leafArr.push({
          pos: [b.endX, b.endY, b.endZ],
          size: 0.15 + Math.random() * 0.2,
          phase: b.phase,
        })
      }
    }

    return { branches: branchArr, leaves: leafArr }
  }, [])

  return (
    <group ref={groupRef}>
      {branches.map((b, i) => (
        <Branch key={i} data={b} />
      ))}
      {leaves.map((l, i) => (
        <LeafCluster
          key={`leaf${i}`}
          position={l.pos}
          size={l.size}
          phase={l.phase}
        />
      ))}
    </group>
  )
}

// --- Main Scene ---
export default function FractalTree() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.15} color="#2a4a2a" />
      <directionalLight position={[5, 10, 3]} intensity={0.6} color="#ffeedd" />
      <directionalLight
        position={[-3, 6, -4]}
        intensity={0.2}
        color="#4466aa"
      />
      <pointLight
        position={[0, 4, 2]}
        intensity={0.3}
        color="#88aa44"
        distance={12}
      />
      <Ground />
      <SwayingTree />
      <Fireflies />
    </>
  )
}
