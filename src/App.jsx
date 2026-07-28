import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Aquí guardaremos los proyectos que lleguen de la base de datos
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // React va al restaurante (Render) y pide el menú (Tus proyectos)
    fetch('https://nexus-api-backend.onrender.com/api/proyectos/')
      .then(respuesta => respuesta.json())
      .then(datos => {
        setProyectos(datos)
        setCargando(false)
      })
      .catch(error => {
        console.error("Hubo un error trayendo los datos:", error)
        setCargando(false)
      })
  }, [])

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>🚀 Nexus Workspace</h1>
        <p>Tu sistema de gestión integral</p>
      </header>

      {cargando ? (
        <div className="cargando">Cargando base de datos...</div>
      ) : (
        <div className="cuadricula-proyectos">
          {/* Aquí tomamos cada proyecto y lo convertimos en una tarjeta visual */}
          {proyectos.map(proyecto => (
            <div key={proyecto.id} className="tarjeta">
              <h2>{proyecto.titulo}</h2>
              <p className="descripcion">{proyecto.descripcion}</p>
              
              <div className="pie-tarjeta">
                <span className={`etiqueta ${proyecto.estado}`}>
                  {proyecto.estado.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App