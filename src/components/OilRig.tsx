import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#5a7a8a', 25, 70)
    scene.background = new THREE.Color('#6a8a9a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function OceanWaves() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = Math.sin(t * 0.8) * 0.15
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2a5a7a" roughness={0.15} metalness={0.4} />
    </mesh>
  )
}

function WaveDetails() {
  const count = 80
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const waves = useMemo(() => {
    const arr: {
      x: number
      z: number
      phase: number
      sx: number
      sz: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 60,
        phase: Math.random() * Math.PI * 2,
        sx: 2 + Math.random() * 4,
        sz: 1 + Math.random() * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const w = waves[i]
      dummy.position.set(w.x, -0.3 + Math.sin(t * 1.2 + w.phase) * 0.2, w.z)
      dummy.rotation.set(-Math.PI / 2, 0, w.phase)
      dummy.scale.set(w.sx, w.sz, 0.08)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#3a6a8a"
        transparent
        opacity={0.3}
        roughness={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

function PlatformLegs() {
  const legPositions: [number, number][] = [
    [-6, -4],
    [6, -4],
    [-6, 4],
    [6, 4],
  ]

  return (
    <>
      {legPositions.map(([x, z], i) => (
        <group key={i}>
          {/* Main leg cylinder */}
          <mesh position={[x, 3, z]}>
            <cylinderGeometry args={[0.6, 0.8, 12, 8]} />
            <meshStandardMaterial
              color="#887744"
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          {/* Cross bracing */}
          {i < 3 && (
            <mesh
              position={[
                (x + legPositions[(i + 1) % 4][0]) / 2,
                2,
                (z + legPositions[(i + 1) % 4][1]) / 2,
              ]}
              rotation={[0.3, 0, 0.5]}
            >
              <cylinderGeometry args={[0.08, 0.08, 10, 4]} />
              <meshStandardMaterial
                color="#666644"
                roughness={0.5}
                metalness={0.6}
              />
            </mesh>
          )}
        </group>
      ))}
    </>
  )
}

function MainPlatform() {
  return (
    <group position={[0, 9, 0]}>
      {/* Platform deck */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.5, 12]} />
        <meshStandardMaterial color="#888866" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Deck surface detail */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[15.5, 0.05, 11.5]} />
        <meshStandardMaterial color="#998877" roughness={0.7} />
      </mesh>
      {/* Safety railings */}
      {[
        [-8, 0.8, 0, 0.08, 1.2, 12],
        [8, 0.8, 0, 0.08, 1.2, 12],
        [0, 0.8, -6, 16, 1.2, 0.08],
        [0, 0.8, 6, 16, 1.2, 0.08],
      ].map((r, i) => (
        <mesh key={i} position={[r[0], r[1], r[2]]}>
          <boxGeometry args={[r[3], r[4], r[5]]} />
          <meshStandardMaterial
            color="#aaaa88"
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function DerrickTower() {
  const height = 14
  return (
    <group position={[0, 9.5, 0]}>
      {/* Four corner posts */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, height / 2, z]}>
          <boxGeometry args={[0.15, height, 0.15]} />
          <meshStandardMaterial
            color="#cc4444"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      ))}
      {/* Horizontal bracing */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = (i + 1) * 2
        return (
          <group key={i}>
            <mesh position={[0, y, -1]}>
              <boxGeometry args={[2, 0.08, 0.08]} />
              <meshStandardMaterial
                color="#cc4444"
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, y, 1]}>
              <boxGeometry args={[2, 0.08, 0.08]} />
              <meshStandardMaterial
                color="#cc4444"
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[-1, y, 0]}>
              <boxGeometry args={[0.08, 0.08, 2]} />
              <meshStandardMaterial
                color="#cc4444"
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[1, y, 0]}>
              <boxGeometry args={[0.08, 0.08, 2]} />
              <meshStandardMaterial
                color="#cc4444"
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
          </group>
        )
      })}
      {/* Crown block at top */}
      <mesh position={[0, height + 0.3, 0]}>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#aa3333" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  )
}

function Crane({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#dddd44" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.3, 5, 0.3]} />
        <meshStandardMaterial color="#dddd44" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Boom */}
      <mesh position={[3, 5, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[6, 0.2, 0.2]} />
        <meshStandardMaterial color="#dddd44" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Counter-boom */}
      <mesh position={[-1.5, 5.2, 0]}>
        <boxGeometry args={[3, 0.15, 0.15]} />
        <meshStandardMaterial color="#dddd44" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Counterweight */}
      <mesh position={[-2.8, 4.8, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
        <meshStandardMaterial color="#666666" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Helipad() {
  return (
    <group position={[-5, 9.6, -3]}>
      {/* Pad */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.15, 16]} />
        <meshStandardMaterial color="#555555" roughness={0.7} />
      </mesh>
      {/* H marking */}
      <mesh position={[-0.4, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.4, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Circle marking */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.08, 4, 24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function PlatformStructures() {
  return (
    <group position={[0, 9.5, 0]}>
      {/* Living quarters */}
      <mesh position={[5, 1.5, -3]}>
        <boxGeometry args={[4, 2.5, 3]} />
        <meshStandardMaterial color="#bbaa88" roughness={0.7} />
      </mesh>
      <mesh position={[5, 2.9, -3]}>
        <boxGeometry args={[4.2, 0.2, 3.2]} />
        <meshStandardMaterial color="#999888" roughness={0.6} />
      </mesh>
      {/* Windows on quarters */}
      {[-4.5, -3.5, -2.5].map((z, i) => (
        <mesh key={i} position={[3, 1.5, z]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial
            color="#aaddff"
            emissive="#66aadd"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {/* Processing equipment */}
      <mesh position={[4, 1.5, 3]}>
        <cylinderGeometry args={[0.8, 0.8, 3, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[5.5, 1, 3]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Flare stack */}
      <mesh position={[-6, 5, 3]}>
        <cylinderGeometry args={[0.1, 0.1, 10, 6]} />
        <meshStandardMaterial color="#777777" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Flare flame */}
      <mesh position={[-6, 10.5, 3]}>
        <coneGeometry args={[0.3, 1.2, 6]} />
        <meshStandardMaterial
          color="#ff6622"
          emissive="#ff4400"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[-6, 10.5, 3]}
        intensity={2}
        color="#ff6622"
        distance={8}
      />
    </group>
  )
}

function SeaBirds() {
  const count = 12
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const birds = useMemo(() => {
    const arr: {
      angle: number
      r: number
      y: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        r: 10 + Math.random() * 15,
        y: 15 + Math.random() * 8,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const b = birds[i]
      const a = b.angle + t * b.speed
      dummy.position.set(
        Math.cos(a) * b.r,
        b.y + Math.sin(t * 2 + b.phase) * 0.5,
        Math.sin(a) * b.r,
      )
      dummy.rotation.set(0, -a + Math.PI / 2, Math.sin(t * 4 + b.phase) * 0.3)
      dummy.scale.set(0.3, 0.05, 0.15)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#222222" />
    </instancedMesh>
  )
}

export default function OilRig() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={1.0} color="#ffe8cc" />
      <ambientLight intensity={0.2} color="#88aacc" />
      <hemisphereLight args={['#6a8a9a', '#2a5a7a', 0.3]} />

      <OceanWaves />
      <WaveDetails />
      <PlatformLegs />
      <MainPlatform />
      <DerrickTower />
      <PlatformStructures />
      <Helipad />

      <Crane position={[5, 9.5, 0]} rotation={0.5} />
      <Crane position={[-3, 9.5, 4]} rotation={-1.2} />

      <SeaBirds />
    </>
  )
}
