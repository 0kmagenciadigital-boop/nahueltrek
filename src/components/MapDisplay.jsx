/**
 * MapDisplay Component
 * Muestra un mapa estático de solo lectura con un marcador
 * Usado en las cards de lugares para visualizar ubicación
 */

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const MapDisplay = ({ lat, lng, title, zoom = 13 }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return null // No mostrar nada si no hay API key
  }

  if (!lat || !lng) {
    return (
      <div style={{
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        📍 Sin ubicación definida
      </div>
    )
  }

  const center = { lat, lng }

  const mapContainerStyle = {
    width: '100%',
    height: '250px',
    borderRadius: '8px'
  }

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    gestureHandling: 'none' // Desactivar gestos
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={
          <div style={{
            ...mapContainerStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f0f0'
          }}>
            Cargando mapa...
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          <Marker
            position={center}
            title={title}
          />
        </GoogleMap>
      </LoadScript>

      {/* Botón para abrir en Google Maps */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#4285f4',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#3367d6'}
          onMouseLeave={(e) => e.target.style.background = '#4285f4'}
        >
          🗺️ Ver en Google Maps
        </a>
      </div>
    </div>
  )
}

export default MapDisplay
