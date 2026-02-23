import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a1a1a', 20, 50)
    scene.background = new THREE.Color('#1a0a0a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StreetGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 40]} />
        <meshStandardMaterial color="#505050" />
      </mesh>
    </>
  )
}

function PaifangGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main pillars */}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 3, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 6, 8]} />
            <meshStandardMaterial color="#c02020" />
          </mesh>
          {/* Pillar base */}
          <mesh position={[x, 0.15, 0]}>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
        </group>
      ))}

      {/* Center roof - largest tier */}
      <mesh position={[0, 6.8, 0]}>
        <boxGeometry args={[8.5, 0.15, 1.8]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Roof curve simulation */}
      <mesh position={[0, 7.1, 0]}>
        <boxGeometry args={[9, 0.2, 2]} />
        <meshStandardMaterial color="#2a8a2a" />
      </mesh>
      {/* Roof ridge */}
      <mesh position={[0, 7.3, 0]}>
        <boxGeometry args={[8.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Roof edge ornaments */}
      {[-4.3, 4.3].map((x, i) => (
        <mesh
          key={i}
          position={[x, 7.4, 0]}
          rotation={[0, 0, x > 0 ? -0.3 : 0.3]}
        >
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#c8a020" />
        </mesh>
      ))}

      {/* Lower side roofs */}
      {[-2.35, 2.35].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 5.3, 0]}>
            <boxGeometry args={[3, 0.12, 1.4]} />
            <meshStandardMaterial color="#c8a020" />
          </mesh>
          <mesh position={[x, 5.5, 0]}>
            <boxGeometry args={[3.2, 0.15, 1.5]} />
            <meshStandardMaterial color="#2a8a2a" />
          </mesh>
        </group>
      ))}

      {/* Horizontal beams */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[8, 0.2, 0.3]} />
        <meshStandardMaterial color="#c02020" />
      </mesh>
      <mesh position={[0, 5.6, 0]}>
        <boxGeometry args={[8, 0.15, 0.25]} />
        <meshStandardMaterial color="#c02020" />
      </mesh>

      {/* Center panel */}
      <mesh position={[0, 6.3, 0]}>
        <boxGeometry args={[2, 0.6, 0.15]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Characters placeholder (decorative rectangles) */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 6.3, 0.08]}>
          <boxGeometry args={[0.3, 0.4, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Stone lions at base */}
      {[-3.5, 3.5].map((x, i) => (
        <group key={i} position={[x, 0.4, 0.6]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.5]} />
            <meshStandardMaterial color="#909090" />
          </mesh>
          <mesh position={[0, 0.4, 0.1]}>
            <sphereGeometry args={[0.18, 6, 5]} />
            <meshStandardMaterial color="#909090" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function HangingLantern({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t * 0.7 + phase) * 0.04
  })

  return (
    <group ref={ref} position={position}>
      {/* String */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.4, 4]} />
        <meshStandardMaterial color="#8a1010" />
      </mesh>
      {/* Lantern body */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial
          color="#e02020"
          emissive="#e02020"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Top ring */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 8]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Bottom ring */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 8]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Tassel */}
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.01, 0.04, 0.15, 5]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      <pointLight
        position={[0, -0.1, 0]}
        color="#e83030"
        intensity={0.5}
        distance={4}
      />
    </group>
  )
}

function ShopFront({
  position,
  color,
  signColor,
}: {
  position: [number, number, number]
  color: string
  signColor: string
}) {
  return (
    <group position={position}>
      {/* Building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Shop sign */}
      <mesh position={[0, 3.2, 1.52]}>
        <boxGeometry args={[2.2, 0.6, 0.08]} />
        <meshStandardMaterial color={signColor} />
      </mesh>
      {/* Sign text placeholder */}
      <mesh position={[0, 3.2, 1.57]}>
        <boxGeometry args={[1.6, 0.3, 0.02]} />
        <meshStandardMaterial color="#c8a020" />
      </mesh>
      {/* Shop opening */}
      <mesh position={[0, 1.2, 1.52]}>
        <boxGeometry args={[2, 2.2, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Window display */}
      <mesh position={[0, 1.2, 1.55]}>
        <boxGeometry args={[1.8, 1.8, 0.02]} />
        <meshStandardMaterial
          color="#e8d080"
          emissive="#e8d080"
          emissiveIntensity={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 2.4, 2]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[2.8, 0.03, 1]} />
        <meshStandardMaterial color="#c02020" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function StringLights({
  startX,
  endX,
  y,
  z,
  count,
}: {
  startX: number
  endX: number
  y: number
  z: number
  count: number
}) {
  const lights = useMemo(() => {
    const arr: { x: number; color: string }[] = []
    const colors = ['#e02020', '#e8c020', '#e02020', '#e8c020']
    for (let i = 0; i < count; i++) {
      arr.push({
        x: startX + (endX - startX) * (i / (count - 1)),
        color: colors[i % colors.length],
      })
    }
    return arr
  }, [startX, endX, count])

  return (
    <group>
      {/* Wire */}
      <mesh position={[(startX + endX) / 2, y, z]}>
        <boxGeometry args={[endX - startX, 0.01, 0.01]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Bulbs */}
      {lights.map((l, i) => (
        <group key={i}>
          <mesh position={[l.x, y - 0.05, z]}>
            <sphereGeometry args={[0.04, 5, 4]} />
            <meshStandardMaterial
              color={l.color}
              emissive={l.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function StreetVendorCart({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      {/* Cart body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1, 0.6, 0.8]} />
        <meshStandardMaterial color="#8a4a20" />
      </mesh>
      {/* Umbrella */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.8, 0.3, 8]} />
        <meshStandardMaterial color="#c02020" side={THREE.DoubleSide} />
      </mesh>
      {/* Umbrella pole */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 5]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Wheels */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 10]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      ))}
    </group>
  )
}

function NeonSign({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.15
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.6, 1.2, 0.06]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

export default function ChinatownGate() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} intensity={0.4} color="#ffd0a0" />
      <ambientLight intensity={0.2} color="#e8a080" />

      <StreetGround />

      {/* Main paifang gate */}
      <PaifangGate position={[0, 0, -2]} />

      {/* Hanging lanterns on gate */}
      <HangingLantern position={[-2.3, 5.2, -2]} />
      <HangingLantern position={[2.3, 5.2, -2]} />
      <HangingLantern position={[0, 5.8, -2]} />

      {/* Lanterns along street */}
      {Array.from({ length: 6 }, (_, i) => (
        <HangingLantern
          key={`l${i}`}
          position={[-3 + (i % 2) * 6, 4, 3 + i * 2.5]}
        />
      ))}

      {/* Shops - left */}
      <ShopFront position={[-5, 0, 4]} color="#c04030" signColor="#c02020" />
      <ShopFront position={[-5, 0, 8]} color="#c8a060" signColor="#204080" />
      <ShopFront position={[-5, 0, 12]} color="#c04030" signColor="#c02020" />

      {/* Shops - right */}
      <ShopFront position={[5, 0, 5]} color="#c8a060" signColor="#c02020" />
      <ShopFront position={[5, 0, 9]} color="#c04030" signColor="#204080" />
      <ShopFront position={[5, 0, 13]} color="#c8a060" signColor="#c02020" />

      {/* String lights */}
      <StringLights startX={-4} endX={4} y={4.5} z={5} count={12} />
      <StringLights startX={-4} endX={4} y={4.2} z={9} count={12} />

      {/* Vendor cart */}
      <StreetVendorCart position={[1.5, 0, 6]} />

      {/* Neon signs */}
      <NeonSign position={[-3.4, 3, 4]} color="#e02020" />
      <NeonSign position={[3.4, 2.8, 7]} color="#20c0e0" />
      <NeonSign position={[-3.4, 3.2, 10]} color="#e8c020" />
    </>
  )
}
