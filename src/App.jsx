import './App.css'
import logo from './assets/logo.png'
import { useState, useEffect } from 'react'
import Admin from './components/Admin'
import Reservas from './components/Reservas'
import Destinos from './components/Destinos'

// Importar imágenes NDR
import ndr1 from '../img/025ebb3e-a026-4ff8-b944-4460656eb26e.jfif'
import ndr2 from '../img/5eb8231e-9e88-4075-9eee-5b88f0638a57.jfif'
import ndr3 from '../img/8b79bfad-492d-4ecd-9999-f7d2e976fb46.jfif'
import ndr4 from '../img/c73fb977-c565-496b-b591-54b3e9a10e8a.jfif'
import ndr5 from '../img/c75d4c7f-4b37-4ba6-8af5-c0292a86ba26.jfif'
import ndr6 from '../img/d6a66ad7-3bbb-498c-b8d1-a33d65726a94.jfif'
import ndr7 from '../img/1e33a31e-d9fc-4aa7-b8a1-1109f8cff0df.jfif'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null)
  const [carruselIndex, setCarruselIndex] = useState({})
  const [imagenesVersion, setImagenesVersion] = useState(0) // Para forzar recarga de imágenes
  const [adminAbierto, setAdminAbierto] = useState(false)
  const [reservasAbierto, setReservasAbierto] = useState(false)
  const [destinosAbierto, setDestinosAbierto] = useState(false)
  const [mostrarModalContacto, setMostrarModalContacto] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [lugares, setLugares] = useState([])
  const [cargandoLugares, setCargandoLugares] = useState(true)
  const [reservas, setReservas] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cantidadPersonas: '1',
    mensaje: ''
  })
  
  const PASSWORD_ADMIN = 'nahueltrek2025' // Cambiar por una contraseña segura
  const VERSION_ACTIVIDADES = 'v3.0' // Versión del calendario - Nov + Dic 2025
  
  // Cargar actividades desde localStorage
  const actividadesIniciales = [
    // NOVIEMBRE 2025
    {
      id: 101,
      fecha: '2025-11-15',
      titulo: 'Trekking PN Nahuelbuta',
      descripcion: 'Sendero Coihue - 9 km (ida-vuelta)',
      dificultad: 'Medio',
      precio: '$42,000',
      imagenes: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800'
      ]
    },
    {
      id: 102,
      fecha: '2025-11-16',
      titulo: 'Trekking Salto del Indio',
      descripcion: 'Cascada + Bosque Nativo - 7 km',
      dificultad: 'Bajo',
      precio: '$38,000',
      imagenes: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
      ]
    },
    {
      id: 103,
      fecha: '2025-11-22',
      titulo: 'Trekking PN Conguillio',
      descripcion: 'Laguna Arcoiris - 12 km (ida-vuelta)',
      dificultad: 'Medio',
      precio: '$47,000',
      imagenes: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800'
      ]
    },
    {
      id: 104,
      fecha: '2025-11-23',
      titulo: 'Trekking PN Tolhuaca',
      descripcion: 'Sendero Salto Malleco - 10 km',
      dificultad: 'Medio',
      precio: '$45,000',
      imagenes: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
      ]
    },
    {
      id: 105,
      fecha: '2025-11-29',
      titulo: 'Trekking Laguna Pirquinco',
      descripcion: '16 km (ida-vuelta) - Aventura',
      dificultad: 'Medio - Alto',
      precio: '$52,000',
      imagenes: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'
      ]
    },
    {
      id: 106,
      fecha: '2025-11-30',
      titulo: 'Trekking Termas Alpehue',
      descripcion: 'Sendero Termal - 8 km + Relax',
      dificultad: 'Bajo',
      precio: '$48,000',
      imagenes: [
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800'
      ]
    },
    // DICIEMBRE 2025
    {
      id: 1,
      fecha: '2025-12-06',
      titulo: 'Trekking PN Nahuelbuta',
      descripcion: 'Sendero Piedra del Águila - 12 km',
      dificultad: 'Medio',
      precio: '$45,000',
      imagenes: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800'
      ]
    },
    {
      id: 2,
      fecha: '2025-12-07',
      titulo: 'Trekking PN Conguillio',
      descripcion: 'Volcán Llaima - 18 km (ida-vuelta)',
      dificultad: 'Alto',
      precio: '$55,000',
      imagenes: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800'
      ]
    },
    {
      id: 3,
      fecha: '2025-12-13',
      titulo: 'Trekking PN Nahuelbuta',
      descripcion: 'Circuito Araucarias Milenarias - 10 km',
      dificultad: 'Medio',
      precio: '$45,000',
      imagenes: [
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800'
      ]
    },
    {
      id: 4,
      fecha: '2025-12-20',
      titulo: 'Trekking Termas Alpehue',
      descripcion: 'Sendero Termal - 8 km + Relax',
      dificultad: 'Bajo',
      precio: '$50,000',
      imagenes: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
      ]
    },
    {
      id: 5,
      fecha: '2025-12-21',
      titulo: 'Trekking PN Tolhuaca',
      descripcion: 'Laguna Malleco - 14 km (ida-vuelta)',
      dificultad: 'Medio - Alto',
      precio: '$48,000',
      imagenes: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
      ]
    },
    {
      id: 6,
      fecha: '2025-12-26',
      titulo: 'Trekking PN Nahuelbuta - Especial Navidad',
      descripcion: 'Cerro Anay - 16 km (ida-vuelta)',
      dificultad: 'Medio - Alto',
      precio: '$52,000',
      imagenes: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800'
      ]
    },
    {
      id: 7,
      fecha: '2025-12-27',
      titulo: 'Trekking Laguna Pirquinco',
      descripcion: '20 km (ida-vuelta) - Aventura Total',
      dificultad: 'Alto',
      precio: '$58,000',
      imagenes: [
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800'
      ]
    },
    {
      id: 8,
      fecha: '2025-12-28',
      titulo: 'City Tour Santiago',
      descripcion: 'Cerro San Cristóbal + Centro Histórico',
      dificultad: 'Bajo',
      precio: '$35,000',
      imagenes: [
        'https://images.unsplash.com/photo-1570708938230-cb0b55a67e2e?w=800',
        'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800',
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
      ]
    }
  ]

  const [actividades, setActividades] = useState(actividadesIniciales)
  const [cargando, setCargando] = useState(true)

  // Cargar actividades
  useEffect(() => {
    const cargarActividades = async () => {
      console.log('✅ Cargando actividades')
      setActividades(actividadesIniciales)
      setCargando(false)
      
      // Nota: En producción con Google Sheets, aquí se cargaría desde Sheets
      // const sheetsService = new SheetsService()
      // const data = await sheetsService.getActividades()
      // setActividades(data)
    }
    
    cargarActividades()
  }, [])

  // Cargar lugares desde JSON local o localStorage
  useEffect(() => {
    const cargarLugares = async () => {
      try {
        // Intentar cargar desde localStorage primero
        const lugaresGuardados = localStorage.getItem('lugares')
        if (lugaresGuardados) {
          console.log('📍 Cargando lugares desde localStorage...')
          const data = JSON.parse(lugaresGuardados)
          console.log('✅ Lugares cargados desde localStorage:', data.length)
          setLugares(data)
        } else {
          console.log('📍 Cargando lugares desde JSON local...')
          const lugaresLocal = await import('../data/lugares.json')
          const data = lugaresLocal.default || []
          console.log('✅ Lugares cargados:', data.length)
          setLugares(data)
          localStorage.setItem('lugares', JSON.stringify(data))
        }
        
        // Nota: En producción con Google Sheets, usar:
        // const sheetsService = new SheetsService()
        // const data = await sheetsService.getLugares()
        // setLugares(data)
      } catch (error) {
        console.error('❌ Error al cargar lugares:', error)
        setLugares([])
      } finally {
        setCargandoLugares(false)
      }
    }
    
    cargarLugares()
  }, [])

  // Cargar reservas desde JSON local
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        console.log('📅 Cargando reservas desde JSON local...')
        const reservasLocal = await import('../data/reservas.json')
        const data = reservasLocal.default || []
        console.log('✅ Reservas cargadas:', data.length)
        setReservas(data)
        
        // Nota: En producción con Google Sheets, usar:
        // const sheetsService = new SheetsService()
        // const data = await sheetsService.getReservas()
        // setReservas(data)
      } catch (error) {
        console.error('❌ Error al cargar reservas:', error)
        setReservas([])
      }
    }
    
    cargarReservas()
  }, [])

  // Guardar reservas cuando cambien
  useEffect(() => {
    if (reservas.length > 0) {
      console.log('💾 Reservas actualizadas en memoria:', reservas.length)
      // En producción con Google Sheets:
      // const sheetsService = new SheetsService()
      // await sheetsService.updateReservas(reservas)
    }
  }, [reservas])

  // Guardar lugares cuando cambien
  useEffect(() => {
    if (lugares.length > 0) {
      console.log('💾 Lugares actualizados en memoria:', lugares.length)
      localStorage.setItem('lugares', JSON.stringify(lugares))
      // En producción con Google Sheets:
      // const sheetsService = new SheetsService()
      // await sheetsService.updateLugares(lugares)
    }
  }, [lugares])

  // Guardar actividades
  useEffect(() => {
    if (!cargando && actividades.length > 0) {
      console.log('💾 Actividades actualizadas en memoria:', actividades.length)
      // En producción con Google Sheets:
      // const sheetsService = new SheetsService()
      // await sheetsService.updateActividades(actividades)
    }
  }, [actividades, cargando])

  const formatearFecha = (fecha) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones)
  }

  const getDificultadColor = (dificultad) => {
    switch(dificultad) {
      case 'Bajo': return '#4caf50'
      case 'Medio': return '#ff9800'
      case 'Medio - Alto': return '#ff6b35'
      case 'Alto': return '#f44336'
      default: return '#757575'
    }
  }

  const siguienteImagen = (actividadId, totalImagenes) => {
    setCarruselIndex(prev => ({
      ...prev,
      [actividadId]: ((prev[actividadId] || 0) + 1) % totalImagenes
    }))
  }

  const anteriorImagen = (actividadId, totalImagenes) => {
    setCarruselIndex(prev => ({
      ...prev,
      [actividadId]: ((prev[actividadId] || 0) - 1 + totalImagenes) % totalImagenes
    }))
  }

  const intentarLogin = () => {
    if (passwordInput === PASSWORD_ADMIN) {
      setAutenticado(true)
      setAdminAbierto(true)
      setMostrarLogin(false)
      setPasswordInput('')
    } else {
      alert('Contraseña incorrecta')
      setPasswordInput('')
    }
  }

  const cerrarAdmin = () => {
    setAdminAbierto(false)
  }

  const cerrarSesion = () => {
    setAutenticado(false)
    setAdminAbierto(false)
    setReservasAbierto(false)
  }

  const resetearActividades = async () => {
    if (confirm('¿Estás seguro de resetear las actividades a las predeterminadas?')) {
      setActividades(actividadesIniciales)
      console.log('✅ Actividades reseteadas a valores iniciales')
      alert('Actividades reseteadas exitosamente')
    }
  }

  // Agrupar actividades por mes
  const agruparPorMes = () => {
    const meses = {}
    actividades.forEach(actividad => {
      const fecha = new Date(actividad.fecha + 'T00:00:00')
      const mesAnio = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      
      if (!meses[mesKey]) {
        meses[mesKey] = {
          nombre: mesAnio.charAt(0).toUpperCase() + mesAnio.slice(1),
          actividades: []
        }
      }
      meses[mesKey].actividades.push(actividad)
    })
    
    // Ordenar por fecha (mes)
    return Object.entries(meses)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => value)
  }

  const abrirFormulario = (actividad) => {
    setActividadSeleccionada(actividad)
    setFormularioAbierto(true)
  }

  const cerrarFormulario = () => {
    setFormularioAbierto(false)
    setActividadSeleccionada(null)
    setFormData({ nombre: '', email: '', telefono: '', cantidadPersonas: '1', mensaje: '' })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Crear nueva reserva
    const nuevaReserva = {
      id: Date.now(),
      actividadId: actividadSeleccionada.id,
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      cantidadPersonas: formData.cantidadPersonas,
      mensaje: formData.mensaje,
      estado: 'pendiente',
      fechaReserva: new Date().toISOString()
    }
    
    // Guardar reserva
    setReservas(prev => [...prev, nuevaReserva])
    console.log('✅ Reserva creada:', nuevaReserva)
    
    // Construir el contenido del email
    const subject = `Reserva: ${actividadSeleccionada.titulo}`
    const body = `
NUEVA RESERVA DE ACTIVIDAD

Actividad: ${actividadSeleccionada.titulo}
Fecha: ${formatearFecha(actividadSeleccionada.fecha)}
Lugar: ${actividadSeleccionada.descripcion}
Precio: ${actividadSeleccionada.precio}

--- DATOS DEL CLIENTE ---

Nombre: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono}
Cantidad de Personas: ${formData.cantidadPersonas}

Mensaje:
${formData.mensaje || 'Sin mensaje adicional'}

---
    `.trim()
    
    // Abrir cliente de correo
    const mailtoLink = `mailto:nahueltrek@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
    
    // Mostrar mensaje de éxito
    alert('✅ Reserva creada exitosamente\n\nLa reserva ha sido guardada y se abrirá tu cliente de correo para confirmar.')
    
    // Cerrar modal después de un pequeño delay
    setTimeout(() => {
      cerrarFormulario()
    }, 500)
  }

  return (
    <div className="App" style={{ margin: 0, padding: 0, backgroundColor: '#f8f9fa' }}>
      {/* Indicador de carga */}
      {cargando && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5f8d 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <h3>Cargando actividades...</h3>
          </div>
        </div>
      )}

      <nav className="gradient-bg sticky-top" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        color: 'white',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="d-flex align-items-center fade-in" style={{ gap: '1rem' }}>
          <img 
            src={logo} 
            alt="Nahuel Trek Logo" 
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(255,255,255,0.3)',
              border: '2px solid rgba(255,255,255,0.5)'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>NahuelTrek</span>
          </div>
        </div>
        
        {/* Menú Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ul className="desktop-menu" style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2rem',
            margin: 0,
            padding: 0
          }}>
            <li><a href="#inicio" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>Inicio</a></li>
            <li><a href="#actividades" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>Actividades</a></li>
            <li><a href="#ndr" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>NDR</a></li>
            <li><a href="#contacto" style={{ color: 'white', textDecoration: 'none', transition: 'opacity 0.3s' }}>Contacto</a></li>
          </ul>

          {/* Botón Reservas */}
          {autenticado && (
            <button
              onClick={() => setReservasAbierto(true)}
              style={{
                padding: '0.6rem 1.2rem',
                background: reservas.filter(r => r.estado === 'pendiente').length > 0 
                  ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' 
                  : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📅 Reservas {reservas.length > 0 && `(${reservas.length})`}
              {reservas.filter(r => r.estado === 'pendiente').length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {reservas.filter(r => r.estado === 'pendiente').length}
                </span>
              )}
            </button>
          )}

          {/* Botón Destinos */}
          {autenticado && (
            <button
              onClick={() => setDestinosAbierto(true)}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📍 Destinos
            </button>
          )}

          {/* Botón Admin */}
          <button
            onClick={() => autenticado ? setAdminAbierto(true) : setMostrarLogin(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: autenticado ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {autenticado ? '🔧 Admin' : '🔒 Login'}
          </button>
        </div>

        {/* Botón Hamburguesa */}
        <button
          className="hamburger-menu"
          onClick={() => setMenuAbierto(!menuAbierto)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            position: 'relative'
          }}
          aria-label="Menú"
        >
          {/* Líneas del menú hamburguesa */}
          <div style={{
            width: '30px',
            height: '3px',
            backgroundColor: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: menuAbierto ? 'rotate(45deg) translateY(8px)' : 'rotate(0)',
            position: 'absolute',
            top: menuAbierto ? '50%' : '30%'
          }} />
          <div style={{
            width: '30px',
            height: '3px',
            backgroundColor: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            opacity: menuAbierto ? 0 : 1,
            position: 'absolute',
            top: '50%'
          }} />
          <div style={{
            width: '30px',
            height: '3px',
            backgroundColor: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: menuAbierto ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0)',
            position: 'absolute',
            top: menuAbierto ? '50%' : '70%'
          }} />
          
          {/* Decoración de montaña */}
          {!menuAbierto && (
            <div style={{
              position: 'absolute',
              bottom: '5px',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '6px solid #81c784',
              opacity: 0.7
            }} />
          )}
        </button>
      </nav>

      {/* Menú Mobile desplegable */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: menuAbierto ? 0 : '-100%',
        width: '70%',
        maxWidth: '300px',
        height: '100vh',
        backgroundColor: '#1e3a5f',
        transition: 'right 0.4s ease',
        zIndex: 999,
        paddingTop: '80px',
        boxShadow: menuAbierto ? '-4px 0 12px rgba(0,0,0,0.3)' : 'none',
        backgroundImage: `
          linear-gradient(135deg, transparent 0%, rgba(129, 199, 132, 0.1) 100%),
          radial-gradient(ellipse at bottom, rgba(129, 199, 132, 0.05) 0%, transparent 50%)
        `
      }}>
        {/* Decoración de montañas y araucarias */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          overflow: 'hidden',
          opacity: 0.2
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            width: 0,
            height: 0,
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderBottom: '70px solid #81c784'
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: '15%',
            width: 0,
            height: 0,
            borderLeft: '30px solid transparent',
            borderRight: '30px solid transparent',
            borderBottom: '55px solid #66bb6a'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            width: '3px',
            height: '30px',
            backgroundColor: '#4e342e'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '35px',
            left: 'calc(50% - 8px)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '15px solid #558b2f'
          }} />
        </div>

        <ul style={{
          listStyle: 'none',
          padding: '2rem',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <li>
            <a 
              href="#inicio" 
              onClick={() => setMenuAbierto(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'block',
                padding: '0.5rem',
                borderLeft: '3px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.borderLeft = '3px solid #81c784'}
              onMouseOut={(e) => e.target.style.borderLeft = '3px solid transparent'}
            >
              Inicio
            </a>
          </li>
          <li>
            <a 
              href="#actividades" 
              onClick={() => setMenuAbierto(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'block',
                padding: '0.5rem',
                borderLeft: '3px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.borderLeft = '3px solid #81c784'}
              onMouseOut={(e) => e.target.style.borderLeft = '3px solid transparent'}
            >
              Actividades
            </a>
          </li>
          <li>
            <a 
              href="#ndr" 
              onClick={() => setMenuAbierto(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'block',
                padding: '0.5rem',
                borderLeft: '3px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.borderLeft = '3px solid #81c784'}
              onMouseOut={(e) => e.target.style.borderLeft = '3px solid transparent'}
            >
              NDR
            </a>
          </li>
          <li>
            <a 
              href="#contacto" 
              onClick={() => setMenuAbierto(false)}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.2rem',
                display: 'block',
                padding: '0.5rem',
                borderLeft: '3px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.borderLeft = '3px solid #81c784'}
              onMouseOut={(e) => e.target.style.borderLeft = '3px solid transparent'}
            >
              Contacto
            </a>
          </li>
        </ul>
      </div>

      {/* Overlay oscuro cuando el menú está abierto */}
      {menuAbierto && (
        <div 
          onClick={() => setMenuAbierto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            transition: 'opacity 0.3s'
          }}
        />
      )}
      
      <div id="inicio" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <img src={logo} alt="Nahuel Trek Logo" style={{ width: 'clamp(150px, 40vw, 200px)', marginBottom: '20px' }} />
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>Bienvenido a Nahueltrek</h1>
        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>Tu aventura comienza aquí</p>
      </div>

      {/* Sección de Calendario de Actividades */}
      <section id="actividades" className="container-fluid px-3 px-md-4 py-5 fade-in">
        <div className="container">
          <h2 className="text-center mb-5" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📅 Próximas Actividades
          </h2>
          
          {agruparPorMes().map((grupo, idx) => (
            <div key={idx} className="mb-5">
              <h3 className="mb-4 pb-2" style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: '#1e3a5f',
                borderBottom: '3px solid #ff9800',
                display: 'inline-block',
                paddingBottom: '0.5rem'
              }}>
                {grupo.nombre}
              </h3>
              
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {grupo.actividades.map((actividad) => (
                <div key={actividad.id} className="col">
                  <div 
                    className="card h-100 card-hover"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                {/* Imagen de la actividad */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}>
                  <img 
                    key={`${actividad.id}-${imagenesVersion}`}
                    src={`${actividad.imagen || actividad.imagenes?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Imagen'}${(actividad.imagen || actividad.imagenes?.[0] || '').includes('/uploads/') ? '?v=' + imagenesVersion : ''}`}
                    alt={actividad.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Badge de fecha flotante */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(30, 58, 95, 0.95)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    color: '#1e3a5f', 
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                    fontWeight: '700'
                  }}>
                    {actividad.titulo}
                  </h3>
                  
                  <p style={{ 
                    color: '#666', 
                    marginBottom: '0.5rem',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    📍 {actividad.descripcion}
                  </p>

                  {actividad.lugarId && lugares.length > 0 && (() => {
                    const lugar = lugares.find(l => l.id === actividad.lugarId)
                    return lugar ? (
                      <p style={{ 
                        color: '#ff6b35', 
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        🗺️ {lugar.titulo}
                      </p>
                    ) : null
                  })()}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <div>
                      <span style={{
                        background: `linear-gradient(135deg, ${getDificultadColor(actividad.dificultad)}, ${getDificultadColor(actividad.dificultad)}dd)`,
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        🏔️ {actividad.dificultad}
                      </span>
                    </div>
                    
                    <div style={{ 
                      color: '#1e3a5f',
                      fontSize: '1.4rem',
                      fontWeight: 'bold'
                    }}>
                      {actividad.precio}
                    </div>
                  </div>
                
                  <button 
                    onClick={() => abrirFormulario(actividad)}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.9rem',
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
                    🎒 Reservar Ahora
                  </button>
                </div>
                </div>
              </div>
            ))
          }
          </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección NDR */}
      <section id="ndr" className="container my-5 py-4">
        <div className="bg-light rounded-3 p-4 p-md-5">
          <h2 className="text-center mb-4" style={{ color: '#1e3a5f' }}>
            🏕️ Los 7 Principios de "No Deje Rastro" (NDR)
          </h2>
          <p className="text-center mb-5 fs-5">
            El programa No Deje Rastro (Leave No Trace) ofrece una guía sencilla para minimizar nuestro impacto en los ambientes naturales. Aplicar estos principios es esencial para la conservación y el disfrute de la naturaleza por todos.
          </p>

          <div className="row g-4">
            {/* Principio 1 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr1}
                  alt="Planificación de viaje" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>1. Planifique y prepare su viaje con anticipación.</h3>
                  <ul className="lh-lg text-start">
                    <li>Investigue el área y las regulaciones locales.</li>
                    <li>Lleve el equipo adecuado para el clima y el terreno.</li>
                    <li>Reempaque los alimentos para reducir la basura y lleve bolsas para recoger todos sus desechos.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 2 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr2}
                  alt="Sendero establecido" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>2. Viaje y acampe sobre superficies durables.</h3>
                  <ul className="lh-lg text-start">
                    <li>Use siempre los senderos y sitios de campamento ya establecidos.</li>
                    <li>Evite caminar o acampar en vegetación frágil o áreas sensibles como praderas alpinas.</li>
                    <li>Mantenga los sitios de acampada pequeños para minimizar el impacto.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 3 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr3}
                  alt="Manejo de desechos" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>3. Disponga de los desechos de la manera más apropiada.</h3>
                  <ul className="lh-lg text-start">
                    <li>Empaque toda su basura (incluyendo restos de comida, cáscaras y papel higiénico) y llévela de vuelta.</li>
                    <li>Deposite los desechos humanos a 60-70 metros (200 pies) de fuentes de agua, senderos o campamentos, cavando un "hoyo de gato" de 15-20 cm de profundidad.</li>
                    <li>Lave platos y asee su cuerpo a 60 metros de distancia de fuentes de agua.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 4 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr4}
                  alt="Naturaleza intacta" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>4. Deje lo que encuentre.</h3>
                  <ul className="lh-lg text-start">
                    <li>No recoja ni se lleve objetos naturales o culturales (rocas, plantas, artefactos, conchas).</li>
                    <li>Evite construir estructuras, cavar zanjas o alterar el sitio de cualquier forma.</li>
                    <li>Deje los objetos naturales y el entorno tal como los encontró.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 5 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr5}
                  alt="Fogata responsable" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>5. Minimice el impacto de las fogatas.</h3>
                  <ul className="lh-lg text-start">
                    <li>Considere usar una cocinilla o estufa de campamento para cocinar.</li>
                    <li>Si hace fuego, use los anillos o áreas designadas para fogatas.</li>
                    <li>Mantenga las fogatas pequeñas y use solo leña caída y muerta del suelo. Nunca corte árboles vivos.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 6 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr6}
                  alt="Vida silvestre" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>6. Respete la vida silvestre.</h3>
                  <ul className="lh-lg text-start">
                    <li>Observe a los animales desde una distancia segura.</li>
                    <li>Nunca alimente a los animales, ya que esto daña su salud y altera su comportamiento natural.</li>
                    <li>Guarde la comida y la basura de manera segura para evitar atraer a la fauna.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Principio 7 */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <img 
                  src={ndr7}
                  alt="Visitantes en la naturaleza" 
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <h3 className="card-title h5 mb-3" style={{ color: '#1e3a5f' }}>7. Sea considerado con otros visitantes.</h3>
                  <ul className="lh-lg text-start">
                    <li>Ceda el paso en los senderos y sea cortés.</li>
                    <li>Evite el ruido excesivo para permitir que otros disfruten de los sonidos de la naturaleza.</li>
                    <li>Mantenga a sus mascotas bajo control o evite llevarlas si no están permitidas.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center mt-4 fs-5 fw-bold" style={{ color: '#1e3a5f' }}>
            Protejamos y disfrutemos juntos de nuestro mundo natural.
          </p>
        </div>
      </section>

      {/* Sección de Contacto */}
      <section id="contacto" className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="display-4 mb-3" style={{ color: '#1e3a5f', fontWeight: 'bold' }}>
            📞 Contacto
          </h2>
          <p className="lead text-muted">
            ¿Tienes alguna consulta? Completa el formulario y te responderemos pronto
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="card-body p-4">
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  const data = {
                    nombre: formData.get('nombre'),
                    telefono: formData.get('telefono'),
                    email: formData.get('email'),
                    destino: formData.get('destino'),
                    fecha: formData.get('fecha'),
                    cantidadPersonas: formData.get('cantidadPersonas'),
                    cantidadDias: formData.get('cantidadDias'),
                    requiereHospedaje: formData.get('requiereHospedaje') === 'si',
                    detalles: formData.get('detalles') || ''
                  }
                  
                  // Enviar email
                  const emailBody = `
Nueva Consulta de Contacto - Nahueltrek

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DATOS DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${data.nombre}
Teléfono: ${data.telefono}
Email: ${data.email}

🗺️ DETALLES DEL VIAJE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Destino: ${data.destino}
Fecha: ${new Date(data.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Cantidad de personas: ${data.cantidadPersonas}
Cantidad de días: ${data.cantidadDias}
Requiere hospedaje: ${data.requiereHospedaje ? '✅ Sí' : '❌ No'}

${data.detalles ? `📝 DETALLES ADICIONALES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.detalles}\n\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enviado desde: www.nahueltrek.com
Fecha de envío: ${new Date().toLocaleString('es-ES')}
                  `
                  
                  // Crear enlace mailto
                  const mailtoLink = `mailto:nahueltrek@gmail.com?subject=Nueva Consulta: ${data.nombre} - ${data.destino}&body=${encodeURIComponent(emailBody)}`
                  
                  // Abrir cliente de correo
                  window.open(mailtoLink, '_blank')
                  
                  // Mostrar modal de confirmación
                  setMostrarModalContacto(true)
                  e.target.reset()
                }}>
                  <div className="row g-3">
                    {/* Nombre */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        👤 Nombre completo *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        placeholder="Tu nombre"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        📱 Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        className="form-control"
                        placeholder="+56 9 1234 5678"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        📧 Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="tu@email.com"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Destino de Interés */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        📍 Destino de interés *
                      </label>
                      <select
                        name="destino"
                        className="form-select"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      >
                        <option value="">Selecciona un destino...</option>
                        {lugares.map(lugar => (
                          <option key={lugar.id} value={lugar.titulo}>
                            {lugar.titulo}
                          </option>
                        ))}
                        <option value="otro">Otro destino</option>
                      </select>
                    </div>

                    {/* Fecha */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        📅 Fecha aproximada *
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        className="form-control"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Cantidad de Personas */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        👥 Cant. personas *
                      </label>
                      <input
                        type="number"
                        name="cantidadPersonas"
                        className="form-control"
                        placeholder="1"
                        min="1"
                        max="50"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Cantidad de Días */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        🗓️ Cant. días *
                      </label>
                      <input
                        type="number"
                        name="cantidadDias"
                        className="form-control"
                        placeholder="1"
                        min="1"
                        max="30"
                        required
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Requiere Hospedaje */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        🏨 ¿Requiere hospedaje? *
                      </label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="requiereHospedaje"
                            id="hospedajeSi"
                            value="si"
                            required
                          />
                          <label className="form-check-label" htmlFor="hospedajeSi">
                            Sí
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="requiereHospedaje"
                            id="hospedajeNo"
                            value="no"
                            required
                          />
                          <label className="form-check-label" htmlFor="hospedajeNo">
                            No
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Detalles Adicionales */}
                    <div className="col-12">
                      <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                        📝 Detalles adicionales
                      </label>
                      <textarea
                        name="detalles"
                        className="form-control"
                        rows="4"
                        placeholder="Cuéntanos más sobre tu viaje, preferencias, necesidades especiales, etc."
                        style={{ borderRadius: '8px', padding: '0.6rem' }}
                      />
                    </div>

                    {/* Botón Enviar */}
                    <div className="col-12 text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-lg"
                        style={{
                          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '25px',
                          padding: '0.8rem 3rem',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 6px 20px rgba(30, 58, 95, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 4px 15px rgba(30, 58, 95, 0.3)'
                        }}
                      >
                        📨 Enviar consulta
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row g-4">
            {/* Columna 1: Información de Contacto */}
            <div className="col-md-4">
              <h5 className="mb-3" style={{ color: '#81c784', fontWeight: 'bold' }}>📍 Nahueltrek</h5>
              <p style={{ lineHeight: '1.8', color: '#ccc' }}>
                Turismo de aventura y trekking en Chile. 
                Conectando personas con la naturaleza.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ margin: '0.5rem 0', color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>📱 WhatsApp:</strong>{' '}
                  <a 
                    href="https://wa.me/56994543632" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#81c784', textDecoration: 'none' }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    +56 9 9454 3632
                  </a>
                </p>
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div className="col-md-4">
              <h5 className="mb-3" style={{ color: '#81c784', fontWeight: 'bold' }}>🔗 Enlaces</h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.8rem' }}>
                  <a 
                    href="#inicio" 
                    style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseOver={(e) => e.target.style.color = '#81c784'}
                    onMouseOut={(e) => e.target.style.color = '#ccc'}
                  >
                    Inicio
                  </a>
                </li>
                <li style={{ marginBottom: '0.8rem' }}>
                  <a 
                    href="#actividades" 
                    style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseOver={(e) => e.target.style.color = '#81c784'}
                    onMouseOut={(e) => e.target.style.color = '#ccc'}
                  >
                    Actividades
                  </a>
                </li>
                <li style={{ marginBottom: '0.8rem' }}>
                  <a 
                    href="#ndr" 
                    style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseOver={(e) => e.target.style.color = '#81c784'}
                    onMouseOut={(e) => e.target.style.color = '#ccc'}
                  >
                    No Deje Rastro
                  </a>
                </li>
                <li style={{ marginBottom: '0.8rem' }}>
                  <a 
                    href="#contacto" 
                    style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseOver={(e) => e.target.style.color = '#81c784'}
                    onMouseOut={(e) => e.target.style.color = '#ccc'}
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Redes Sociales */}
            <div className="col-md-4">
              <h5 className="mb-3" style={{ color: '#81c784', fontWeight: 'bold' }}>📱 Síguenos</h5>
              <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                Mantente al día con nuestras aventuras
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/nahueltrek"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#E4405F'
                    e.currentTarget.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>📷</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Instagram</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>@nahueltrek</div>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://web.facebook.com/nahueltrek"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2'
                    e.currentTarget.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Facebook</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>nahueltrek</div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/56994543632"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem 1rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'white',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366'
                    e.currentTarget.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>💬</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>WhatsApp</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>Contáctanos directo</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>
              © 2025 Nahueltrek - Todos los derechos reservados
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.85rem' }}>
              Hecho con 💚 para los amantes de la naturaleza
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Formulario de Reserva */}
      {formularioAbierto && (
        <>
          <div 
            onClick={cerrarFormulario}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem'
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: 'clamp(1.5rem, 4vw, 2rem)',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ 
                  color: '#1e3a5f', 
                  margin: 0,
                  fontSize: 'clamp(1.3rem, 4vw, 1.8rem)'
                }}>
                  Reservar Actividad
                </h2>
                <button 
                  onClick={cerrarFormulario}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '0',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  ×
                </button>
              </div>

              {actividadSeleccionada && (
                <>
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ 
                      color: '#1e3a5f', 
                      margin: '0 0 0.5rem 0',
                      fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
                    }}>
                      {actividadSeleccionada.titulo}
                    </h3>
                    <p style={{ margin: '0.3rem 0', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                      📅 {formatearFecha(actividadSeleccionada.fecha)}
                    </p>
                    <p style={{ margin: '0.3rem 0', color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                      📍 {actividadSeleccionada.descripcion}
                    </p>
                    <p style={{ 
                      margin: '0.3rem 0', 
                      color: '#1e3a5f', 
                      fontWeight: 'bold',
                      fontSize: 'clamp(1rem, 2.5vw, 1.2rem)'
                    }}>
                      💰 {actividadSeleccionada.precio}
                    </p>
                  </div>

                  {/* Botón de Reserva con Google Forms */}
                  {import.meta.env.VITE_GOOGLE_FORM_URL && (
                    <button
                      onClick={() => {
                        const formUrl = new URL(import.meta.env.VITE_GOOGLE_FORM_URL)
                        // Pre-llenar el campo de actividad (ajustar entry.XXXXX según tu formulario)
                        formUrl.searchParams.set('entry.1234567890', actividadSeleccionada.titulo)
                        window.open(formUrl.toString(), '_blank')
                      }}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#3367d6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#4285f4'}
                    >
                      🎫 Reservar con Google Forms
                    </button>
                  )}

                  {/* Divider */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '1.5rem 0',
                    color: '#999',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
                    <span style={{ padding: '0 1rem' }}>o contacta por email</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#1e3a5f',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Tu nombre"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#1e3a5f',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box'
                    }}
                    placeholder="tu@email.com"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#1e3a5f',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box'
                    }}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#1e3a5f',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Cantidad de Personas *
                  </label>
                  <input
                    type="number"
                    name="cantidadPersonas"
                    value={formData.cantidadPersonas}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Número de personas"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#1e3a5f',
                    fontWeight: 'bold',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Mensaje (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Preguntas o comentarios adicionales..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={cerrarFormulario}
                    style={{
                      flex: '1',
                      minWidth: '120px',
                      padding: '0.8rem',
                      backgroundColor: '#e0e0e0',
                      color: '#666',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: '1',
                      minWidth: '120px',
                      padding: '0.8rem',
                      backgroundColor: '#1e3a5f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Enviar Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Modal de Login Admin */}
      {mostrarLogin && !autenticado && (
        <div 
          onClick={() => setMostrarLogin(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ 
              color: '#1e3a5f', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              🔒 Acceso Admin
            </h2>

            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && intentarLogin()}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                marginBottom: '1rem',
                boxSizing: 'border-box'
              }}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setMostrarLogin(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={intentarLogin}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Contacto */}
      {mostrarModalContacto && (
        <div
          onClick={() => setMostrarModalContacto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Icono de éxito */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              animation: 'scaleIn 0.5s ease'
            }}>
              ✓
            </div>

            <h2 style={{
              color: '#1e3a5f',
              marginBottom: '1rem',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              ¡Consulta Enviada!
            </h2>

            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              Tu consulta ha sido enviada exitosamente. 
              Nos pondremos en contacto contigo pronto.
            </p>

            <button
              onClick={() => setMostrarModalContacto(false)}
              style={{
                padding: '0.8rem 2rem',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(30, 58, 95, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(30, 58, 95, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(30, 58, 95, 0.3)'
              }}
            >
              Cerrar
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(30px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes scaleIn {
              from { 
                transform: scale(0);
              }
              to { 
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}

      {/* Panel de Administración */}
      {adminAbierto && autenticado && (
        <Admin 
          actividades={actividades}
          setActividades={setActividades}
          lugares={lugares}
          onCerrar={cerrarAdmin}
          onResetear={resetearActividades}
          onActualizarImagenes={() => {
            // Solo incrementar versión cuando se guarden los cambios finales
            setImagenesVersion(prev => prev + 1)
            setCarruselIndex({})
          }}
        />
      )}

      {/* Panel de Gestión de Reservas */}
      {reservasAbierto && autenticado && (
        <Reservas 
          reservas={reservas}
          setReservas={setReservas}
          actividades={actividades}
          onCerrar={() => setReservasAbierto(false)}
        />
      )}

      {/* Panel de Gestión de Destinos */}
      {destinosAbierto && autenticado && (
        <Destinos 
          lugares={lugares}
          setLugares={setLugares}
          onCerrar={() => setDestinosAbierto(false)}
        />
      )}
    </div>
  )
}

export default App
