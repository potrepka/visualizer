import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#020210')
    return () => {
      scene.background = null
    }
  }, [scene])
  return null
}

const STAR_COUNT = 600
const starDummy = new THREE.Object3D()

function StarField() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 50 + Math.random() * 30
      starDummy.position.set(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r,
      )
      starDummy.scale.setScalar(0.02 + Math.random() * 0.06)
      starDummy.updateMatrix()
      ref.current.setMatrixAt(i, starDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function DistantSun() {
  return (
    <mesh position={[30, 10, -40]}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshBasicMaterial color="#fff8e0" />
    </mesh>
  )
}

function ShipBody() {
  return (
    <group>
      {/* Main hull - elongated */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 2.5, 8]} />
        <meshStandardMaterial color="#607080" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial color="#506070" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Engine section */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.35, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#505a65" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -1.65, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#44aaff"
          emissive="#2288ff"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Bridge windows */}
      <mesh position={[0, 0.8, 0.16]}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#aaddff"
          emissive="#88bbee"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} />
      </mesh>
      {/* Side pods */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.35, -0.5, 0]}>
          <boxGeometry args={[0.12, 0.6, 0.12]} />
          <meshStandardMaterial
            color="#556670"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

function SolarSail({
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
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.5) * 0.02
    meshRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.015
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={rotation}>
        <planeGeometry args={[width, height, 8, 8]} />
        <meshStandardMaterial
          color="#f0e8d8"
          emissive="#ffd080"
          emissiveIntensity={0.15}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Support cables from center */}
      {[-width / 2, width / 2].map((x, i) => (
        <mesh
          key={i}
          position={[x * 0.5, 0, 0]}
          rotation={[0, 0, x > 0 ? -0.2 : 0.2]}
        >
          <cylinderGeometry args={[0.005, 0.005, height * 0.6, 4]} />
          <meshStandardMaterial color="#aaa" metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function SailMast({ angle, length }: { angle: number; length: number }) {
  return (
    <mesh
      position={[
        (Math.sin(angle) * length) / 2,
        0,
        (Math.cos(angle) * length) / 2,
      ]}
      rotation={[0, 0, Math.PI / 2 - 0.01]}
    >
      <cylinderGeometry args={[0.02, 0.02, length, 6]} />
      <meshStandardMaterial color="#778899" metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function SailArray() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
  })

  const sails = useMemo(
    () => [
      {
        pos: [4, 0, 0] as [number, number, number],
        rot: [0, 0, 0.1] as [number, number, number],
        w: 7,
        h: 10,
      },
      {
        pos: [-4, 0, 0] as [number, number, number],
        rot: [0, 0, -0.1] as [number, number, number],
        w: 7,
        h: 10,
      },
      {
        pos: [0, 0, 4] as [number, number, number],
        rot: [0.1, 0, 0] as [number, number, number],
        w: 7,
        h: 10,
      },
      {
        pos: [0, 0, -4] as [number, number, number],
        rot: [-0.1, 0, 0] as [number, number, number],
        w: 7,
        h: 10,
      },
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {sails.map((s, i) => (
        <SolarSail
          key={i}
          position={s.pos}
          rotation={s.rot}
          width={s.w}
          height={s.h}
        />
      ))}
      {/* Masts */}
      <SailMast angle={0} length={8} />
      <SailMast angle={Math.PI / 2} length={8} />
      <SailMast angle={Math.PI} length={8} />
      <SailMast angle={Math.PI * 1.5} length={8} />
    </group>
  )
}

function Nebula() {
  const positions = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: number
      color: string
    }[] = []
    for (let i = 0; i < 20; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 40,
          -40 - Math.random() * 30,
        ],
        scale: 3 + Math.random() * 8,
        color: ['#3322aa', '#552266', '#224488', '#442255'][
          Math.floor(Math.random() * 4)
        ],
      })
    }
    return arr
  }, [])

  return (
    <>
      {positions.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.scale, 8, 8]} />
          <meshBasicMaterial color={n.color} transparent opacity={0.08} />
        </mesh>
      ))}
    </>
  )
}

function ShipAssembly() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.08
    ref.current.position.y = Math.sin(t * 0.2) * 0.3
  })

  return (
    <group ref={ref}>
      <ShipBody />
      <SailArray />
    </group>
  )
}

export default function SolarSailShip() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[30, 10, -40]}
        intensity={1.5}
        color="#fffae0"
      />
      <ambientLight intensity={0.05} />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.3}
        color="#88bbff"
        distance={10}
      />

      <StarField />
      <DistantSun />
      <Nebula />
      <ShipAssembly />
    </>
  )
}
