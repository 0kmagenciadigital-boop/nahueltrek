import { useState } from 'react'
import '../App.css'

function Admin({ actividades, setActividades, onCerrar }) {
  const [modoEdicion, setModoEdicion] = useState(null)
  const [actividadForm, setActividadForm] = useState({
    fecha: '',
    titulo: '',
    descripcion: '',
    dificultad: 'Medio',
    precio: '',
    imagenes: ['', '', '']
  })

  const dificultades = ['Bajo', 'Medio', 'Medio - Alto', 'Alto']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setActividadForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImagenChange = (index, value) => {
    const nuevasImagenes = [...actividadForm.imagenes]
    nuevasImagenes[index] = value
    setActividadForm(prev => ({
      ...prev,
      imagenes: nuevasImagenes
    }))
  }

  const agregarActividad = () => {
    if (!actividadForm.titulo || !actividadForm.fecha || !actividadForm.precio) {
      alert('Por favor completa título, fecha y precio')
      return
    }

    const nuevaActividad = {
      id: Date.now(),
      ...actividadForm,
      imagenes: actividadForm.imagenes.filter(img => img.trim() !== '')
    }

    setActividades([...actividades, nuevaActividad])
    resetForm()
    alert('Actividad agregada exitosamente')
  }

  const editarActividad = (actividad) => {
    setModoEdicion(actividad.id)
    setActividadForm({
      fecha: actividad.fecha,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      dificultad: actividad.dificultad,
      precio: actividad.precio,
      imagenes: [...actividad.imagenes, '', ''].slice(0, 3)
    })
  }

  const guardarEdicion = () => {
    setActividades(actividades.map(act => 
      act.id === modoEdicion 
        ? { 
            ...act, 
            ...actividadForm,
            imagenes: actividadForm.imagenes.filter(img => img.trim() !== '')
          }
        : act
    ))
    resetForm()
    alert('Actividad actualizada exitosamente')
  }

  const eliminarActividad = (id) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      setActividades(actividades.filter(act => act.id !== id))
    }
  }

  const resetForm = () => {
    setModoEdicion(null)
    setActividadForm({
      fecha: '',
      titulo: '',
      descripcion: '',
      dificultad: 'Medio',
      precio: '',
      imagenes: ['', '', '']
    })
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      overflowY: 'auto',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h2 style={{ 
            color: '#1e3a5f', 
            margin: 0,
            fontSize: '2rem'
          }}>
            🔧 Panel de Administración
          </h2>
          <button
            onClick={onCerrar}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Formulario */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#1e3a5f', marginBottom: '1.5rem' }}>
            {modoEdicion ? '✏️ Editar Actividad' : '➕ Nueva Actividad'}
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                  Fecha *
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={actividadForm.fecha}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                  Dificultad *
                </label>
                <select
                  name="dificultad"
                  value={actividadForm.dificultad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  {dificultades.map(dif => (
                    <option key={dif} value={dif}>{dif}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={actividadForm.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Trekking Volcán Sollipulli"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                Descripción *
              </label>
              <input
                type="text"
                name="descripcion"
                value={actividadForm.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: 21 km (ida-vuelta)"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                Precio *
              </label>
              <input
                type="text"
                name="precio"
                value={actividadForm.precio}
                onChange={handleInputChange}
                placeholder="Ej: $50,000"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a5f' }}>
                URLs de Imágenes (mínimo 1, máximo 3)
              </label>
              {[0, 1, 2].map(index => (
                <input
                  key={index}
                  type="url"
                  value={actividadForm.imagenes[index]}
                  onChange={(e) => handleImagenChange(index, e.target.value)}
                  placeholder={`URL de imagen ${index + 1}`}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    boxSizing: 'border-box'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {modoEdicion ? (
              <>
                <button
                  onClick={guardarEdicion}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
                >
                  💾 Guardar Cambios
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#757575',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#616161'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#757575'}
                >
                  ✕ Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={agregarActividad}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(30, 58, 95, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 95, 0.4)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.3)'
                }}
              >
                ➕ Agregar Actividad
              </button>
            )}
          </div>
        </div>

        {/* Lista de Actividades */}
        <div>
          <h3 style={{ color: '#1e3a5f', marginBottom: '1.5rem' }}>
            📋 Actividades Actuales ({actividades.length})
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {actividades.map(actividad => (
              <div 
                key={actividad.id}
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <img 
                  src={actividad.imagenes[0]}
                  alt={actividad.titulo}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                
                <div>
                  <h4 style={{ color: '#1e3a5f', margin: '0 0 0.5rem 0' }}>
                    {actividad.titulo}
                  </h4>
                  <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.9rem' }}>
                    📅 {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-ES')}
                  </p>
                  <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.9rem' }}>
                    📍 {actividad.descripcion}
                  </p>
                  <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.9rem' }}>
                    🏔️ {actividad.dificultad} | 💰 {actividad.precio}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => editarActividad(actividad)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarActividad(actividad.id)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
