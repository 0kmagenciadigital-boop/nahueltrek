import { useState, useMemo } from 'react'
import '../App.css'

function Reservas({ reservas, setReservas, actividades, onCerrar }) {
  const [filtroActividad, setFiltroActividad] = useState('todas')
  const [filtroEstado, setFiltroEstado] = useState('todas')

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatearFechaCorta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const obtenerActividad = (actividadId) => {
    return actividades.find(a => a.id === actividadId)
  }

  // Obtener lista única de actividades con reservas
  const actividadesConReservas = useMemo(() => {
    const actividadIds = [...new Set(reservas.map(r => r.actividadId))]
    return actividadIds
      .map(id => actividades.find(a => a.id === id))
      .filter(Boolean)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  }, [reservas, actividades])

  // Aplicar filtros
  const reservasFiltradas = useMemo(() => {
    let resultado = reservas.filter(r => {
      // Filtro de actividad
      if (filtroActividad !== 'todas' && r.actividadId !== parseInt(filtroActividad)) return false
      
      // Filtro de estado
      if (filtroEstado !== 'todas' && r.estado !== filtroEstado) return false
      
      return true
    })

    // Ordenar por fecha de reserva (más recientes primero)
    resultado.sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva))

    return resultado
  }, [reservas, filtroActividad, filtroEstado])

  const limpiarFiltros = () => {
    setFiltroActividad('todas')
    setFiltroEstado('todas')
  }

  const cambiarEstado = (reservaId, nuevoEstado) => {
    setReservas(prev => prev.map(r => 
      r.id === reservaId ? { ...r, estado: nuevoEstado } : r
    ))
  }

  const eliminarReserva = (reservaId) => {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      setReservas(prev => prev.filter(r => r.id !== reservaId))
    }
  }

  const estadoColor = (estado) => {
    switch(estado) {
      case 'pendiente': return '#ff9800'
      case 'confirmada': return '#4caf50'
      case 'cancelada': return '#f44336'
      default: return '#757575'
    }
  }

  const estadoEmoji = (estado) => {
    switch(estado) {
      case 'pendiente': return '⏳'
      case 'confirmada': return '✅'
      case 'cancelada': return '❌'
      default: return '📋'
    }
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
        maxWidth: '1400px',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
          color: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '20px 20px 0 0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>📅 Gestión de Reservas</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                {reservasFiltradas.length} {reservasFiltradas.length === reservas.length ? '' : `de ${reservas.length}`} reservas
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

        {/* Filtros */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Filtro por Actividad */}
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: '1', minWidth: '300px' }}>
            <strong style={{ fontSize: '0.9rem', color: '#666' }}>🥾 Actividad:</strong>
            <select
              value={filtroActividad}
              onChange={(e) => setFiltroActividad(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="todas">Todas las actividades</option>
              {actividadesConReservas.map(act => (
                <option key={act.id} value={act.id.toString()}>
                  {act.titulo} ({reservas.filter(r => r.actividadId === act.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '0.9rem', color: '#666' }}>📊 Estado:</strong>
            <button
              onClick={() => setFiltroEstado('todas')}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: filtroEstado === 'todas' ? '#1e3a5f' : '#f5f5f5',
                color: filtroEstado === 'todas' ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroEstado('pendiente')}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: filtroEstado === 'pendiente' ? '#ff9800' : '#f5f5f5',
                color: filtroEstado === 'pendiente' ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              ⏳ Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado('confirmada')}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: filtroEstado === 'confirmada' ? '#4caf50' : '#f5f5f5',
                color: filtroEstado === 'confirmada' ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              ✅ Confirmadas
            </button>
            <button
              onClick={() => setFiltroEstado('cancelada')}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: filtroEstado === 'cancelada' ? '#f44336' : '#f5f5f5',
                color: filtroEstado === 'cancelada' ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              ❌ Canceladas
            </button>
          </div>

          {/* Botón Limpiar Filtros */}
          {(filtroActividad !== 'todas' || filtroEstado !== 'todas') && (
            <button
              onClick={limpiarFiltros}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
            >
              🗑️ Limpiar
            </button>
          )}
        </div>

        {/* Lista de Reservas */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem'
        }}>
          {reservasFiltradas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#999'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {filtroActividad !== 'todas' || filtroEstado !== 'todas' ? '🔍' : '📭'}
              </div>
              <h3 style={{ color: '#666' }}>
                {filtroActividad !== 'todas' || filtroEstado !== 'todas' 
                  ? 'No se encontraron reservas con estos filtros' 
                  : 'No hay reservas'}
              </h3>
              <p>
                {filtroActividad !== 'todas' || filtroEstado !== 'todas'
                  ? 'Intenta ajustar los filtros para ver más resultados'
                  : 'Las reservas que recibas aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {reservasFiltradas.map(reserva => {
                  const actividad = obtenerActividad(reserva.actividadId)
                  return (
                    <div
                      key={reserva.id}
                      style={{
                        backgroundColor: 'white',
                        border: `2px solid ${estadoColor(reserva.estado)}`,
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Estado Badge */}
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: estadoColor(reserva.estado),
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                      }}>
                        {estadoEmoji(reserva.estado)} {reserva.estado.toUpperCase()}
                      </div>

                      {/* Actividad Info */}
                      {actividad && (
                        <div style={{
                          backgroundColor: '#f5f5f5',
                          padding: '1rem',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          <h4 style={{ 
                            margin: '0 0 0.5rem 0', 
                            color: '#1e3a5f',
                            fontSize: '1.1rem'
                          }}>
                            🥾 {actividad.titulo}
                          </h4>
                          <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#666' }}>
                            📅 {formatearFecha(actividad.fecha)}
                          </p>
                          <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#666' }}>
                            📍 {actividad.descripcion}
                          </p>
                          <p style={{ 
                            margin: '0.3rem 0', 
                            color: '#1e3a5f', 
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}>
                            💰 {actividad.precio}
                          </p>
                        </div>
                      )}

                      {/* Cliente Info */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ margin: '0 0 0.8rem 0', color: '#1e3a5f' }}>
                          👤 Datos del Cliente
                        </h5>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Nombre:</strong> {reserva.nombre}
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Email:</strong> <a href={`mailto:${reserva.email}`} style={{ color: '#2196f3' }}>{reserva.email}</a>
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Teléfono:</strong> <a href={`tel:${reserva.telefono}`} style={{ color: '#2196f3' }}>{reserva.telefono}</a>
                        </p>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>
                          <strong>Personas:</strong> 👥 {reserva.cantidadPersonas}
                        </p>
                      </div>

                      {/* Mensaje */}
                      {reserva.mensaje && (
                        <div style={{
                          backgroundColor: '#f0f7ff',
                          padding: '0.8rem',
                          borderRadius: '6px',
                          marginBottom: '1rem',
                          fontSize: '0.85rem',
                          color: '#666',
                          borderLeft: '3px solid #2196f3'
                        }}>
                          <strong>💬 Mensaje:</strong><br />
                          {reserva.mensaje}
                        </div>
                      )}

                      {/* Fecha de Reserva */}
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#999',
                        marginBottom: '1rem'
                      }}>
                        🕒 Reservado: {new Date(reserva.fechaReserva).toLocaleString('es-ES')}
                      </p>

                      {/* Acciones */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {reserva.estado === 'pendiente' && (
                          <button
                            onClick={() => cambiarEstado(reserva.id, 'confirmada')}
                            style={{
                              flex: 1,
                              padding: '0.6rem',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
                          >
                            ✅ Confirmar
                          </button>
                        )}
                        {reserva.estado !== 'cancelada' && (
                          <button
                            onClick={() => cambiarEstado(reserva.id, 'cancelada')}
                            style={{
                              flex: 1,
                              padding: '0.6rem',
                              backgroundColor: '#ff9800',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fb8c00'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ff9800'}
                          >
                            ❌ Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => eliminarReserva(reserva.id)}
                          style={{
                            padding: '0.6rem',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#e53935'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reservas
