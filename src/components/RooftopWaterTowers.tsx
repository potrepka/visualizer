import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8a860', 30, 80)
    scene.background = new THREE.Color('#e89050')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RooftopFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[25, 25]} />
      <meshStandardMaterial color="#707070" />
    </mesh>
  )
}

function WaterTower({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale ?? 1
  return (
    <group position={position} scale={s}>
      {/* Tank */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 2.2, 12]} />
        <meshStandardMaterial color="#8a6a40" />
      </mesh>
      {/* Tank bands */}
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={i} position={[0, 4 + y, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.08, 12]} />
          <meshStandardMaterial color="#5a4a30" />
        </mesh>
      ))}
      {/* Conical roof */}
      <mesh position={[0, 5.3, 0]}>
        <coneGeometry args={[1.3, 0.8, 12]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Support legs */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.8, 1.4, Math.sin(angle) * 0.8]}
        >
          <cylinderGeometry args={[0.08, 0.1, 2.8, 6]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* Cross braces */}
      {[0, Math.PI / 2].map((angle, i) => (
        <mesh key={i} position={[0, 1.5, 0]} rotation={[0, angle, Math.PI / 4]}>
          <boxGeometry args={[0.05, 2.2, 0.05]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* Platform at base of tank */}
      <mesh position={[0, 2.85, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 12]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
    </group>
  )
}

function ACUnit({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation ?? 0, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1, 0.6, 0.7]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>
      {/* Fan grille */}
      <mesh position={[0, 0.3, 0.36]}>
        <boxGeometry args={[0.8, 0.4, 0.02]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Feet */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.03, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.6]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
      ))}
    </group>
  )
}

function PipeRun({
  start,
  end,
  radius,
}: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
}) {
  const r = radius ?? 0.05
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const midX = (start[0] + end[0]) / 2
  const midY = (start[1] + end[1]) / 2
  const midZ = (start[2] + end[2]) / 2

  const rotation = useMemo(() => {
    const dir = new THREE.Vector3(dx, dy, dz).normalize()
    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    const euler = new THREE.Euler().setFromQuaternion(quat)
    return [euler.x, euler.y, euler.z] as [number, number, number]
  }, [dx, dy, dz])

  return (
    <mesh position={[midX, midY, midZ]} rotation={rotation}>
      <cylinderGeometry args={[r, r, length, 6]} />
      <meshStandardMaterial color="#6a6a6a" />
    </mesh>
  )
}

function SkyscraperSilhouette({
  position,
  width,
  height,
}: {
  position: [number, number, number]
  width: number
  height: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width * 0.8]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>
      {/* Windows glow */}
      {Array.from({ length: Math.floor(height / 1.5) }, (_, r) =>
        Array.from({ length: Math.floor(width / 1) }, (_, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[
              (c - Math.floor(width / 1) / 2 + 0.5) * 0.9,
              1 + r * 1.4,
              width * 0.4 + 0.01,
            ]}
          >
            <boxGeometry args={[0.4, 0.6, 0.02]} />
            <meshStandardMaterial
              color="#e8c870"
              emissive="#e8c870"
              emissiveIntensity={Math.random() > 0.3 ? 0.4 : 0}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

function Vent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 8]} />
        <meshStandardMaterial color="#7a7a7a" />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.35, 0.15, 8]} />
        <meshStandardMaterial color="#6a6a6a" />
      </mesh>
    </group>
  )
}

function Antenna({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 3, 5]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Crossbars */}
      {[1.5, 2.2, 2.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4 - i * 0.1, 4]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
      ))}
      {/* Light */}
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.04, 6, 5]} />
        <meshStandardMaterial
          color="#e83030"
          emissive="#e83030"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

function SteamVent() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 30
  const particles = useMemo(() => {
    const arr: { x: number; z: number; speed: number; phase: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      const life = ((t * p.speed + p.phase) % 3) / 3
      dummy.position.set(
        -4 + p.x + Math.sin(t + p.phase) * 0.2 * life,
        0.8 + life * 2,
        2 + p.z,
      )
      dummy.scale.setScalar(0.06 + life * 0.15)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 5, 4]} />
      <meshStandardMaterial color="#c0c0c0" transparent opacity={0.25} />
    </instancedMesh>
  )
}

function RooftopAccess() {
  return (
    <group position={[3, 0, -3]}>
      {/* Staircase housing */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 2.4, 2.5]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.9, 1.26]}>
        <boxGeometry args={[0.8, 1.6, 0.05]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
    </group>
  )
}

export default function RooftopWaterTowers() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[-5, 8, 5]} intensity={1.3} color="#ffc060" />
      <ambientLight intensity={0.25} color="#e8a050" />
      <hemisphereLight args={['#e89050', '#505060', 0.3]} />

      <RooftopFloor />

      {/* Water towers */}
      <WaterTower position={[-5, 0, -5]} scale={1} />
      <WaterTower position={[5, 0, -3]} scale={0.85} />
      <WaterTower position={[-2, 0, 5]} scale={0.9} />

      {/* AC units */}
      <ACUnit position={[-3, 0, 0]} />
      <ACUnit position={[-1, 0, 0.5]} rotation={0.3} />
      <ACUnit position={[2, 0, 3]} rotation={-0.5} />
      <ACUnit position={[6, 0, 4]} rotation={Math.PI / 2} />

      {/* Pipes */}
      <PipeRun start={[-3, 0.6, -1]} end={[-5, 2.8, -5]} radius={0.06} />
      <PipeRun start={[2, 0.6, 3]} end={[-2, 2.8, 5]} radius={0.06} />
      <PipeRun start={[-3, 0.3, 0]} end={[2, 0.3, 3]} radius={0.04} />

      {/* Vents */}
      <Vent position={[0, 0, -2]} />
      <Vent position={[4, 0, 1]} />
      <Vent position={[-6, 0, 3]} />

      {/* Rooftop access */}
      <RooftopAccess />

      {/* Antenna */}
      <Antenna position={[3, 2.4, -3]} />

      {/* Background skyline */}
      <SkyscraperSilhouette position={[-15, -5, -25]} width={4} height={30} />
      <SkyscraperSilhouette position={[-8, -5, -28]} width={5} height={35} />
      <SkyscraperSilhouette position={[0, -5, -30]} width={6} height={40} />
      <SkyscraperSilhouette position={[10, -5, -27]} width={4.5} height={32} />
      <SkyscraperSilhouette position={[18, -5, -25]} width={3.5} height={28} />
      <SkyscraperSilhouette position={[25, -5, -30]} width={5} height={36} />

      {/* Steam */}
      <SteamVent />
    </>
  )
}
