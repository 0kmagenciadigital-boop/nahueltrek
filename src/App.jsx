import './App.css'
import logo from './assets/logo.png'
import { useState } from 'react'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  
  // Datos de las próximas actividades
  const [actividades] = useState([
    {
      id: 1,
      fecha: '2025-11-08',
      titulo: 'Trekking Pastos Blancos - Conguillio',
      descripcion: '13 km (travesía)',
      dificultad: 'Medio - Alto',
      precio: '$55,000'
    },
    {
      id: 2,
      fecha: '2025-11-09',
      titulo: 'Trekking Sierra Nevada - Huerquehue',
      descripcion: '12 km (ida-vuelta)',
      dificultad: 'Medio',
      precio: '$40,000'
    },
    {
      id: 3,
      fecha: '2025-11-15',
      titulo: 'Trekking Volcán Sollipulli',
      descripcion: '21 km (ida-vuelta)',
      dificultad: 'Alto',
      precio: '$50,000'
    },
    {
      id: 4,
      fecha: '2025-11-22',
      titulo: 'Trekking Laguna Espejo - Nahuelbuta',
      descripcion: '16 km (ida-vuelta)',
      dificultad: 'Medio - Alto',
      precio: '$50,000'
    },
    {
      id: 5,
      fecha: '2025-11-23',
      titulo: 'Trekking Cerro San Sebastián',
      descripcion: '12 km (ida-vuelta)',
      dificultad: 'Alto',
      precio: '$40,000'
    }
  ])

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

  return (
    <div className="App" style={{ margin: 0, padding: 0 }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1e3a5f',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Nahuel Trek Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        </div>
        
        {/* Menú Desktop */}
        <ul className="desktop-menu" style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2rem',
          margin: 0,
          padding: 0
        }}>
          <li><a href="#inicio" style={{ color: 'white', textDecoration: 'none' }}>Inicio</a></li>
          <li><a href="#actividades" style={{ color: 'white', textDecoration: 'none' }}>Actividades</a></li>
          <li><a href="#ndr" style={{ color: 'white', textDecoration: 'none' }}>NDR</a></li>
          <li><a href="#contacto" style={{ color: 'white', textDecoration: 'none' }}>Contacto</a></li>
        </ul>

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
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '2rem' }}>
          📅 Próximas Actividades
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {actividades.map((actividad) => (
            <div key={actividad.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{
                backgroundColor: '#1e3a5f',
                color: 'white',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {formatearFecha(actividad.fecha)}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  color: '#1e3a5f', 
                  marginBottom: '0.5rem',
                  fontSize: '1.3rem'
                }}>
                  {actividad.titulo}
                </h3>
                
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>
                  {actividad.descripcion}
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
                      backgroundColor: getDificultadColor(actividad.dificultad),
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      Nivel {actividad.dificultad}
                    </span>
                  </div>
                  
                  <div style={{ 
                    color: '#1e3a5f',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    {actividad.precio}
                  </div>
                </div>
                
                <button style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.8rem',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a5f'}
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
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
    </div>
  )
}

export default App
