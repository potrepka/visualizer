import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8d0d8', 20, 60)
    scene.background = new THREE.Color('#d8c0cc')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CherryTree({
  position,
  height = 5,
  spread = 3,
}: {
  position: [number, number, number]
  height?: number
  spread?: number
}) {
  const blossomRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    blossomRef.current.rotation.y = Math.sin(t * 0.2 + position[0]) * 0.015
  })

  const blossomClusters = useMemo(() => {
    const arr: { pos: [number, number, number]; r: number; color: string }[] =
      []
    const colors = ['#f8a0b8', '#f0889a', '#ffc0d0', '#e890a8', '#f8b0c0']
    for (let i = 0; i < 8; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.5
      const r = spread * (0.5 + Math.random() * 0.5)
      arr.push({
        pos: [
          Math.cos(theta) * Math.sin(phi) * r,
          Math.cos(phi) * r * 0.5 + spread * 0.2,
          Math.sin(theta) * Math.sin(phi) * r,
        ],
        r: 0.5 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [spread])

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.2, height * 0.6, 6]} />
        <meshStandardMaterial color="#4a2a18" roughness={0.85} />
      </mesh>
      {/* Main branches */}
      {[0.6, -0.5, 0.3].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle + i) * 0.5,
            height * (0.5 + i * 0.1),
            Math.cos(angle + i) * 0.3,
          ]}
          rotation={[0.3 * (i - 1), 0, angle]}
        >
          <cylinderGeometry args={[0.04, 0.08, height * 0.3, 5]} />
          <meshStandardMaterial color="#4a2a18" roughness={0.85} />
        </mesh>
      ))}
      {/* Blossom clusters */}
      <group ref={blossomRef} position={[0, height * 0.6, 0]}>
        {blossomClusters.map((c, i) => (
          <mesh key={i} position={c.pos}>
            <sphereGeometry args={[c.r, 7, 7]} />
            <meshStandardMaterial color={c.color} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function StonePath() {
  const stones = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
      rot: number
    }[] = []
    for (let z = -15; z <= 15; z += 0.8) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 1.5,
          0.015,
          z + (Math.random() - 0.5) * 0.3,
        ],
        scale: [0.3 + Math.random() * 0.4, 0.02, 0.2 + Math.random() * 0.3],
        rot: Math.random() * Math.PI,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Base path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[3, 32]} />
        <meshStandardMaterial color="#a09080" roughness={0.9} />
      </mesh>
      {/* Individual stones */}
      {stones.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[0, s.rot, 0]} scale={s.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#b0a898" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

const PETAL_COUNT = 300
const petalDummy = new THREE.Object3D()

function FallingPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const petals = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      drift: number
      phase: number
      rotSpeed: number
    }[] = []
    for (let i = 0; i < PETAL_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 12,
        z: (Math.random() - 0.5) * 30,
        speed: 0.3 + Math.random() * 0.5,
        drift: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: 1 + Math.random() * 3,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const colors = [
      new THREE.Color('#f8a0b8'),
      new THREE.Color('#ffc0d0'),
      new THREE.Color('#f0889a'),
    ]

    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = petals[i]
      const y = (((p.y - t * p.speed) % 12) + 12) % 12
      const x = p.x + Math.sin(t * 0.4 + p.phase) * p.drift
      const z = p.z + Math.cos(t * 0.3 + p.phase) * p.drift * 0.5

      petalDummy.position.set(x, y, z)
      petalDummy.rotation.set(
        t * p.rotSpeed * 0.5,
        t * p.rotSpeed * 0.3,
        t * p.rotSpeed * 0.7 + p.phase,
      )
      petalDummy.scale.setScalar(0.6 + Math.random() * 0.4)
      petalDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, petalDummy.matrix)
      meshRef.current.setColorAt(i, colors[i % colors.length])
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      <boxGeometry args={[0.06, 0.005, 0.04]} />
      <meshStandardMaterial side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.24, 6]} />
        <meshStandardMaterial color="#8a8478" roughness={0.85} />
      </mesh>
      {/* Post */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
        <meshStandardMaterial color="#8a8478" roughness={0.85} />
      </mesh>
      {/* Chamber */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#9a9488" roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.4, 0.35, 4]} />
        <meshStandardMaterial color="#7a7468" roughness={0.85} />
      </mesh>
      {/* Top finial */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#8a8478" roughness={0.85} />
      </mesh>
      <pointLight
        position={[0, 1.2, 0]}
        color="#ffe8c0"
        intensity={0.5}
        distance={5}
      />
    </group>
  )
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#5a7a3a" />
      </mesh>
      {/* Moss patches near trees */}
      {[-5, 5, -4, 6].map((x, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.005, (i - 2) * 4]}
        >
          <circleGeometry args={[1 + Math.random(), 8]} />
          <meshStandardMaterial color="#4a6a2a" />
        </mesh>
      ))}
    </group>
  )
}

function SmallBridge() {
  return (
    <group position={[0, 0, 10]} rotation={[0, Math.PI / 2, 0]}>
      {/* Deck */}
      <mesh position={[0, 0.4, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#6a4a28" roughness={0.8} />
      </mesh>
      {/* Railings */}
      {[-0.7, 0.7].map((z, i) => (
        <group key={i}>
          <mesh position={[0, 0.7, z]}>
            <boxGeometry args={[3, 0.06, 0.06]} />
            <meshStandardMaterial color="#5a3a18" roughness={0.8} />
          </mesh>
          {[-1, 0, 1].map((x, j) => (
            <mesh key={j} position={[x, 0.55, z]}>
              <cylinderGeometry args={[0.025, 0.025, 0.3, 6]} />
              <meshStandardMaterial color="#5a3a18" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function CherryBlossomPath() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 3]} intensity={0.9} color="#ffe8e0" />
      <ambientLight intensity={0.4} color="#e0c8d0" />
      <hemisphereLight args={['#e8d0d8', '#5a7a3a', 0.3]} />

      <Ground />
      <StonePath />

      {/* Cherry trees - left side */}
      <CherryTree position={[-4, 0, -12]} height={5} spread={3} />
      <CherryTree position={[-5, 0, -5]} height={6} spread={3.5} />
      <CherryTree position={[-4.5, 0, 2]} height={5.5} spread={3} />
      <CherryTree position={[-5, 0, 9]} height={5} spread={2.8} />

      {/* Cherry trees - right side */}
      <CherryTree position={[4.5, 0, -10]} height={5.5} spread={3.2} />
      <CherryTree position={[5, 0, -3]} height={6} spread={3.5} />
      <CherryTree position={[4, 0, 4]} height={5} spread={3} />
      <CherryTree position={[5, 0, 11]} height={5.5} spread={3} />

      {/* Stone lanterns along path */}
      <StoneLantern position={[-2, 0, -8]} />
      <StoneLantern position={[2, 0, -1]} />
      <StoneLantern position={[-2, 0, 6]} />

      {/* Small bridge */}
      <SmallBridge />

      {/* Falling petals */}
      <FallingPetals />
    </>
  )
}
