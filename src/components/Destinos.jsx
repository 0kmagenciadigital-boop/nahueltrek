import { useState } from 'react'
import '../App.css'

function Destinos({ lugares, setLugares, onCerrar }) {
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Trekking',
    ubicacion: ''
  })

  const categorias = ['Trekking', 'Camping', 'Montañismo', 'Observación', 'Termas', 'Cascadas', 'Lagos', 'Volcanes', 'Parques', 'Otro']

  const agregarDestino = () => {
    if (!formulario.titulo.trim()) {
      alert('El título es obligatorio')
      return
    }

    const nuevoDestino = {
      id: Date.now(),
      ...formulario,
      imagenes: [],
      destacado: false
    }

    setLugares(prev => [...prev, nuevoDestino])
    limpiarFormulario()
    alert('Destino agregado correctamente')
  }

  const actualizarDestino = () => {
    if (!formulario.titulo.trim()) {
      alert('El título es obligatorio')
      return
    }

    setLugares(prev => prev.map(lugar =>
      lugar.id === editando.id ? { ...lugar, ...formulario } : lugar
    ))
    limpiarFormulario()
    setEditando(null)
    alert('Destino actualizado correctamente')
  }

  const eliminarDestino = (id) => {
    if (confirm('¿Estás seguro de eliminar este destino?')) {
      setLugares(prev => prev.filter(lugar => lugar.id !== id))
      alert('Destino eliminado')
    }
  }

  const editarDestino = (lugar) => {
    setEditando(lugar)
    setFormulario({
      titulo: lugar.titulo,
      descripcion: lugar.descripcion || '',
      categoria: lugar.categoria || 'Trekking',
      ubicacion: lugar.ubicacion || ''
    })
  }

  const limpiarFormulario = () => {
    setFormulario({
      titulo: '',
      descripcion: '',
      categoria: 'Trekking',
      ubicacion: ''
    })
    setEditando(null)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
          color: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '20px 20px 0 0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>📍 Gestión de Destinos</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                {lugares.length} destinos registrados
              </p>
            </div>
            <button
              onClick={onCerrar}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem'
        }}>
          {/* Formulario */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '2px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#9c27b0', fontSize: '1.2rem' }}>
              {editando ? '✏️ Editar Destino' : '➕ Agregar Nuevo Destino'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#666' }}>
                  Título *
                </label>
                <input
                  type="text"
                  value={formulario.titulo}
                  onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                  placeholder="Ej: Parque Nacional Nahuelbuta"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#666' }}>
                  Categoría *
                </label>
                <select
                  value={formulario.categoria}
                  onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#666' }}>
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formulario.ubicacion}
                  onChange={(e) => setFormulario({ ...formulario, ubicacion: e.target.value })}
                  placeholder="Ej: La Araucanía"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#666' }}>
                  Descripción
                </label>
                <textarea
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  placeholder="Describe el destino..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={editando ? actualizarDestino : agregarDestino}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#9c27b0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7b1fa2'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#9c27b0'}
              >
                {editando ? '💾 Actualizar' : '➕ Agregar'}
              </button>
              {editando && (
                <button
                  onClick={limpiarFormulario}
                  style={{
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#757575',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#616161'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#757575'}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Destinos */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#9c27b0', fontSize: '1.2rem' }}>
              📋 Destinos Registrados
            </h3>
            {lugares.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#999'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: '#666' }}>No hay destinos registrados</h3>
                <p>Agrega destinos para que aparezcan en el formulario de contacto</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {lugares.map(lugar => (
                  <div
                    key={lugar.id}
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#9c27b0',
                      color: 'white',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      {lugar.categoria}
                    </div>

                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e3a5f' }}>
                      {lugar.titulo}
                    </h4>

                    {lugar.ubicacion && (
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        📍 {lugar.ubicacion}
                      </p>
                    )}

                    {lugar.descripcion && (
                      <p style={{
                        margin: '0.5rem 0',
                        color: '#666',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        {lugar.descripcion.length > 100
                          ? lugar.descripcion.substring(0, 100) + '...'
                          : lugar.descripcion}
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <button
                        onClick={() => editarDestino(lugar)}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          backgroundColor: '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarDestino(lugar.id)}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Destinos
