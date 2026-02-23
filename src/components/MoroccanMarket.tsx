import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#d4a878', 15, 50)
    scene.background = new THREE.Color('#c89060')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function MarketGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#c4a070" />
    </mesh>
  )
}

function Stall({
  position,
  color,
  awningColor,
}: {
  position: [number, number, number]
  color: string
  awningColor: string
}) {
  const goods = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      color: string
      type: string
    }[] = []
    for (let i = 0; i < 6; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 1.4,
          0.85 + Math.random() * 0.2,
          (Math.random() - 0.5) * 0.4,
        ],
        color: [
          '#e83030',
          '#e8a020',
          '#30a0e8',
          '#e86090',
          '#40c040',
          '#d060d0',
        ][i],
        type: Math.random() > 0.5 ? 'sphere' : 'box',
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Back wall */}
      <mesh position={[0, 1.2, -0.6]}>
        <boxGeometry args={[2, 2.4, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Counter */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8a6a40" />
      </mesh>
      {/* Legs */}
      {[
        [-0.9, 0],
        [0.9, 0],
        [-0.9, -0.4],
        [0.9, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 5]} />
          <meshStandardMaterial color="#6a4a20" />
        </mesh>
      ))}
      {/* Awning */}
      <mesh position={[0, 2.5, 0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[2.4, 0.05, 1.6]} />
        <meshStandardMaterial color={awningColor} side={THREE.DoubleSide} />
      </mesh>
      {/* Awning poles */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0.6]}>
          <cylinderGeometry args={[0.03, 0.03, 2, 5]} />
          <meshStandardMaterial color="#6a4a20" />
        </mesh>
      ))}
      {/* Goods on counter */}
      {goods.map((g, i) => (
        <mesh key={i} position={g.pos}>
          {g.type === 'sphere' ? (
            <sphereGeometry args={[0.08, 6, 5]} />
          ) : (
            <boxGeometry args={[0.12, 0.12, 0.12]} />
          )}
          <meshStandardMaterial color={g.color} />
        </mesh>
      ))}
    </group>
  )
}

function SpicePyramid({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.2, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Base bowl */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.06, 10]} />
        <meshStandardMaterial color="#a08060" />
      </mesh>
    </group>
  )
}

function HangingLantern({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.05
  })

  return (
    <group ref={ref} position={position}>
      {/* Chain */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
        <meshStandardMaterial color="#8a8a60" />
      </mesh>
      {/* Lantern body */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 6]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.06, 0]}>
        <coneGeometry args={[0.09, 0.06, 6]} />
        <meshStandardMaterial color="#aa8830" />
      </mesh>
      {/* Light glow */}
      <pointLight
        position={[0, -0.05, 0]}
        color={color}
        intensity={0.5}
        distance={3}
      />
    </group>
  )
}

function Archway({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation ?? 0, 0]}>
      {/* Pillars */}
      {[-1.2, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 0]}>
          <boxGeometry args={[0.3, 3, 0.4]} />
          <meshStandardMaterial color="#d4a878" />
        </mesh>
      ))}
      {/* Arch top */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[2.7, 0.3, 0.4]} />
        <meshStandardMaterial color="#d4a878" />
      </mesh>
      {/* Decorative top */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[2.2, 0.4, 0.3]} />
        <meshStandardMaterial color="#c49868" />
      </mesh>
    </group>
  )
}

function CarpetStack({ position }: { position: [number, number, number] }) {
  const carpets = useMemo(() => {
    const colors = ['#c03030', '#2060a0', '#a05020', '#206040', '#8030a0']
    return colors.map((color, i) => ({
      color,
      y: i * 0.06,
      width: 0.6 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <group position={position}>
      {carpets.map((c, i) => (
        <mesh key={i} position={[0, c.y, 0]}>
          <boxGeometry args={[c.width, 0.04, 0.9]} />
          <meshStandardMaterial color={c.color} />
        </mesh>
      ))}
    </group>
  )
}

function PotteryDisplay({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Large pot */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.25, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial color="#c06030" />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.15, 8]} />
        <meshStandardMaterial color="#c06030" />
      </mesh>
      {/* Small pots */}
      {[-0.3, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0.1]}>
          <cylinderGeometry args={[0.06, 0.08, 0.15, 6]} />
          <meshStandardMaterial color={i === 0 ? '#a04820' : '#3060a0'} />
        </mesh>
      ))}
    </group>
  )
}

function DustMotes() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 80
  const particles = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 15,
        y: 0.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 15,
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.5,
        p.y + Math.sin(t * 0.3 + p.phase) * 0.2,
        p.z + Math.cos(t * p.speed + p.phase) * 0.5,
      )
      dummy.scale.setScalar(0.015)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#ffe0b0" transparent opacity={0.5} />
    </instancedMesh>
  )
}

export default function MoroccanMarket() {
  const spiceColors = ['#d4a010', '#c04010', '#a06020', '#d08020', '#804010']

  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 10, 5]} intensity={0.9} color="#ffe0a0" />
      <ambientLight intensity={0.3} color="#e8c080" />

      <MarketGround />

      {/* Archways */}
      <Archway position={[0, 0, -5]} />
      <Archway position={[0, 0, 5]} />

      {/* Market stalls - left side */}
      <Stall position={[-3, 0, -2]} color="#d4a068" awningColor="#c03030" />
      <Stall position={[-3, 0, 1]} color="#c49058" awningColor="#2060a0" />
      <Stall position={[-3, 0, 4]} color="#d4a068" awningColor="#20a060" />

      {/* Market stalls - right side */}
      <Stall position={[3, 0, -3]} color="#c49058" awningColor="#a05020" />
      <Stall position={[3, 0, 0]} color="#d4a068" awningColor="#d06020" />
      <Stall position={[3, 0, 3]} color="#c49058" awningColor="#8030a0" />

      {/* Spice pyramids */}
      {spiceColors.map((color, i) => (
        <SpicePyramid
          key={i}
          position={[-2.5 + i * 0.5, 0.8, -2 + Math.floor(i / 3) * 3]}
          color={color}
        />
      ))}

      {/* Hanging lanterns */}
      <HangingLantern position={[-1, 3, -2]} color="#e8a030" />
      <HangingLantern position={[1, 2.8, -1]} color="#e83050" />
      <HangingLantern position={[0, 3.2, 1]} color="#30a0e8" />
      <HangingLantern position={[-1.5, 2.9, 3]} color="#e8c020" />
      <HangingLantern position={[1.5, 3.1, 2]} color="#e85030" />

      {/* Carpet stacks */}
      <CarpetStack position={[-2.5, 0, 1]} />
      <CarpetStack position={[2.5, 0, -1]} />

      {/* Pottery */}
      <PotteryDisplay position={[-1, 0, -3]} />
      <PotteryDisplay position={[1.5, 0, 4]} />

      <DustMotes />
    </>
  )
}
