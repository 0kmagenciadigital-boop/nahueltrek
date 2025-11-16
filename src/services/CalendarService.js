/**
 * Google Calendar Service
 * Maneja eventos de actividades y reservas en Google Calendar
 * Permite sincronización automática y gestión de disponibilidad
 */

import { google } from 'googleapis'

class CalendarService {
  constructor() {
    this.calendar = null
    this.calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary'
    this.initialized = false
    this.authClient = null
  }

  /**
   * Inicializa el servicio de Google Calendar
   */
  async initialize() {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
      
      if (!clientId || !clientSecret) {
        console.warn('⚠️ Google Calendar no configurado. Funcionando sin calendario.')
        return false
      }

      // Crear cliente OAuth2
      const OAuth2 = google.auth.OAuth2
      this.authClient = new OAuth2(
        clientId,
        clientSecret,
        window.location.origin
      )

      // Cargar token guardado (compartido con otros servicios)
      const savedToken = localStorage.getItem('google_calendar_token') || 
                         localStorage.getItem('google_sheets_token')
      
      if (savedToken) {
        this.authClient.setCredentials(JSON.parse(savedToken))
        this.calendar = google.calendar({ version: 'v3', auth: this.authClient })
        this.initialized = true
        console.log('✅ Google Calendar inicializado')
        return true
      }

      console.log('ℹ️ Google Calendar requiere autenticación')
      return false
    } catch (error) {
      console.error('❌ Error inicializando Google Calendar:', error)
      return false
    }
  }

  /**
   * Autentica con Google OAuth (comparte autenticación con otros servicios)
   */
  async authenticate() {
    try {
      // Intentar usar token de otros servicios
      const token = localStorage.getItem('google_sheets_token') || 
                    localStorage.getItem('google_drive_token')
      
      if (token) {
        this.authClient.setCredentials(JSON.parse(token))
        localStorage.setItem('google_calendar_token', token)
        this.calendar = google.calendar({ version: 'v3', auth: this.authClient })
        this.initialized = true
        console.log('✅ Google Calendar autenticado con token existente')
        return true
      }

      // Si no hay token, seguir proceso de autenticación
      const scopes = [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly'
      ]
      
      const authUrl = this.authClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      })

      const authWindow = window.open(authUrl, 'Google Calendar Authorization', 'width=600,height=700')

      return new Promise((resolve, reject) => {
        const checkWindowClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkWindowClosed)
            reject(new Error('Ventana de autorización cerrada'))
          }
        }, 1000)

        window.addEventListener('message', async (event) => {
          if (event.data.type === 'google_auth_code') {
            clearInterval(checkWindowClosed)
            authWindow.close()

            try {
              const { tokens } = await this.authClient.getToken(event.data.code)
              this.authClient.setCredentials(tokens)
              localStorage.setItem('google_calendar_token', JSON.stringify(tokens))
              
              this.calendar = google.calendar({ version: 'v3', auth: this.authClient })
              this.initialized = true
              
              console.log('✅ Autenticación exitosa con Google Calendar')
              resolve(true)
            } catch (error) {
              reject(error)
            }
          }
        })
      })
    } catch (error) {
      console.error('❌ Error en autenticación Calendar:', error)
      throw error
    }
  }

  isReady() {
    return this.initialized && this.calendar !== null
  }

  /**
   * ACTIVIDADES - Gestión de eventos
   */

  /**
   * Crea un evento de actividad en el calendario
   * @param {Object} actividad - Datos de la actividad
   * @returns {Promise<Object>} Evento creado con ID
   */
  async crearEventoActividad(actividad) {
    try {
      if (!this.isReady()) {
        console.warn('⚠️ Calendar no disponible, saltando creación de evento')
        return { success: false, message: 'Calendar no inicializado' }
      }

      // Parsear fecha y crear horarios
      const fechaInicio = new Date(actividad.fecha)
      const fechaFin = new Date(actividad.fecha)
      
      // Actividad de día completo (8:00 AM - 6:00 PM)
      fechaInicio.setHours(8, 0, 0)
      fechaFin.setHours(18, 0, 0)

      const evento = {
        summary: `🥾 ${actividad.titulo}`,
        description: `
${actividad.descripcion}

📍 Lugar: ${actividad.lugar || actividad.descripcion}
⏱️ Duración: ${actividad.duracion}
⚡ Dificultad: ${actividad.dificultad}
💰 Precio: ${actividad.precio}
📦 Incluye: ${actividad.incluye}

🔗 Más info: ${window.location.origin}
`.trim(),
        location: actividad.lugar || actividad.descripcion,
        start: {
          dateTime: fechaInicio.toISOString(),
          timeZone: 'America/Santiago'
        },
        end: {
          dateTime: fechaFin.toISOString(),
          timeZone: 'America/Santiago'
        },
        colorId: '10', // Verde para actividades
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 60 } // 1 hora antes
          ]
        }
      }

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: evento
      })

      console.log('✅ Evento de actividad creado:', response.data.id)
      return {
        success: true,
        eventId: response.data.id,
        htmlLink: response.data.htmlLink
      }
    } catch (error) {
      console.error('❌ Error creando evento de actividad:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Actualiza un evento de actividad existente
   */
  async actualizarEventoActividad(eventId, actividad) {
    try {
      if (!this.isReady() || !eventId) {
        return { success: false, message: 'Calendar no disponible o sin eventId' }
      }

      const fechaInicio = new Date(actividad.fecha)
      const fechaFin = new Date(actividad.fecha)
      fechaInicio.setHours(8, 0, 0)
      fechaFin.setHours(18, 0, 0)

      const evento = {
        summary: `🥾 ${actividad.titulo}`,
        description: `
${actividad.descripcion}

📍 Lugar: ${actividad.lugar || actividad.descripcion}
⏱️ Duración: ${actividad.duracion}
⚡ Dificultad: ${actividad.dificultad}
💰 Precio: ${actividad.precio}
📦 Incluye: ${actividad.incluye}

🔗 Más info: ${window.location.origin}
`.trim(),
        location: actividad.lugar || actividad.descripcion,
        start: {
          dateTime: fechaInicio.toISOString(),
          timeZone: 'America/Santiago'
        },
        end: {
          dateTime: fechaFin.toISOString(),
          timeZone: 'America/Santiago'
        }
      }

      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        requestBody: evento
      })

      console.log('✅ Evento actualizado:', eventId)
      return { success: true, eventId: response.data.id }
    } catch (error) {
      console.error('❌ Error actualizando evento:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Elimina un evento del calendario
   */
  async eliminarEvento(eventId) {
    try {
      if (!this.isReady() || !eventId) {
        return { success: false }
      }

      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId
      })

      console.log('🗑️ Evento eliminado:', eventId)
      return { success: true }
    } catch (error) {
      console.error('❌ Error eliminando evento:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * RESERVAS - Gestión de eventos de reserva
   */

  /**
   * Crea un evento de reserva en el calendario
   */
  async crearEventoReserva(reserva, actividad) {
    try {
      if (!this.isReady()) {
        console.warn('⚠️ Calendar no disponible para reserva')
        return { success: false }
      }

      // Usar fecha de la actividad
      const fechaInicio = new Date(actividad.fecha)
      const fechaFin = new Date(actividad.fecha)
      fechaInicio.setHours(8, 0, 0)
      fechaFin.setHours(18, 0, 0)

      const evento = {
        summary: `📅 Reserva: ${actividad.titulo}`,
        description: `
RESERVA CONFIRMADA

👤 Cliente: ${reserva.nombre}
📧 Email: ${reserva.email}
📞 Teléfono: ${reserva.telefono}
👥 Personas: ${reserva.cantidadPersonas}

💬 Mensaje:
${reserva.mensaje || 'Sin mensaje adicional'}

---
Actividad: ${actividad.titulo}
Lugar: ${actividad.descripcion}
Duración: ${actividad.duracion}
Precio: ${actividad.precio}

🔗 Panel admin: ${window.location.origin}/admin
`.trim(),
        location: actividad.descripcion,
        start: {
          dateTime: fechaInicio.toISOString(),
          timeZone: 'America/Santiago'
        },
        end: {
          dateTime: fechaFin.toISOString(),
          timeZone: 'America/Santiago'
        },
        colorId: '11', // Rojo para reservas
        attendees: [
          { email: reserva.email, displayName: reserva.nombre }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 120 }
          ]
        }
      }

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: evento,
        sendUpdates: 'all' // Enviar email al cliente
      })

      console.log('✅ Evento de reserva creado:', response.data.id)
      return {
        success: true,
        eventId: response.data.id,
        htmlLink: response.data.htmlLink
      }
    } catch (error) {
      console.error('❌ Error creando evento de reserva:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * CONSULTAS - Obtener eventos
   */

  /**
   * Obtiene todos los eventos en un rango de fechas
   */
  async obtenerEventos(fechaInicio, fechaFin) {
    try {
      if (!this.isReady()) {
        return []
      }

      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: fechaInicio.toISOString(),
        timeMax: fechaFin.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      return response.data.items || []
    } catch (error) {
      console.error('❌ Error obteniendo eventos:', error)
      return []
    }
  }

  /**
   * Verifica disponibilidad de una fecha
   */
  async verificarDisponibilidad(fecha) {
    try {
      if (!this.isReady()) {
        return { disponible: true, eventos: 0 }
      }

      const inicio = new Date(fecha)
      inicio.setHours(0, 0, 0, 0)
      
      const fin = new Date(fecha)
      fin.setHours(23, 59, 59, 999)

      const eventos = await this.obtenerEventos(inicio, fin)
      
      // Considerar ocupado si hay más de 3 reservas
      const reservas = eventos.filter(e => e.summary?.includes('Reserva'))
      
      return {
        disponible: reservas.length < 3,
        eventos: eventos.length,
        reservas: reservas.length,
        detalles: eventos.map(e => ({
          titulo: e.summary,
          inicio: e.start.dateTime,
          fin: e.end.dateTime
        }))
      }
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error)
      return { disponible: true, eventos: 0 }
    }
  }

  /**
   * Obtiene URL pública del calendario
   */
  getCalendarPublicUrl() {
    if (!this.calendarId || this.calendarId === 'primary') {
      return null
    }
    return `https://calendar.google.com/calendar/embed?src=${this.calendarId}`
  }

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('google_calendar_token')
    this.authClient = null
    this.calendar = null
    this.initialized = false
    console.log('👋 Sesión de Google Calendar cerrada')
  }
}

// Exportar instancia única
const calendarService = new CalendarService()
export default calendarService
