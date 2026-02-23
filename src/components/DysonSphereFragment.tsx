import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#020206')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StarCore() {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 0.5) * 0.05
    ref.current.scale.setScalar(pulse)
    glowRef.current.scale.setScalar(pulse * 1.3)
  })

  return (
    <group>
      {/* Star core */}
      <mesh ref={ref}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ffdd44" />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#ffaa22" transparent opacity={0.3} />
      </mesh>
      {/* Corona */}
      <mesh>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.08} />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        color="#ffcc44"
        intensity={50}
        distance={80}
      />
    </group>
  )
}

function DysonPanel({
  position,
  rotation,
  width,
  height,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  width: number
  height: number
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main panel surface */}
      <mesh>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial
          color="#1a2a3a"
          metalness={0.8}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Grid pattern on surface */}
      {Array.from({ length: Math.floor(width / 2) }).map((_, i) => (
        <mesh key={`vl-${i}`} position={[-width / 2 + (i + 1) * 2, 0, 0.08]}>
          <boxGeometry args={[0.05, height, 0.02]} />
          <meshStandardMaterial
            color="#2a3a4a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(height / 2) }).map((_, i) => (
        <mesh key={`hl-${i}`} position={[0, -height / 2 + (i + 1) * 2, 0.08]}>
          <boxGeometry args={[width, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#2a3a4a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Energy collector nodes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`ec-${i}`} position={[(i - 1) * (width / 3), 0, 0.1]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial
            color="#44aaff"
            emissive="#2288dd"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

function EnergyConduit({
  start,
  end,
}: {
  start: THREE.Vector3
  end: THREE.Vector3
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const dir = end.clone().sub(start)
  const len = dir.length()
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())

  useFrame(({ clock }) => {
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.5
  })

  return (
    <mesh ref={ref} position={[mid.x, mid.y, mid.z]} quaternion={quat}>
      <cylinderGeometry args={[0.08, 0.08, len, 6]} />
      <meshStandardMaterial
        color="#44aaff"
        emissive="#2288dd"
        emissiveIntensity={1.5}
      />
    </mesh>
  )
}

function FragmentStructure() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.005
  })

  const panels = useMemo(() => {
    const arr = []
    const arcStart = -0.4
    const arcEnd = 0.6
    const arcSteps = 6
    const heightSteps = 4
    const radius = 12

    for (let h = 0; h < heightSteps; h++) {
      for (let a = 0; a < arcSteps; a++) {
        const angle = arcStart + (a / arcSteps) * (arcEnd - arcStart)
        const y = (h - heightSteps / 2) * 5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        arr.push({
          position: [x, y, z] as [number, number, number],
          rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
          width: 4 + Math.random(),
          height: 4 + Math.random(),
        })
      }
    }
    return arr
  }, [])

  const conduits = useMemo(() => {
    const arr = []
    for (let i = 0; i < panels.length - 1; i++) {
      if (Math.random() > 0.4) {
        arr.push({
          start: new THREE.Vector3(...panels[i].position),
          end: new THREE.Vector3(...panels[i + 1].position),
        })
      }
    }
    return arr
  }, [panels])

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <DysonPanel key={i} {...p} />
      ))}
      {conduits.map((c, i) => (
        <EnergyConduit key={`c-${i}`} start={c.start} end={c.end} />
      ))}
    </group>
  )
}

const STAR_COUNT = 400
const starDummy = new THREE.Object3D()

function Stars() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 80 + Math.random() * 40
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.03 + Math.random() * 0.07,
      })
    }
    return arr
  }, [])

  useFrame(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const p = positions[i]
      starDummy.position.set(p.x, p.y, p.z)
      starDummy.scale.setScalar(p.scale)
      starDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, starDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function EnergyBeams() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      if (mat) {
        mat.opacity = 0.15 + Math.sin(t * 2 + i) * 0.1
      }
    })
  })

  return (
    <group ref={groupRef}>
      {[0, 0.3, -0.2].map((angle, i) => {
        const x = Math.cos(angle) * 12
        const z = Math.sin(angle) * 12
        return (
          <mesh
            key={i}
            position={[x / 2, 0, z / 2]}
            rotation={[0, 0, Math.PI / 2 - angle]}
          >
            <cylinderGeometry args={[0.15, 0.5, 12, 8]} />
            <meshStandardMaterial
              color="#ffdd44"
              emissive="#ffaa22"
              emissiveIntensity={3}
              transparent
              opacity={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function DysonSphereFragment() {
  return (
    <>
      <SceneSetup />

      <ambientLight intensity={0.05} />

      <Stars />
      <StarCore />
      <FragmentStructure />
      <EnergyBeams />
    </>
  )
}
