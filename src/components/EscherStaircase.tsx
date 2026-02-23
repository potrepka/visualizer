import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8e0d0', 15, 40)
    scene.background = new THREE.Color('#e8e0d0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Single Step ---
function Step({
  position,
  rotation,
  width,
  depth,
  height,
  color,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

// --- Staircase Run ---
function StaircaseRun({
  position,
  rotation,
  steps,
  direction,
  color,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  steps: number
  direction: 'up' | 'down'
  color: string
}) {
  const stepData = useMemo(() => {
    const arr: { pos: [number, number, number] }[] = []
    for (let i = 0; i < steps; i++) {
      const yDir = direction === 'up' ? 1 : -1
      arr.push({
        pos: [0, i * 0.25 * yDir, i * 0.3],
      })
    }
    return arr
  }, [steps, direction])

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {stepData.map((s, i) => (
        <Step
          key={i}
          position={s.pos}
          width={1}
          depth={0.3}
          height={0.12}
          color={color}
        />
      ))}
      {/* Railing left */}
      {stepData.map((s, i) => (
        <mesh key={`rl${i}`} position={[0.55, s.pos[1] + 0.4, s.pos[2]]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
      {/* Railing right */}
      {stepData.map((s, i) => (
        <mesh key={`rr${i}`} position={[-0.55, s.pos[1] + 0.4, s.pos[2]]}>
          <boxGeometry args={[0.04, 0.8, 0.04]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
      {/* Handrail bars */}
      <mesh
        position={[0.55, stepData[steps - 1].pos[1] / 2 + 0.8, steps * 0.15]}
        rotation={[
          Math.atan2(steps * 0.25 * (direction === 'up' ? 1 : -1), steps * 0.3),
          0,
          0,
        ]}
      >
        <boxGeometry args={[0.05, 0.05, steps * 0.3 * 1.05]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh
        position={[-0.55, stepData[steps - 1].pos[1] / 2 + 0.8, steps * 0.15]}
        rotation={[
          Math.atan2(steps * 0.25 * (direction === 'up' ? 1 : -1), steps * 0.3),
          0,
          0,
        ]}
      >
        <boxGeometry args={[0.05, 0.05, steps * 0.3 * 1.05]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
    </group>
  )
}

// --- Platform ---
function Platform({
  position,
  rotation,
  size,
  color,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size: [number, number, number]
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  )
}

// --- Column/Pillar ---
function Pillar({
  position,
  height,
  color,
}: {
  position: [number, number, number]
  height: number
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.15, height, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
}

// --- Arch ---
function Arch({
  position,
  rotation,
  color,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh position={[-0.6, 1, 0]}>
        <boxGeometry args={[0.15, 2, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 1, 0]}>
        <boxGeometry args={[0.15, 2, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.08, 6, 12, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

// --- Impossible Structure (main composition) ---
function ImpossibleStructure() {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.08
  })

  const stoneLight = '#c8beb0'
  const stoneMid = '#b0a898'
  const stoneDark = '#989088'

  return (
    <group ref={groupRef}>
      {/* Central impossible square staircase loop */}
      {/* Front run going up-right */}
      <StaircaseRun
        position={[-2, 0, 2]}
        rotation={[0, 0, 0]}
        steps={8}
        direction="up"
        color={stoneLight}
      />
      {/* Right run going up-back */}
      <StaircaseRun
        position={[2, 2, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        steps={8}
        direction="up"
        color={stoneMid}
      />
      {/* Back run going up-left */}
      <StaircaseRun
        position={[2, 4, -2]}
        rotation={[0, Math.PI, 0]}
        steps={8}
        direction="up"
        color={stoneDark}
      />
      {/* Left run going "up" but visually connecting back to start (impossible!) */}
      <StaircaseRun
        position={[-2, 6, -2]}
        rotation={[0, Math.PI / 2, 0]}
        steps={8}
        direction="down"
        color={stoneLight}
      />

      {/* Corner platforms */}
      <Platform
        position={[-2, 0, 2]}
        size={[1.2, 0.15, 1.2]}
        color={stoneLight}
        rotation={[0, 0, 0]}
      />
      <Platform
        position={[2, 2, 2]}
        size={[1.2, 0.15, 1.2]}
        color={stoneMid}
        rotation={[0, 0, 0]}
      />
      <Platform
        position={[2, 4, -2]}
        size={[1.2, 0.15, 1.2]}
        color={stoneDark}
        rotation={[0, 0, 0]}
      />
      <Platform
        position={[-2, 4, -2]}
        size={[1.2, 0.15, 1.2]}
        color={stoneLight}
        rotation={[0, 0, 0]}
      />

      {/* Support pillars at corners */}
      <Pillar position={[-2.5, 0, 2.5]} height={0.5} color={stoneDark} />
      <Pillar position={[2.5, 0, 2.5]} height={2.5} color={stoneDark} />
      <Pillar position={[2.5, 0, -2.5]} height={4.5} color={stoneDark} />
      <Pillar position={[-2.5, 0, -2.5]} height={4.5} color={stoneDark} />

      {/* Arches on each face */}
      <Arch position={[0, 0, 2.5]} rotation={[0, 0, 0]} color={stoneMid} />
      <Arch
        position={[2.5, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color={stoneMid}
      />
      <Arch
        position={[0, 3.5, -2.5]}
        rotation={[0, Math.PI, 0]}
        color={stoneMid}
      />
      <Arch
        position={[-2.5, 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={stoneMid}
      />

      {/* Upper walkways (secondary staircases going sideways) */}
      <StaircaseRun
        position={[0, 2, 0]}
        rotation={[0, Math.PI / 4, 0]}
        steps={5}
        direction="up"
        color={stoneDark}
      />
      <StaircaseRun
        position={[0, 3.5, 0]}
        rotation={[0, (-Math.PI * 3) / 4, 0]}
        steps={5}
        direction="up"
        color={stoneLight}
      />

      {/* Decorative spheres at intersections */}
      {[
        [-2, 0.5, 2],
        [2, 2.5, 2],
        [2, 4.5, -2],
        [-2, 4.5, -2],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#d4c8b0"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#d8d0c4" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Main Scene ---
export default function EscherStaircase() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.4} color="#e8e0d0" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, 8, -5]}
        intensity={0.3}
        color="#ccccdd"
      />
      <pointLight
        position={[0, 3, 0]}
        intensity={0.3}
        color="#ffe8cc"
        distance={15}
      />
      <ImpossibleStructure />
    </>
  )
}
