/**
 * MapPicker Component
 * Selector interactivo de ubicación con mapa de Google Maps
 * Permite buscar lugares, hacer clic en el mapa, arrastrar marker
 */

import { useState, useCallback, useRef } from 'react'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'

const libraries = ['places']

const MapPicker = ({ initialLat, initialLng, onLocationSelect }) => {
  const [center, setCenter] = useState({
    lat: initialLat || -41.1335, // Bariloche por defecto
    lng: initialLng || -71.3103
  })
  
  const [markerPosition, setMarkerPosition] = useState(center)
  const [address, setAddress] = useState('')
  const autocompleteRef = useRef(null)
  const mapRef = useRef(null)

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#856404' }}>
          ⚠️ Google Maps API Key no configurada.<br/>
          Agrega <code>VITE_GOOGLE_MAPS_API_KEY</code> al archivo .env
        </p>
      </div>
    )
  }

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  }

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true
  }

  // Maneja click en el mapa
  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    
    setMarkerPosition({ lat, lng })
    
    // Geocoding reverso para obtener dirección
    reverseGeocode(lat, lng)
  }, [])

  // Maneja arrastre del marker
  const handleMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    
    setMarkerPosition({ lat, lng })
    reverseGeocode(lat, lng)
  }, [])

  // Geocoding reverso: coordenadas → dirección
  const reverseGeocode = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder()
      const response = await geocoder.geocode({ location: { lat, lng } })
      
      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address
        setAddress(formattedAddress)
        
        // Notificar al padre
        if (onLocationSelect) {
          onLocationSelect(lat, lng, formattedAddress)
        }
      }
    } catch (error) {
      console.error('Error en geocoding reverso:', error)
    }
  }

  // Maneja selección de lugar desde autocomplete
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      
      if (place.geometry) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        
        setCenter({ lat, lng })
        setMarkerPosition({ lat, lng })
        setAddress(place.formatted_address || '')
        
        // Centrar mapa en el lugar
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(15)
        }
        
        if (onLocationSelect) {
          onLocationSelect(lat, lng, place.formatted_address || '')
        }
      }
    }
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        loadingElement={<div style={{ padding: '20px', textAlign: 'center' }}>Cargando mapa...</div>}
      >
        {/* Buscador de lugares */}
        <div style={{ marginBottom: '10px' }}>
          <Autocomplete
            onLoad={(autocomplete) => { autocompleteRef.current = autocomplete }}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="🔍 Buscar lugar (ej: Cerro Catedral, Bariloche)"
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '15px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </Autocomplete>
        </div>

        {/* Mapa */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
          options={mapOptions}
          onLoad={(map) => { mapRef.current = map }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            animation={window.google?.maps?.Animation?.DROP}
          />
        </GoogleMap>

        {/* Info de ubicación actual */}
        {address && (
          <div style={{
            marginTop: '10px',
            padding: '12px 15px',
            background: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>📍 Ubicación seleccionada:</strong><br/>
            {address}<br/>
            <small style={{ color: '#666' }}>
              Lat: {markerPosition.lat.toFixed(6)}, Lng: {markerPosition.lng.toFixed(6)}
            </small>
          </div>
        )}

        {/* Instrucciones */}
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666'
        }}>
          💡 <strong>Tip:</strong> Haz clic en el mapa, arrastra el marcador o busca un lugar por nombre
        </div>
      </LoadScript>
    </div>
  )
}

export default MapPicker
