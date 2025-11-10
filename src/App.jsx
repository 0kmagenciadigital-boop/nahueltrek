import './App.css'
import logo from './assets/logo.png'
import { useState, useEffect } from 'react'
import Admin from './components/Admin'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null)
  const [carruselIndex, setCarruselIndex] = useState({})
  const [adminAbierto, setAdminAbierto] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  
  const PASSWORD_ADMIN = 'nahueltrek2025' // Cambiar por una contraseña segura
  
  // Cargar actividades desde localStorage
  const actividadesIniciales = [
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

  const [actividades, setActividades] = useState(() => {
    const saved = localStorage.getItem('nahueltrek_actividades')
    return saved ? JSON.parse(saved) : actividadesIniciales
  })

  // Guardar actividades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('nahueltrek_actividades', JSON.stringify(actividades))
  }, [actividades])

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
  }

  const abrirFormulario = (actividad) => {
    setActividadSeleccionada(actividad)
    setFormularioAbierto(true)
  }

  const cerrarFormulario = () => {
    setFormularioAbierto(false)
    setActividadSeleccionada(null)
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
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

Mensaje:
${formData.mensaje || 'Sin mensaje adicional'}

---
    `.trim()
    
    // Abrir cliente de correo
    const mailtoLink = `mailto:nahueltrek@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
    
    // Cerrar modal después de un pequeño delay
    setTimeout(() => {
      cerrarFormulario()
    }, 500)
  }

  return (
    <div className="App" style={{ margin: 0, padding: 0, backgroundColor: '#f8f9fa' }}>
      <nav className="gradient-bg" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="fade-in">
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
      <section id="actividades" style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem auto',
        padding: '2rem',
      }} className="fade-in">
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📅 Próximas Actividades
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {actividades.map((actividad) => {
            const currentImageIndex = carruselIndex[actividad.id] || 0
            
            return (
              <div 
                key={actividad.id} 
                className="card-hover"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {/* Carrusel de imágenes */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}>
                  <img 
                    src={actividad.imagenes[currentImageIndex]}
                    alt={actividad.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Controles del carrusel */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      anteriorImagen(actividad.id, actividad.imagenes.length)
                    }}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                  >
                    ‹
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      siguienteImagen(actividad.id, actividad.imagenes.length)
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                  >
                    ›
                  </button>

                  {/* Indicadores de imagen */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    {actividad.imagenes.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      />
                    ))}
                  </div>
                  
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
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    📍 {actividad.descripcion}
                  </p>
                  
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
            )
          })}
        </div>
      </section>

      {/* Sección NDR */}
      <section id="ndr" style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '1.5rem' }}>
          🏕️ Los 7 Principios de "No Deje Rastro" (NDR)
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
          El programa No Deje Rastro (Leave No Trace) ofrece una guía sencilla para minimizar nuestro impacto en los ambientes naturales. Aplicar estos principios es esencial para la conservación y el disfrute de la naturaleza por todos.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>1. Planifique y prepare su viaje con anticipación.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Investigue el área y las regulaciones locales.</li>
              <li>Lleve el equipo adecuado para el clima y el terreno.</li>
              <li>Reempaque los alimentos para reducir la basura y lleve bolsas para recoger todos sus desechos.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>2. Viaje y acampe sobre superficies durables.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Use siempre los senderos y sitios de campamento ya establecidos.</li>
              <li>Evite caminar o acampar en vegetación frágil o áreas sensibles como praderas alpinas.</li>
              <li>Mantenga los sitios de acampada pequeños para minimizar el impacto.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>3. Disponga de los desechos de la manera más apropiada.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Empaque toda su basura (incluyendo restos de comida, cáscaras y papel higiénico) y llévela de vuelta.</li>
              <li>Deposite los desechos humanos a 60-70 metros (200 pies) de fuentes de agua, senderos o campamentos, cavando un "hoyo de gato" de 15-20 cm de profundidad.</li>
              <li>Lave platos y asee su cuerpo a 60 metros de distancia de fuentes de agua.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>4. Deje lo que encuentre.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>No recoja ni se lleve objetos naturales o culturales (rocas, plantas, artefactos, conchas).</li>
              <li>Evite construir estructuras, cavar zanjas o alterar el sitio de cualquier forma.</li>
              <li>Deje los objetos naturales y el entorno tal como los encontró.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>5. Minimice el impacto de las fogatas.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Considere usar una cocinilla o estufa de campamento para cocinar.</li>
              <li>Si hace fuego, use los anillos o áreas designadas para fogatas.</li>
              <li>Mantenga las fogatas pequeñas y use solo leña caída y muerta del suelo. Nunca corte árboles vivos.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>6. Respete la vida silvestre.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Observe a los animales desde una distancia segura.</li>
              <li>Nunca alimente a los animales, ya que esto daña su salud y altera su comportamiento natural.</li>
              <li>Guarde la comida y la basura de manera segura para evitar atraer a la fauna.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>7. Sea considerado con otros visitantes.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Ceda el paso en los senderos y sea cortés.</li>
              <li>Evite el ruido excesivo para permitir que otros disfruten de los sonidos de la naturaleza.</li>
              <li>Mantenga a sus mascotas bajo control o evite llevarlas si no están permitidas.</li>
            </ul>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a5f' }}>
          Protejamos y disfrutemos juntos de nuestro mundo natural.
        </p>
      </section>

      {/* Footer */}
      <footer id="contacto" style={{
        backgroundColor: '#1e3a5f',
        color: 'white',
        padding: '2rem',
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>© 2025 Nahueltrek - Todos los derechos reservados</p>
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
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
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

      {/* Panel de Administración */}
      {adminAbierto && autenticado && (
        <Admin 
          actividades={actividades}
          setActividades={setActividades}
          onCerrar={cerrarAdmin}
        />
      )}
    </div>
  )
}

export default App
