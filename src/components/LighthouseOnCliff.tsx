import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#556677', 10, 50)
    scene.background = new THREE.Color('#556677')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Lighthouse Tower ---
function LighthouseTower() {
  return (
    <group position={[0, 3, 0]}>
      {/* Main tower body - tapered cylinder */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.6, 1, 5, 16]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} />
      </mesh>
      {/* Red stripes */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.5 + i * 1.7, 0]}>
          <cylinderGeometry args={[0.92 - i * 0.1, 0.95 - i * 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#cc3333" roughness={0.6} />
        </mesh>
      ))}
      {/* Lantern room */}
      <mesh position={[0, 5.3, 0]}>
        <cylinderGeometry args={[0.65, 0.6, 0.8, 12]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Lantern room glass */}
      <mesh position={[0, 5.3, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.6, 12]} />
        <meshStandardMaterial
          color="#ffee99"
          transparent
          opacity={0.5}
          emissive="#ffdd44"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Gallery railing */}
      <mesh position={[0, 4.85, 0]}>
        <torusGeometry args={[0.7, 0.03, 6, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.8} />
      </mesh>
      {/* Dome cap */}
      <mesh position={[0, 5.8, 0]}>
        <sphereGeometry args={[0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.3, 1.01]}>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#4a2810" roughness={0.9} />
      </mesh>
    </group>
  )
}

// --- Rotating Light Beam ---
function LightBeam() {
  const beamRef = useRef<THREE.Group>(null!)
  const lightRef = useRef<THREE.SpotLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    beamRef.current.rotation.y = t * 0.8
  })

  return (
    <group ref={beamRef} position={[0, 8.3, 0]}>
      <spotLight
        ref={lightRef}
        position={[0, 0, 0]}
        target-position={[10, 5, 0]}
        angle={0.15}
        penumbra={0.3}
        intensity={8}
        distance={40}
        color="#ffdd88"
      />
      {/* Visible beam cone */}
      <mesh position={[5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[1.5, 10, 8, 1, true]} />
        <meshBasicMaterial
          color="#ffdd66"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// --- Rocky Cliff ---
function Cliff() {
  const rocks = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
      rot: number
    }[] = []
    // Main cliff body
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 8
      const h = 1 + Math.random() * 4
      const dist = Math.sqrt(x * x + z * z)
      const yOff = dist > 3 ? -h * 0.5 : 0
      arr.push({
        pos: [x, yOff + h / 2 - 1, z],
        scale: [0.8 + Math.random() * 1.5, h, 0.8 + Math.random() * 1.5],
        rot: Math.random() * Math.PI,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Main cliff mass */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[10, 5, 10]} />
        <meshStandardMaterial color="#4a4a42" roughness={0.95} />
      </mesh>
      {/* Rocky surface detail */}
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} rotation={[0, r.rot, 0]} scale={r.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#5a5a50' : '#3e3e38'}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Keeper's Cottage ---
function Cottage() {
  return (
    <group position={[-3, 2.8, 1]}>
      {/* Walls */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 1, 1.4]} />
        <meshStandardMaterial color="#d4c8a8" roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.3, 0.6, 4]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.6, 1.4, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#666666" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.3, 0.71]}>
        <boxGeometry args={[0.3, 0.5, 0.02]} />
        <meshStandardMaterial color="#4a2810" />
      </mesh>
      {/* Windows */}
      <mesh position={[0.5, 0.6, 0.71]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#aaddee"
          emissive="#776633"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[-0.5, 0.6, 0.71]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#aaddee"
          emissive="#776633"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

// --- Crashing Waves ---
function Waves() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = ref.current.geometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.5 + t) * 0.4 +
        Math.sin(z * 0.3 + t * 0.7) * 0.3 +
        Math.cos((x + z) * 0.4 + t * 1.5) * 0.2
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
      <planeGeometry args={[60, 60, 60, 60]} />
      <meshStandardMaterial
        color="#1a4a6a"
        metalness={0.5}
        roughness={0.3}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Foam at cliff base ---
function Foam() {
  const foamParts = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      phase: number
      scale: number
    }[] = []
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 4.5 + Math.random() * 1.5
      arr.push({
        pos: [Math.cos(angle) * dist, -2.5, Math.sin(angle) * dist],
        phase: Math.random() * Math.PI * 2,
        scale: 0.3 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {foamParts.map((f, i) => (
        <FoamSpot
          key={i}
          position={f.pos}
          phase={f.phase}
          baseScale={f.scale}
        />
      ))}
    </group>
  )
}

function FoamSpot({
  position,
  phase,
  baseScale,
}: {
  position: [number, number, number]
  phase: number
  baseScale: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const s = baseScale * (0.5 + 0.5 * Math.sin(t * 2 + phase))
    ref.current.scale.set(s, 0.05, s)
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
    </mesh>
  )
}

// --- Main Scene ---
export default function LighthouseOnCliff() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.15} color="#667788" />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#aabbcc" />
      <directionalLight
        position={[-3, 5, -5]}
        intensity={0.2}
        color="#445566"
      />
      <Cliff />
      <LighthouseTower />
      <LightBeam />
      <Cottage />
      <Waves />
      <Foam />
    </>
  )
}
