import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)
  
  const [nuevoProyecto, setNuevoProyecto] = useState({
    titulo: '',
    descripcion: '',
    estado: 'pendiente'
  })

  useEffect(() => {
    fetch('https://nexus-api-backend.onrender.com/api/proyectos/')
      .then(res => res.json())
      .then(datos => {
        setProyectos(datos)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error:", error)
        setCargando(false)
      })
  }, [])

  const crearProyecto = (e) => {
    e.preventDefault();
    
    fetch('https://nexus-api-backend.onrender.com/api/proyectos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProyecto)
    })
    .then(res => res.json())
    .then(datosGuardados => {
      setProyectos([...proyectos, datosGuardados])
      setNuevoProyecto({ titulo: '', descripcion: '', estado: 'pendiente' })
    })
    .catch(error => console.error("Error al guardar:", error))
  }

  return (
    <div className="contenedor-principal">
      <header className="cabecera">
        <h1>🚀 Espacio de trabajo Nexus</h1>
        <p>Tu sistema de gestión integral</p>
      </header>

      <form onSubmit={crearProyecto} className="formulario-creacion">
        <input 
          type="text" 
          placeholder="Título del proyecto" 
          required 
          value={nuevoProyecto.titulo}
          onChange={e => setNuevoProyecto({...nuevoProyecto, titulo: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Descripción rápida" 
          required 
          value={nuevoProyecto.descripcion}
          onChange={e => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})}
        />
        <select 
          value={nuevoProyecto.estado}
          onChange={e => setNuevoProyecto({...nuevoProyecto, estado: e.target.value})}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
          <option value="completado">Completado</option>
        </select>
        <button type="submit">Agregar</button>
      </form>

      {cargando ? (
        <div className="cargando">Cargando base de datos desde Render...</div>
      ) : (
        <div className="cuadricula-proyectos">
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