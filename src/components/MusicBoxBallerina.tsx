import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a1a2a', 10, 30)
    scene.background = new THREE.Color('#1a0e1e')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Ballerina figure ---
function Ballerina({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 1.2
    // Gentle up/down sway
    groupRef.current.position.y = position[1] + Math.sin(t * 2.4) * 0.03
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      {/* Hair bun */}
      <mesh position={[0, 1.12, -0.04]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#3a2010" roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.08, 8]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#ff88aa" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Tutu/skirt */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.02, 0.18, 0.12, 16]} />
        <meshStandardMaterial
          color="#ffaacc"
          transparent
          opacity={0.85}
          roughness={0.3}
        />
      </mesh>
      {/* Tutu layers */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.04, 0.2, 0.06, 16]} />
        <meshStandardMaterial
          color="#ffbbdd"
          transparent
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.03, 0.5, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 6]} />
        <meshStandardMaterial color="#ffddee" roughness={0.5} />
      </mesh>
      {/* Right leg - en pointe */}
      <mesh position={[0.03, 0.5, 0]} rotation={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 6]} />
        <meshStandardMaterial color="#ffddee" roughness={0.5} />
      </mesh>
      {/* Left arm - raised */}
      <mesh position={[-0.1, 0.92, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.012, 0.015, 0.18, 6]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      {/* Right arm - extended */}
      <mesh position={[0.1, 0.88, 0]} rotation={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.012, 0.015, 0.18, 6]} />
        <meshStandardMaterial color="#f5d0b0" roughness={0.6} />
      </mesh>
      {/* Slippers */}
      <mesh position={[-0.03, 0.37, 0.01]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
      <mesh position={[0.03, 0.37, 0.01]}>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshStandardMaterial color="#ffaacc" />
      </mesh>
    </group>
  )
}

// --- Music box body ---
function MusicBox() {
  return (
    <group>
      {/* Bottom of box */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3, 0.6, 2.2]} />
        <meshStandardMaterial color="#6b3a20" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Decorative inlay on front */}
      <mesh position={[0, -0.3, 1.101]}>
        <planeGeometry args={[2.4, 0.4]} />
        <meshStandardMaterial color="#8b5a30" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Gold trim edges */}
      {[
        [-1.5, -0.3, 0],
        [1.5, -0.3, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.04, 0.62, 2.22]} />
          <meshStandardMaterial
            color="#ccaa44"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Gold trim front/back */}
      {[
        [0, -0.3, 1.1],
        [0, -0.3, -1.1],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[3.04, 0.62, 0.04]} />
          <meshStandardMaterial
            color="#ccaa44"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Rotating platform */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Felt interior floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.96, 2.16]} />
        <meshStandardMaterial color="#882244" roughness={0.9} />
      </mesh>
      {/* Decorative corner spheres */}
      {[
        [-1.4, -0.55, 1.05],
        [1.4, -0.55, 1.05],
        [-1.4, -0.55, -1.05],
        [1.4, -0.55, -1.05],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#ccaa44"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Lid (opened) ---
function Lid() {
  return (
    <group position={[0, 0, -1.1]} rotation={[-1.2, 0, 0]}>
      {/* Lid panel */}
      <mesh position={[0, 0, -1.1]}>
        <boxGeometry args={[3, 0.08, 2.2]} />
        <meshStandardMaterial color="#6b3a20" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Mirror interior */}
      <mesh position={[0, -0.041, -1.1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial
          color="#ddeeff"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      {/* Mirror frame */}
      <mesh position={[0, -0.042, -1.1]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.7, 1.9]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// --- Sparkle particles around ballerina ---
const SPARKLE_COUNT = 60
const sparkleDummy = new THREE.Object3D()

function BallerinaSparkles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 0.2 + Math.random() * 0.4,
        y: 0.4 + Math.random() * 0.8,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.005 + Math.random() * 0.01,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const p = particles[i]
      const a = p.angle + t * p.speed
      const brightness = 0.3 + 0.7 * Math.abs(Math.sin(t * 2 + p.phase))
      sparkleDummy.position.set(
        Math.cos(a) * p.radius,
        p.y + Math.sin(t * 1.5 + p.phase) * 0.1,
        Math.sin(a) * p.radius,
      )
      sparkleDummy.scale.setScalar(p.scale * brightness)
      sparkleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sparkleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARKLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffddaa"
        emissiveIntensity={3}
      />
    </instancedMesh>
  )
}

// --- Ornamental patterns on box sides ---
function OrnamentalPattern({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const dots = useMemo(() => {
    const arr: [number, number][] = []
    // Create a decorative swirl pattern
    for (let i = 0; i < 20; i++) {
      const t = (i / 20) * Math.PI * 3
      const r = 0.05 + t * 0.03
      arr.push([Math.cos(t) * r, Math.sin(t) * r])
    }
    return arr
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {dots.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial
            color="#ccaa44"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Key/winder ---
function WinderKey() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.3
  })

  return (
    <group ref={ref} position={[0, -0.3, -1.2]}>
      {/* Shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0, -0.25]}>
        <torusGeometry args={[0.08, 0.02, 8, 12]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// --- Main Scene ---
export default function MusicBoxBallerina() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.2} color="#443355" />
      <directionalLight position={[3, 8, 5]} intensity={0.8} color="#ffeedd" />
      <pointLight
        position={[0, 2, 0]}
        color="#ffaacc"
        intensity={0.6}
        distance={6}
      />
      <pointLight
        position={[-2, 1, 2]}
        color="#aaccff"
        intensity={0.3}
        distance={5}
      />
      <spotLight
        position={[0, 4, 2]}
        angle={0.4}
        penumbra={0.5}
        color="#ffddee"
        intensity={1.5}
        target-position={[0, 0.5, 0]}
      />

      <MusicBox />
      <Lid />
      <Ballerina position={[0, 0.04, 0]} />
      <BallerinaSparkles />
      <WinderKey />

      {/* Ornamental patterns on sides */}
      <OrnamentalPattern position={[0, -0.3, 1.12]} rotation={[0, 0, 0]} />
      <OrnamentalPattern
        position={[1.52, -0.3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <OrnamentalPattern
        position={[-1.52, -0.3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Surface below */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a1020" roughness={0.8} />
      </mesh>
    </>
  )
}
