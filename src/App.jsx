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

  // 1. LEER los proyectos (R del CRUD)
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

  // 2. CREAR un proyecto (C del CRUD)
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

  // 3. ELIMINAR un proyecto (D del CRUD) - ¡NUEVO!
  const eliminarProyecto = (id) => {
    // Pedimos confirmación para no borrar por accidente
    if (!window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return;

    // Le decimos a la API: "¡Oye, usa el método DELETE en este ID!"
    fetch(`https://nexus-api-backend.onrender.com/api/proyectos/${id}/`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) {
        // Si Render lo borró con éxito, lo quitamos de la pantalla instantáneamente
        setProyectos(proyectos.filter(proyecto => proyecto.id !== id))
      }
    })
    .catch(error => console.error("Error al eliminar:", error))
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
              
              {/* ¡NUEVO! Agrupamos el título y el botón del basurero */}
              <div className="cabecera-tarjeta">
                <h2>{proyecto.titulo}</h2>
                <button 
                  onClick={() => eliminarProyecto(proyecto.id)} 
                  className="btn-eliminar"
                  title="Eliminar proyecto"
                >
                  🗑️
                </button>
              </div>

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