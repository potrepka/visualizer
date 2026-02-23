import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8dcc8', 15, 35)
    scene.background = new THREE.Color('#d4c8b0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Track (circular with figure-8) ---
function TrackPath() {
  const lineRef = useRef<THREE.Line>(null!)

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 200
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2
      const pos = getTrackPosition(t)
      points.push(new THREE.Vector3(pos.x, pos.y, pos.z))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#555555' }),
    [],
  )

  return (
    <group>
      {/* Rail lines */}
      <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />
      {/* Ties */}
      <TrackTies />
    </group>
  )
}

function getTrackPosition(t: number): { x: number; y: number; z: number } {
  const s = 4
  return {
    x: s * Math.sin(t),
    y: 0.05 + Math.sin(t * 2) * 0.15,
    z: s * Math.sin(t) * Math.cos(t),
  }
}

function getTrackDirection(t: number): THREE.Vector3 {
  const dt = 0.001
  const p1 = getTrackPosition(t)
  const p2 = getTrackPosition(t + dt)
  return new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize()
}

// --- Track ties ---
function TrackTies() {
  const ties = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = []
    const count = 80
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2
      const pos = getTrackPosition(t)
      const dir = getTrackDirection(t)
      const angle = Math.atan2(dir.x, dir.z)
      arr.push({ pos: [pos.x, pos.y - 0.02, pos.z], rot: angle })
    }
    return arr
  }, [])

  return (
    <group>
      {ties.map((tie, i) => (
        <mesh key={i} position={tie.pos} rotation={[0, tie.rot, 0]}>
          <boxGeometry args={[0.25, 0.02, 0.04]} />
          <meshStandardMaterial color="#6b4226" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// --- Train ---
function Train() {
  const groupRef = useRef<THREE.Group>(null!)
  const progressRef = useRef(0)

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4) % (Math.PI * 2)
    const t = progressRef.current
    const pos = getTrackPosition(t)
    const dir = getTrackDirection(t)
    const angle = Math.atan2(dir.x, dir.z)

    groupRef.current.position.set(pos.x, pos.y + 0.08, pos.z)
    groupRef.current.rotation.y = angle
  })

  return (
    <group ref={groupRef}>
      {/* Locomotive */}
      <Locomotive />
      {/* Cars */}
      <TrainCar offset={-0.45} color="#cc3333" />
      <TrainCar offset={-0.85} color="#3366cc" />
      <TrainCar offset={-1.25} color="#33aa55" />
    </group>
  )
}

function Locomotive() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.3]} />
        <meshStandardMaterial color="#222222" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Boiler */}
      <mesh position={[0, 0.1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Smokestack */}
      <mesh position={[0, 0.16, 0.12]}>
        <cylinderGeometry args={[0.02, 0.03, 0.06, 6]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 0.1, -0.1]}>
        <boxGeometry args={[0.14, 0.1, 0.1]} />
        <meshStandardMaterial color="#cc2222" />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 0.1, 0.18]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial
          color="#ffff88"
          emissive="#ffcc00"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Wheels */}
      {[
        [-0.08, 0.08],
        [-0.08, -0.05],
        [0.08, 0.08],
        [0.08, -0.05],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.01, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial color="#555555" metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function TrainCar({ offset, color }: { offset: number; color: string }) {
  return (
    <group position={[0, 0, offset]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wheels */}
      {[-0.07, 0.07].map((x, i) => (
        <mesh key={i} position={[x, -0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 6]} />
          <meshStandardMaterial color="#555555" metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// --- Tiny building ---
function TinyBuilding({
  position,
  width,
  height,
  depth,
  color,
  roofColor,
}: {
  position: [number, number, number]
  width: number
  height: number
  depth: number
  color: string
  roofColor: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.04, 0.03, depth + 0.04]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      {/* Roof peak */}
      <mesh position={[0, height + 0.12, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[Math.max(width, depth) * 0.6, 0.12, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
    </group>
  )
}

// --- Model tree ---
function ModelTree({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale || 1
  return (
    <group position={position} scale={[s, s, s]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.2, 5]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#2d7a1e" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Mountain / hill ---
function Mountain({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale || 1
  return (
    <group position={position} scale={[s, s, s]}>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.8, 1, 8]} />
        <meshStandardMaterial color="#6a7a5a" roughness={0.9} />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.3, 0.25, 8]} />
        <meshStandardMaterial color="#f0f5ff" />
      </mesh>
    </group>
  )
}

// --- Tunnel ---
function TrainTunnel({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Tunnel arch */}
      <mesh>
        <torusGeometry args={[0.2, 0.08, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.8} />
      </mesh>
      {/* Tunnel walls */}
      <mesh position={[-0.2, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, 0.15]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.16, 0.15]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Crossing gate ---
function CrossingGate({ position }: { position: [number, number, number] }) {
  const armRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Gate goes up and down periodically
    armRef.current.rotation.z = Math.sin(t * 0.5) > 0 ? 0 : -Math.PI / 3
  })

  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
        <meshStandardMaterial color="#333333" metalness={0.5} />
      </mesh>
      {/* Arm */}
      <mesh ref={armRef} position={[0.12, 0.24, 0]}>
        <boxGeometry args={[0.25, 0.015, 0.01]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>
      {/* Light */}
      <mesh position={[0, 0.26, 0]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  )
}

// --- Table surface ---
function TableSurface() {
  return (
    <group>
      {/* Grass mat / landscape base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#5a8a3a" roughness={0.9} />
      </mesh>
      {/* Table */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[12.5, 0.1, 10.5]} />
        <meshStandardMaterial color="#8b6d4a" roughness={0.7} />
      </mesh>
      {/* Table legs */}
      {[
        [-5.5, -1, -4.5],
        [5.5, -1, -4.5],
        [-5.5, -1, 4.5],
        [5.5, -1, 4.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.3, 1.6, 0.3]} />
          <meshStandardMaterial color="#6b4226" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// --- Main Scene ---
export default function MiniatureTrainSet() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.5} color="#ffeedd" />
      <directionalLight position={[8, 12, 6]} intensity={1} color="#fff8ee" />
      <directionalLight
        position={[-5, 6, -3]}
        intensity={0.3}
        color="#aaccee"
      />

      <TableSurface />
      <TrackPath />
      <Train />

      {/* Buildings */}
      <TinyBuilding
        position={[-2, 0, -2]}
        width={0.4}
        height={0.3}
        depth={0.3}
        color="#cc8844"
        roofColor="#884422"
      />
      <TinyBuilding
        position={[-1.2, 0, -2.3]}
        width={0.3}
        height={0.25}
        depth={0.25}
        color="#ddcc88"
        roofColor="#776633"
      />
      <TinyBuilding
        position={[-2.8, 0, -1.5]}
        width={0.5}
        height={0.35}
        depth={0.4}
        color="#aabb88"
        roofColor="#667744"
      />
      <TinyBuilding
        position={[3, 0, 2]}
        width={0.35}
        height={0.28}
        depth={0.3}
        color="#8899bb"
        roofColor="#556688"
      />

      {/* Trees */}
      <ModelTree position={[1, 0, 2.5]} />
      <ModelTree position={[-3.5, 0, 1]} scale={0.8} />
      <ModelTree position={[4, 0, -1]} scale={1.2} />
      <ModelTree position={[-1, 0, 3]} />
      <ModelTree position={[2.5, 0, -2.5]} scale={0.9} />
      <ModelTree position={[-4, 0, -2]} scale={0.7} />

      {/* Mountains */}
      <Mountain position={[-4, 0, -3]} scale={1.5} />
      <Mountain position={[4.5, 0, -3.5]} scale={1.2} />

      {/* Tunnel */}
      <TrainTunnel position={[-3.5, 0.05, -2.8]} rotation={[0, 0.8, 0]} />

      {/* Crossing gates */}
      <CrossingGate position={[0.3, 0, 1]} />
      <CrossingGate position={[-0.3, 0, 1]} />
    </>
  )
}
