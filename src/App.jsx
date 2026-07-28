import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Creamos un espacio en la memoria para guardar el mensaje del backend
  const [mensaje, setMensaje] = useState('Conectando con el backend...')

  useEffect(() => {
    // Le decimos al frontend que vaya a buscar los datos a tu URL de Render
    fetch('https://nexus-api-backend.onrender.com/api/prueba/')
      .then(response => response.json()) // Transforma el texto crudo en un objeto
      .then(data => {
        setMensaje(data.mensaje) // ¡Guardamos el mensaje en la memoria!
      })
      .catch(error => {
        console.error("Hubo un error:", error)
        setMensaje('Error al conectar con la API')
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>🚀 Proyecto Nexus</h1>
      <h2>Estado de la conexión:</h2>
      {/* Mostramos el mensaje que está en la memoria */}
      <p style={{ color: '#a855f7', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '20px' }}>
        {mensaje}
      </p>
    </div>
  )
}

export default App