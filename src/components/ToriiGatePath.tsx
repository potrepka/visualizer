import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a4a2a', 15, 45)
    scene.background = new THREE.Color('#3a5a3a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function ForestGround() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 30, 30)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, Math.sin(x * 0.3) * 0.2 + Math.cos(y * 0.2) * 0.15)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial color="#2a4a1a" />
    </mesh>
  )
}

function GravelPath() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[2.5, 30]} />
      <meshStandardMaterial color="#b0a890" />
    </mesh>
  )
}

function ToriiGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-1.2, 1.8, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#c03020" />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1.2, 1.8, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 3.6, 8]} />
        <meshStandardMaterial color="#c03020" />
      </mesh>
      {/* Top lintel (kasagi) */}
      <mesh position={[0, 3.7, 0]}>
        <boxGeometry args={[3.2, 0.18, 0.25]} />
        <meshStandardMaterial color="#c03020" />
      </mesh>
      {/* Top lintel ends (upturned) */}
      {[-1.55, 1.55].map((x, i) => (
        <mesh
          key={i}
          position={[x, 3.8, 0]}
          rotation={[0, 0, x > 0 ? -0.15 : 0.15]}
        >
          <boxGeometry args={[0.3, 0.15, 0.25]} />
          <meshStandardMaterial color="#c03020" />
        </mesh>
      ))}
      {/* Lower lintel (nuki) */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[2.6, 0.12, 0.18]} />
        <meshStandardMaterial color="#c03020" />
      </mesh>
      {/* Center name plate (gakuzuka) */}
      <mesh position={[0, 3.35, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Pillar bases */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      ))}
    </group>
  )
}

function StoneLantern({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale ?? 1
  return (
    <group position={position} scale={s}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Post */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
        <meshStandardMaterial color="#909090" />
      </mesh>
      {/* Firebox */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.35, 0.3, 0.35]} />
        <meshStandardMaterial color="#787878" />
      </mesh>
      {/* Window openings (lighter color to simulate light) */}
      {[
        [0, 0, 1],
        [0, 0, -1],
        [1, 0, 0],
        [-1, 0, 0],
      ].map(([x, , z], i) => (
        <mesh key={i} position={[x * 0.18, 1.1, z * 0.18]}>
          <boxGeometry
            args={[x !== 0 ? 0.02 : 0.12, 0.15, z !== 0 ? 0.02 : 0.12]}
          />
          <meshStandardMaterial
            color="#e8d880"
            emissive="#e8d880"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Roof */}
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.3, 0.35, 4]} />
        <meshStandardMaterial color="#686868" />
      </mesh>
      {/* Finial */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.05, 6, 5]} />
        <meshStandardMaterial color="#707070" />
      </mesh>
    </group>
  )
}

function ForestTree({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.18, height * 0.6, 6]} />
        <meshStandardMaterial color="#4a3520" />
      </mesh>
      {/* Foliage layers */}
      {[0.5, 0.7, 0.85].map((h, i) => (
        <mesh key={i} position={[0, height * h, 0]}>
          <sphereGeometry args={[0.8 - i * 0.15, 7, 5]} />
          <meshStandardMaterial color={i === 0 ? '#1a4a1a' : '#2a5a2a'} />
        </mesh>
      ))}
    </group>
  )
}

function Bamboo({ position }: { position: [number, number, number] }) {
  const stalks = useMemo(() => {
    const arr: { x: number; z: number; h: number }[] = []
    for (let i = 0; i < 4; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4,
        h: 3 + Math.random() * 2,
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {stalks.map((s, i) => (
        <group key={i}>
          <mesh position={[s.x, s.h / 2, s.z]}>
            <cylinderGeometry args={[0.04, 0.05, s.h, 6]} />
            <meshStandardMaterial color="#4a8a3a" />
          </mesh>
          {/* Nodes */}
          {Array.from({ length: Math.floor(s.h / 0.8) }, (_, j) => (
            <mesh key={j} position={[s.x, 0.8 + j * 0.8, s.z]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 6]} />
              <meshStandardMaterial color="#5a9a4a" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function FallingLeaves() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 40
  const leaves = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      drift: number
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 15,
        y: Math.random() * 6,
        z: (Math.random() - 0.5) * 15,
        speed: 0.2 + Math.random() * 0.3,
        drift: 0.5 + Math.random() * 1,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const l = leaves[i]
      const y = (((l.y - t * l.speed) % 6) + 6) % 6
      dummy.position.set(
        l.x + Math.sin(t + l.phase) * l.drift,
        y,
        l.z + Math.cos(t * 0.7 + l.phase) * l.drift * 0.5,
      )
      dummy.rotation.set(t + l.phase, t * 0.5, 0)
      dummy.scale.setScalar(0.03)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 0.6]} />
      <meshStandardMaterial color="#c08030" side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function MossyRock({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale ?? 1}>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.3, 6, 5]} />
        <meshStandardMaterial color="#5a6a5a" />
      </mesh>
      {/* Moss patch */}
      <mesh position={[0.05, 0.3, 0.05]}>
        <sphereGeometry args={[0.15, 5, 4]} />
        <meshStandardMaterial color="#3a6a2a" />
      </mesh>
    </group>
  )
}

export default function ToriiGatePath() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} intensity={0.7} color="#e0d8b0" />
      <ambientLight intensity={0.25} color="#6a8a6a" />
      <hemisphereLight args={['#8aaa7a', '#2a3a1a', 0.3]} />

      <ForestGround />
      <GravelPath />

      {/* Torii gates along the path */}
      {Array.from({ length: 8 }, (_, i) => (
        <ToriiGate key={i} position={[0, 0, -12 + i * 3]} />
      ))}

      {/* Stone lanterns */}
      <StoneLantern position={[-1.8, 0, -13]} />
      <StoneLantern position={[1.8, 0, -13]} />
      <StoneLantern position={[-2, 0, 0]} scale={0.8} />
      <StoneLantern position={[2, 0, 5]} scale={0.9} />

      {/* Forest trees */}
      {[
        [-5, 0, -8],
        [6, 0, -4],
        [-6, 0, 3],
        [5, 0, 7],
        [-7, 0, -12],
        [7, 0, 0],
        [-4, 0, 10],
        [8, 0, -10],
        [-8, 0, 6],
        [4, 0, -14],
      ].map(([x, y, z], i) => (
        <ForestTree
          key={i}
          position={[x, y, z]}
          height={4 + Math.sin(i * 1.7) * 1.5}
        />
      ))}

      {/* Bamboo clusters */}
      <Bamboo position={[-3, 0, -5]} />
      <Bamboo position={[3.5, 0, 2]} />
      <Bamboo position={[-4, 0, 8]} />

      {/* Mossy rocks */}
      <MossyRock position={[-1.5, 0, -6]} scale={1.2} />
      <MossyRock position={[1.8, 0, 3]} />
      <MossyRock position={[-2, 0, 8]} scale={0.8} />
      <MossyRock position={[1.5, 0, -10]} scale={1.5} />

      <FallingLeaves />
    </>
  )
}
