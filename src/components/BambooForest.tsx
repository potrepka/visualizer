import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Single Bamboo Stalk ---
function BambooStalk({
  position,
  height,
  thickness,
}: {
  position: [number, number, number]
  height: number
  thickness: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const segments = useMemo(() => Math.floor(height / 0.6), [height])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(t * 0.3 + phase) * 0.015
    ref.current.rotation.z = Math.cos(t * 0.25 + phase) * 0.015
  })

  return (
    <group position={position} ref={ref}>
      {Array.from({ length: segments }, (_, i) => {
        const segHeight = 0.6
        const y = i * segHeight + segHeight / 2
        return (
          <group key={i}>
            {/* Segment cylinder */}
            <mesh position={[0, y, 0]}>
              <cylinderGeometry
                args={[thickness, thickness, segHeight - 0.03, 8]}
              />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#3a7a3a' : '#4a8a4a'}
                roughness={0.6}
              />
            </mesh>
            {/* Node ring */}
            <mesh position={[0, y + segHeight / 2 - 0.015, 0]}>
              <torusGeometry args={[thickness + 0.005, 0.01, 6, 12]} />
              <meshStandardMaterial color="#2a6a2a" roughness={0.5} />
            </mesh>
          </group>
        )
      })}
      {/* Small leaves at top */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5
        const leafY = height - 0.3 + Math.random() * 0.3
        return (
          <mesh
            key={`leaf-${i}`}
            position={[Math.cos(angle) * 0.15, leafY, Math.sin(angle) * 0.15]}
            rotation={[0.5, angle, 0.3]}
          >
            <planeGeometry args={[0.3, 0.08]} />
            <meshStandardMaterial
              color="#5aaa3a"
              side={THREE.DoubleSide}
              roughness={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Stone Path ---
function StonePath() {
  const stones = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) {
      const z = -7 + i * 1.1
      arr.push({
        pos: [Math.sin(i * 0.3) * 0.3, 0.02, z] as [number, number, number],
        scaleX: 0.4 + Math.random() * 0.2,
        scaleZ: 0.35 + Math.random() * 0.15,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {stones.map((s, i) => (
        <mesh
          key={i}
          position={s.pos}
          rotation={[-Math.PI / 2, 0, Math.random() * 0.3]}
        >
          <circleGeometry args={[0.25, 6]} />
          <meshStandardMaterial color="#808080" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// --- Small Shrine ---
function Shrine() {
  return (
    <group position={[3, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#8a8a80" roughness={0.85} />
      </mesh>
      {/* Pillars */}
      {[
        [-0.3, 0.5, 0.2],
        [0.3, 0.5, 0.2],
        [-0.3, 0.5, -0.2],
        [0.3, 0.5, -0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <meshStandardMaterial color="#aa3333" roughness={0.6} />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1, 0.06, 0.8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
      </mesh>
      {/* Ridge */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.15]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.7} />
      </mesh>
      {/* Offering box */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.2, 0.12, 0.15]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.75} />
      </mesh>
    </group>
  )
}

// --- Dappled Light Beams ---
function DappledLight() {
  const beams = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      x: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
      angle: (Math.random() - 0.5) * 0.3,
      scale: 0.2 + Math.random() * 0.4,
    }))
  }, [])

  return (
    <group>
      {beams.map((b, i) => (
        <mesh key={i} position={[b.x, 4, b.z]} rotation={[0, 0, b.angle]}>
          <cylinderGeometry args={[b.scale * 0.3, b.scale, 8, 6]} />
          <meshBasicMaterial
            color="#aacc88"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Mist particles ---
const MIST_COUNT = 60
const mistDummy = new THREE.Object3D()

function MistParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: MIST_COUNT }, () => ({
      x: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 18,
      y: 0.3 + Math.random() * 1.5,
      speed: 0.05 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 1.0,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < MIST_COUNT; i++) {
      const p = particles[i]
      mistDummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 1.5,
        p.y + Math.sin(t * 0.3 + p.phase) * 0.2,
        p.z + Math.cos(t * p.speed * 0.8 + p.phase) * 1.5,
      )
      mistDummy.scale.set(p.scale, 0.1, p.scale)
      mistDummy.rotation.y = t * 0.05 + p.phase
      mistDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, mistDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MIST_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#cceebb"
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#8aaa7a', 10, 35)
    scene.background = new THREE.Color('#9aba8a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function BambooForest() {
  const bambooStalks = useMemo(() => {
    const arr = []
    for (let i = 0; i < 80; i++) {
      const x = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 16
      // Leave clearing for the path
      if (Math.abs(x) < 0.8 && z > -8 && z < 8) continue
      // Leave clearing for shrine
      if (x > 2 && x < 4.5 && Math.abs(z) < 1.5) continue
      arr.push({
        pos: [x, 0, z] as [number, number, number],
        height: 4 + Math.random() * 4,
        thickness: 0.04 + Math.random() * 0.03,
      })
    }
    return arr
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[2, 10, 3]} color="#aaddaa" intensity={0.7} />
      <ambientLight color="#446644" intensity={0.35} />
      <hemisphereLight args={['#aaddaa', '#335533', 0.3]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3a5a2a" roughness={0.9} />
      </mesh>

      {bambooStalks.map((b, i) => (
        <BambooStalk
          key={i}
          position={b.pos}
          height={b.height}
          thickness={b.thickness}
        />
      ))}

      <StonePath />
      <Shrine />
      <DappledLight />
      <MistParticles />
    </>
  )
}
