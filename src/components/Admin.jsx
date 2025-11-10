import { useState } from 'react'
import '../App.css'

function Admin({ actividades, setActividades, onCerrar, onResetear }) {
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

  const handleImagenFile = (index, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const nuevasImagenes = [...actividadForm.imagenes]
        nuevasImagenes[index] = reader.result
        setActividadForm(prev => ({
          ...prev,
          imagenes: nuevasImagenes
        }))
      }
      reader.readAsDataURL(file)
    }
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
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
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
    <div className="position-fixed top-0 start-0 w-100 h-100 overflow-auto" style={{
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      padding: 'clamp(1rem, 3vw, 2rem)'
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: 'clamp(1rem, 3vw, 2rem)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 pb-3" style={{
          borderBottom: '2px solid #e0e0e0',
          gap: '1rem'
        }}>
          <h2 className="text-center text-md-start" style={{ 
            color: '#1e3a5f', 
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)'
          }}>
            🔧 Panel de Administración
          </h2>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button
              onClick={onResetear}
              className="btn btn-warning fw-bold"
              style={{
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                padding: 'clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)'
              }}
            >
              🔄 Resetear
            </button>
            <button
              onClick={onCerrar}
              className="btn btn-danger fw-bold"
              style={{
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                padding: 'clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)'
              }}
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-light rounded-3 p-3 p-md-4 mb-4">
          <h3 className="mb-4" style={{ color: '#1e3a5f', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            {modoEdicion ? '✏️ Editar Actividad' : '➕ Nueva Actividad'}
          </h3>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={actividadForm.fecha}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Dificultad *
              </label>
              <select
                name="dificultad"
                value={actividadForm.dificultad}
                onChange={handleInputChange}
                className="form-select"
              >
                {dificultades.map(dif => (
                  <option key={dif} value={dif}>{dif}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={actividadForm.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Trekking Volcán Sollipulli"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Descripción *
              </label>
              <input
                type="text"
                name="descripcion"
                value={actividadForm.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: 21 km (ida-vuelta)"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Precio *
              </label>
              <input
                type="text"
                name="precio"
                value={actividadForm.precio}
                onChange={handleInputChange}
                placeholder="Ej: $50,000"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold mb-3" style={{ color: '#1e3a5f' }}>
                Imágenes (mínimo 1, máximo 3)
              </label>
              {[0, 1, 2].map(index => (
                <div key={index} className="mb-3 p-3 border rounded-3 bg-white">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.95rem', color: '#555' }}>
                    📷 Imagen {index + 1}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImagenFile(index, e.target.files[0])}
                    className="form-control mb-2"
                  />
                  <input
                    type="url"
                    value={actividadForm.imagenes[index]}
                    onChange={(e) => handleImagenChange(index, e.target.value)}
                    placeholder={`O ingresa URL de imagen ${index + 1}`}
                    className="form-control"
                  />
                  {actividadForm.imagenes[index] && (
                    <div className="mt-2">
                      <img
                        src={actividadForm.imagenes[index]}
                        alt={`Preview ${index + 1}`}
                        style={{ maxWidth: '120px', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 mt-4">
            <button
              onClick={modoEdicion ? guardarEdicion : agregarActividad}
              className="btn btn-success flex-fill"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(0.6rem, 2vw, 0.8rem)' }}
            >
              {modoEdicion ? '💾 Guardar Cambios' : '➕ Agregar Actividad'}
            </button>
            <button
              onClick={resetForm}
              className="btn btn-secondary flex-fill"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(0.6rem, 2vw, 0.8rem)' }}
            >
              🔄 {modoEdicion ? 'Cancelar' : 'Limpiar'}
            </button>
          </div>
        </div>

        {/* Lista de Actividades */}
        <div>
          <h3 className="mb-4" style={{ color: '#1e3a5f', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            📋 Actividades Registradas ({actividades.length})
          </h3>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {actividades.map(actividad => (
              <div key={actividad.id} className="col">
                <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', border: '2px solid #e0e0e0', overflow: 'hidden' }}>
                  <img
                    src={actividad.imagenes[0]}
                    alt={actividad.titulo}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: '#1e3a5f', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.8rem' }}>
                      {actividad.titulo}
                    </h5>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>📅 Fecha:</strong> {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-CL')}
                    </p>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>📍 Descripción:</strong> {actividad.descripcion}
                    </p>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>🏔️ Dificultad:</strong> {' '}
                      <span className={`badge bg-${
                        actividad.dificultad === 'Bajo' ? 'success' : 
                        actividad.dificultad === 'Medio' ? 'warning' : 
                        actividad.dificultad === 'Medio - Alto' ? 'warning' : 
                        'danger'
                      }`}>
                        {actividad.dificultad}
                      </span>
                    </p>
                    <p className="card-text mb-3" style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#2d5a8f' }}>
                      <strong>💰 Precio:</strong> {actividad.precio}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        onClick={() => editarActividad(actividad)}
                        className="btn btn-primary btn-sm flex-fill"
                        style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarActividad(actividad.id)}
                        className="btn btn-danger btn-sm flex-fill"
                        style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
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
