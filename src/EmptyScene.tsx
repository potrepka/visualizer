import { Grid } from '@react-three/drei'

export default function EmptyScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#888"
        fadeDistance={120}
        infiniteGrid
      />
    </>
  )
}
