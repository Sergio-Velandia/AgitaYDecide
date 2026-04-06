import { useState, useEffect, useRef } from 'react'
import './App.css'

export default function App() {
  const [opciones, setOpciones] = useState(['Pizza', 'Sushi', 'Tacos', 'Hamburguesa'])
  const [nueva, setNueva] = useState('')
  const [elegido, setElegido] = useState(null)
  const [animando, setAnimando] = useState(false)
  const agitando = useRef(false)

  useEffect(() => {
    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity
      const fuerza = Math.sqrt(x * x + y * y + z * z)
      if (fuerza > 30 && !agitando.current) decidir()
    }

    // iOS requiere permiso explícito
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(res => {
        if (res === 'granted') window.addEventListener('devicemotion', handleMotion)
      })
    } else {
      window.addEventListener('devicemotion', handleMotion)
    }

    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [opciones])

  const decidir = () => {
    if (opciones.length === 0) return
    agitando.current = true
    setAnimando(true)

    if (navigator.vibrate) navigator.vibrate([100, 50, 100])

    const random = opciones[Math.floor(Math.random() * opciones.length)]
    setElegido(random)

    setTimeout(() => {
      agitando.current = false
      setAnimando(false)
    }, 600)
  }

  const agregar = () => {
    if (nueva.trim()) {
      setOpciones([...opciones, nueva.trim()])
      setNueva('')
    }
  }

  const eliminar = (item) => {
    setOpciones(opciones.filter(o => o !== item))
    if (elegido === item) setElegido(null)
  }

  return (
    <div className="app">
      <div className="header">
        <p className="subtitulo">agita y decide</p>
        <h1 className="titulo">¿Qué hacemos hoy?</h1>
      </div>

      <div className="contenido">
        <div className="lista">
          {opciones.map(item => (
            <div key={item} className={`opcion ${elegido === item ? 'elegida' : ''}`}>
              <span>{item}</span>
              {elegido === item
                ? <span className="badge">elegido</span>
                : <button className="eliminar" onClick={() => eliminar(item)}>×</button>
              }
            </div>
          ))}
        </div>

        <div className="fila">
          <input
            type="text"
            placeholder="Agregar opción..."
            value={nueva}
            onChange={e => setNueva(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
          />
          <button className="btn-agregar" onClick={agregar}>+</button>
        </div>

        {elegido && (
          <div className={`resultado ${animando ? 'bounce' : ''}`}>
            <p className="resultado-texto">{elegido}</p>
            <p className="resultado-sub">el universo ha decidido</p>
          </div>
        )}

        <button className="btn-decidir" onClick={decidir}>
          agita el celular para decidir
        </button>
      </div>
    </div>
  )
}