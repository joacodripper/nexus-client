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

  // 1. LEER (Read)
  useEffect(() => {
    fetch('https://nexus-api-backend.onrender.com/api/proyectos/')
      .then(res => res.json())
      .then(datos => {
        setProyectos(datos)
        setCargando(false)
      })
      .catch(error => console.error("Error:", error))
  }, [])

  // 2. CREAR (Create)
  const crearProyecto = (e) => {
    e.preventDefault();
    fetch('https://nexus-api-backend.onrender.com/api/proyectos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProyecto)
    })
    .then(res => res.json())
    .then(datosGuardados => {
      setProyectos([...proyectos, datosGuardados])
      setNuevoProyecto({ titulo: '', descripcion: '', estado: 'pendiente' })
    })
    .catch(error => console.error("Error al guardar:", error))
  }

  // 3. ELIMINAR (Delete)
  const eliminarProyecto = (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return;
    
    fetch(`https://nexus-api-backend.onrender.com/api/proyectos/${id}/`, {
      method: 'DELETE'
    })
    .then(res => {
      if (res.ok) setProyectos(proyectos.filter(p => p.id !== id))
    })
    .catch(error => console.error("Error al eliminar:", error))
  }

  // 4. ACTUALIZAR (Update) - ¡LA ÚLTIMA PIEZA! 🧩
  const actualizarEstado = (id, nuevoEstado) => {
    // Usamos el método PATCH porque solo queremos cambiar un pequeño pedazo del proyecto (el estado)
    fetch(`https://nexus-api-backend.onrender.com/api/proyectos/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(res => res.json())
    .then(proyectoActualizado => {
      // Actualizamos solo esa tarjeta en la pantalla sin recargar
      setProyectos(proyectos.map(p => p.id === id ? proyectoActualizado : p))
    })
    .catch(error => console.error("Error al actualizar:", error))
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
              <div className="cabecera-tarjeta">
                <h2>{proyecto.titulo}</h2>
                <button onClick={() => eliminarProyecto(proyecto.id)} className="btn-eliminar" title="Eliminar proyecto">🗑️</button>
              </div>
              <p className="descripcion">{proyecto.descripcion}</p>
              
              <div className="pie-tarjeta">
                {/* ¡Aquí está la magia! Ahora es un menú seleccionable */}
                <select 
                  className={`etiqueta select-estado ${proyecto.estado}`}
                  value={proyecto.estado}
                  onChange={(e) => actualizarEstado(proyecto.id, e.target.value)}
                >
                  <option value="pendiente">PENDIENTE</option>
                  <option value="en_progreso">EN PROGRESO</option>
                  <option value="completado">COMPLETADO</option>
                </select>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App