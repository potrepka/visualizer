import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import scenes from './scenes'
import './App.css'

function App() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => (i + 1) % scenes.length)
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => (i - 1 + scenes.length) % scenes.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const { name, component: CurrentVisualizer } = scenes[index]

  const goUp = () => setIndex((i) => (i + 1) % scenes.length)
  const goDown = () => setIndex((i) => (i - 1 + scenes.length) % scenes.length)

  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <OrbitControls keys={{ LEFT: '', UP: '', RIGHT: '', BOTTOM: '' }} />
        <CurrentVisualizer key={index} />
      </Canvas>
      <div className="mobile-nav">
        <button className="mobile-nav-btn" onClick={goUp} type="button">
          ↑
        </button>
        <button className="mobile-nav-btn" onClick={goDown} type="button">
          ↓
        </button>
      </div>
      <div className="hud hud-left">Use ↑/↓ to browse</div>
      <div className="hud hud-right">
        {name} ({index + 1}/{scenes.length})
      </div>
    </div>
  )
}

export default App
