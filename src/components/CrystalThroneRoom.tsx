import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#1a0a2a')
    scene.fog = new THREE.Fog('#1a0a2a', 12, 40)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Floor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a0a2a" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Decorative runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <planeGeometry args={[2, 12]} />
        <meshStandardMaterial color="#4a1a5a" roughness={0.6} />
      </mesh>
      {/* Gold trim lines */}
      {[-1.05, 1.05].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 2]}>
          <planeGeometry args={[0.08, 12]} />
          <meshStandardMaterial
            color="#daa520"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function CrystalPillar({
  position,
  height,
  color = '#aa88ff',
}: {
  position: [number, number, number]
  height: number
  color?: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.3 + Math.sin(t * 1.5 + position[0]) * 0.15
  })

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.6]} />
        <meshStandardMaterial color="#3a2a4a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Crystal column */}
      <mesh ref={ref} position={[0, height / 2 + 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.25, height, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          metalness={0.4}
          roughness={0.1}
        />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height + 0.45, 0]}>
        <boxGeometry args={[0.65, 0.25, 0.65]} />
        <meshStandardMaterial color="#3a2a4a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Light point */}
      <pointLight
        position={[0, height / 2, 0]}
        color={color}
        intensity={0.3}
        distance={4}
      />
    </group>
  )
}

function Throne() {
  return (
    <group position={[0, 0, -5]}>
      {/* Dais steps */}
      <mesh position={[0, 0.1, 1.5]}>
        <boxGeometry args={[4, 0.2, 1.5]} />
        <meshStandardMaterial color="#2a1a3a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0.5]}>
        <boxGeometry args={[3.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#2a1a3a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[3, 0.2, 1]} />
        <meshStandardMaterial color="#2a1a3a" roughness={0.6} />
      </mesh>

      {/* Seat */}
      <mesh position={[0, 0.95, -0.3]}>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, 1.25, -0.3]}>
        <boxGeometry args={[1.0, 0.1, 0.7]} />
        <meshStandardMaterial color="#6a1a8a" roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 2.0, -0.65]}>
        <boxGeometry args={[1.3, 2.0, 0.15]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Crown ornament on back */}
      <mesh position={[0, 3.2, -0.65]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#ff44ff"
          emissive="#cc22cc"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Armrests */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.2, -0.15]}>
            <boxGeometry args={[0.15, 0.5, 0.7]} />
            <meshStandardMaterial
              color="#daa520"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Armrest gem */}
          <mesh position={[x, 1.5, 0.15]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color="#4422ff"
              emissive="#2211cc"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Chandelier() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <group ref={ref} position={[0, 8, 0]}>
      {/* Central orb */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#daa520" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Support chain */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 4]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} />
      </mesh>
      {/* Arms and hanging crystals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const r = 1.5
        return (
          <group key={i}>
            {/* Arm */}
            <mesh
              position={[
                Math.sin(angle) * r * 0.5,
                -0.1,
                Math.cos(angle) * r * 0.5,
              ]}
              rotation={[0, -angle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.02, 0.02, r, 4]} />
              <meshStandardMaterial color="#daa520" metalness={0.8} />
            </mesh>
            {/* Hanging crystal */}
            <mesh position={[Math.sin(angle) * r, -0.6, Math.cos(angle) * r]}>
              <octahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial
                color="#cc88ff"
                emissive="#aa66dd"
                emissiveIntensity={1.5}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Light from crystal */}
            <pointLight
              position={[Math.sin(angle) * r, -0.8, Math.cos(angle) * r]}
              color="#cc88ff"
              intensity={0.3}
              distance={5}
            />
          </group>
        )
      })}
      {/* Inner ring of smaller crystals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.3
        const r = 0.7
        return (
          <mesh
            key={`inner-${i}`}
            position={[Math.sin(angle) * r, -0.3, Math.cos(angle) * r]}
          >
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color="#ffcc88"
              emissive="#ddaa66"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function WallBanner({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 4]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} />
      </mesh>
      {/* Banner fabric */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial
          color="#4a0a6a"
          side={THREE.DoubleSide}
          roughness={0.8}
        />
      </mesh>
      {/* Gold symbol */}
      <mesh position={[0, 0.1, 0.01]}>
        <circleGeometry args={[0.15, 6]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CeilingArch() {
  return (
    <group>
      <mesh position={[0, 9, 0]}>
        <boxGeometry args={[20, 0.3, 20]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.8} />
      </mesh>
      {/* Arched ribs */}
      {[-3, 0, 3].map((z, i) => (
        <mesh key={i} position={[0, 7.5, z]} rotation={[0, 0, 0]}>
          <torusGeometry args={[5, 0.1, 4, 24, Math.PI]} />
          <meshStandardMaterial color="#2a1a3a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Walls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 4.5, -8]}>
        <boxGeometry args={[20, 9, 0.3]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.8} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-8, 4.5, 0]}>
        <boxGeometry args={[0.3, 9, 20]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.8} />
      </mesh>
      <mesh position={[8, 4.5, 0]}>
        <boxGeometry args={[0.3, 9, 20]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

export default function CrystalThroneRoom() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.08} />
      <directionalLight position={[0, 8, 5]} intensity={0.3} color="#aaaacc" />

      <Floor />
      <Walls />
      <CeilingArch />
      <Throne />
      <Chandelier />

      {/* Crystal pillars along sides */}
      {[-6, -3, 3, 6].map((x) =>
        [-3, 0, 3].map((z, j) => (
          <CrystalPillar
            key={`${x}-${j}`}
            position={[x, 0, z]}
            height={7}
            color={x < 0 ? '#aa88ff' : '#88aaff'}
          />
        )),
      )}

      {/* Wall banners */}
      <WallBanner position={[-7.8, 5, -3]} rotation={[0, Math.PI / 2, 0]} />
      <WallBanner position={[-7.8, 5, 3]} rotation={[0, Math.PI / 2, 0]} />
      <WallBanner position={[7.8, 5, -3]} rotation={[0, -Math.PI / 2, 0]} />
      <WallBanner position={[7.8, 5, 3]} rotation={[0, -Math.PI / 2, 0]} />
    </>
  )
}
