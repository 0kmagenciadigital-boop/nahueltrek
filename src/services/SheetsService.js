/**
 * Google Sheets Service
 * Maneja operaciones CRUD con Google Sheets como base de datos
 * Reemplaza archivos JSON locales con almacenamiento en la nube
 */

import { google } from 'googleapis'

class SheetsService {
  constructor() {
    this.sheets = null
    this.actividadesSheetId = import.meta.env.VITE_GOOGLE_SHEETS_ACTIVIDADES_ID
    this.lugaresSheetId = import.meta.env.VITE_GOOGLE_SHEETS_LUGARES_ID
    this.reservasSheetId = import.meta.env.VITE_GOOGLE_SHEETS_RESERVAS_ID
    this.initialized = false
    this.authClient = null
  }

  /**
   * Inicializa el servicio de Google Sheets
   */
  async initialize() {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
      
      if (!clientId || !clientSecret) {
        console.warn('⚠️ Google Sheets no configurado. Usando JSON local.')
        return false
      }

      // Crear cliente OAuth2
      const OAuth2 = google.auth.OAuth2
      this.authClient = new OAuth2(
        clientId,
        clientSecret,
        window.location.origin
      )

      // Cargar token guardado
      const savedToken = localStorage.getItem('google_sheets_token')
      if (savedToken) {
        this.authClient.setCredentials(JSON.parse(savedToken))
        this.sheets = google.sheets({ version: 'v4', auth: this.authClient })
        this.initialized = true
        console.log('✅ Google Sheets inicializado')
        return true
      }

      console.log('ℹ️ Google Sheets requiere autenticación')
      return false
    } catch (error) {
      console.error('❌ Error inicializando Google Sheets:', error)
      return false
    }
  }

  /**
   * Autentica con Google OAuth (comparte autenticación con Drive)
   */
  async authenticate() {
    try {
      // Si ya existe token de Drive, usarlo
      const driveToken = localStorage.getItem('google_drive_token')
      if (driveToken) {
        this.authClient.setCredentials(JSON.parse(driveToken))
        localStorage.setItem('google_sheets_token', driveToken)
        this.sheets = google.sheets({ version: 'v4', auth: this.authClient })
        this.initialized = true
        console.log('✅ Google Sheets autenticado con token de Drive')
        return true
      }

      // Si no, seguir el proceso de autenticación
      const scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ]
      
      const authUrl = this.authClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      })

      const authWindow = window.open(authUrl, 'Google Sheets Authorization', 'width=600,height=700')

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
              localStorage.setItem('google_sheets_token', JSON.stringify(tokens))
              
              this.sheets = google.sheets({ version: 'v4', auth: this.authClient })
              this.initialized = true
              
              console.log('✅ Autenticación exitosa con Google Sheets')
              resolve(true)
            } catch (error) {
              reject(error)
            }
          }
        })
      })
    } catch (error) {
      console.error('❌ Error en autenticación Sheets:', error)
      throw error
    }
  }

  isReady() {
    return this.initialized && this.sheets !== null
  }

  /**
   * ACTIVIDADES - CRUD Operations
   */

  async getActividades() {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.actividadesSheetId,
        range: 'Actividades!A2:K' // Desde fila 2 (skip headers) hasta columna K
      })

      const rows = response.data.values || []
      
      return rows.map(row => ({
        id: row[0] || '',
        titulo: row[1] || '',
        descripcion: row[2] || '',
        duracion: row[3] || '',
        dificultad: row[4] || '',
        precio: row[5] || '',
        incluye: row[6] || '',
        imagen: row[7] || '',
        destacado: row[8] === 'TRUE' || row[8] === 'true',
        fechaCreacion: row[9] || new Date().toISOString(),
        lugarId: row[10] || ''
      }))
    } catch (error) {
      console.error('❌ Error obteniendo actividades:', error)
      throw error
    }
  }

  async createActividad(actividad) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const id = `act_${Date.now()}`
      const row = [
        id,
        actividad.titulo,
        actividad.descripcion,
        actividad.duracion,
        actividad.dificultad,
        actividad.precio,
        actividad.incluye,
        actividad.imagen || '',
        actividad.destacado ? 'TRUE' : 'FALSE',
        new Date().toISOString(),
        actividad.lugarId || ''
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.actividadesSheetId,
        range: 'Actividades!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row]
        }
      })

      console.log('✅ Actividad creada:', id)
      return { ...actividad, id, fechaCreacion: row[9] }
    } catch (error) {
      console.error('❌ Error creando actividad:', error)
      throw error
    }
  }

  async updateActividad(id, updates) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      // Obtener todas las actividades para encontrar el índice
      const actividades = await this.getActividades()
      const index = actividades.findIndex(a => a.id === id)
      
      if (index === -1) {
        throw new Error('Actividad no encontrada')
      }

      const rowNumber = index + 2 // +2 porque header está en fila 1, datos desde fila 2
      const actividad = { ...actividades[index], ...updates }

      const row = [
        actividad.id,
        actividad.titulo,
        actividad.descripcion,
        actividad.duracion,
        actividad.dificultad,
        actividad.precio,
        actividad.incluye,
        actividad.imagen || '',
        actividad.destacado ? 'TRUE' : 'FALSE',
        actividad.fechaCreacion,
        actividad.lugarId || ''
      ]

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.actividadesSheetId,
        range: `Actividades!A${rowNumber}:K${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row]
        }
      })

      console.log('✅ Actividad actualizada:', id)
      return actividad
    } catch (error) {
      console.error('❌ Error actualizando actividad:', error)
      throw error
    }
  }

  async deleteActividad(id) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const actividades = await this.getActividades()
      const index = actividades.findIndex(a => a.id === id)
      
      if (index === -1) {
        throw new Error('Actividad no encontrada')
      }

      const rowNumber = index + 2

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.actividadesSheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Primera pestaña
                dimension: 'ROWS',
                startIndex: rowNumber - 1, // 0-indexed
                endIndex: rowNumber
              }
            }
          }]
        }
      })

      console.log('🗑️ Actividad eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error('❌ Error eliminando actividad:', error)
      throw error
    }
  }

  /**
   * LUGARES - CRUD Operations
   */

  async getLugares() {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.lugaresSheetId,
        range: 'Lugares!A2:K'
      })

      const rows = response.data.values || []
      
      return rows.map(row => ({
        id: row[0] || '',
        titulo: row[1] || '',
        descripcion: row[2] || '',
        ubicacion: row[3] || '',
        contenido: row[4] || '',
        categoria: row[5] || '',
        destacado: row[6] === 'TRUE' || row[6] === 'true',
        imagenes: row[7] ? JSON.parse(row[7]) : [],
        fechaCreacion: row[8] || new Date().toISOString(),
        lat: row[9] ? parseFloat(row[9]) : null,
        lng: row[10] ? parseFloat(row[10]) : null
      }))
    } catch (error) {
      console.error('❌ Error obteniendo lugares:', error)
      throw error
    }
  }

  async createLugar(lugar) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const id = `lugar_${Date.now()}`
      const row = [
        id,
        lugar.titulo,
        lugar.descripcion,
        lugar.ubicacion,
        lugar.contenido,
        lugar.categoria,
        lugar.destacado ? 'TRUE' : 'FALSE',
        JSON.stringify(lugar.imagenes || []),
        new Date().toISOString(),
        lugar.lat || '',
        lugar.lng || ''
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.lugaresSheetId,
        range: 'Lugares!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row]
        }
      })

      console.log('✅ Lugar creado:', id)
      return { ...lugar, id, fechaCreacion: row[8] }
    } catch (error) {
      console.error('❌ Error creando lugar:', error)
      throw error
    }
  }

  async updateLugar(id, updates) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const lugares = await this.getLugares()
      const index = lugares.findIndex(l => l.id === id)
      
      if (index === -1) {
        throw new Error('Lugar no encontrado')
      }

      const rowNumber = index + 2
      const lugar = { ...lugares[index], ...updates }

      const row = [
        lugar.id,
        lugar.titulo,
        lugar.descripcion,
        lugar.ubicacion,
        lugar.contenido,
        lugar.categoria,
        lugar.destacado ? 'TRUE' : 'FALSE',
        JSON.stringify(lugar.imagenes || []),
        lugar.fechaCreacion,
        lugar.lat || '',
        lugar.lng || ''
      ]

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.lugaresSheetId,
        range: `Lugares!A${rowNumber}:K${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row]
        }
      })

      console.log('✅ Lugar actualizado:', id)
      return lugar
    } catch (error) {
      console.error('❌ Error actualizando lugar:', error)
      throw error
    }
  }

  async deleteLugar(id) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const lugares = await this.getLugares()
      const index = lugares.findIndex(l => l.id === id)
      
      if (index === -1) {
        throw new Error('Lugar no encontrado')
      }

      const rowNumber = index + 2

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.lugaresSheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }]
        }
      })

      console.log('🗑️ Lugar eliminado:', id)
      return { success: true }
    } catch (error) {
      console.error('❌ Error eliminando lugar:', error)
      throw error
    }
  }

  /**
   * RESERVAS - CRUD Operations
   */

  async getReservas() {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.reservasSheetId,
        range: 'Reservas!A2:I'
      })

      const rows = response.data.values || []
      
      return rows.map(row => ({
        id: row[0] || '',
        actividadId: row[1] || '',
        actividadTitulo: row[2] || '',
        nombre: row[3] || '',
        email: row[4] || '',
        telefono: row[5] || '',
        cantidadPersonas: parseInt(row[6]) || 1,
        mensaje: row[7] || '',
        fechaReserva: row[8] || new Date().toISOString()
      }))
    } catch (error) {
      console.error('❌ Error obteniendo reservas:', error)
      throw error
    }
  }

  async createReserva(reserva) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const id = `reserva_${Date.now()}`
      const row = [
        id,
        reserva.actividadId || '',
        reserva.actividadTitulo || '',
        reserva.nombre,
        reserva.email,
        reserva.telefono,
        reserva.cantidadPersonas || 1,
        reserva.mensaje || '',
        new Date().toISOString()
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.reservasSheetId,
        range: 'Reservas!A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [row]
        }
      })

      console.log('✅ Reserva creada:', id)
      return { ...reserva, id, fechaReserva: row[8] }
    } catch (error) {
      console.error('❌ Error creando reserva:', error)
      throw error
    }
  }

  async getReservasByActividad(actividadId) {
    try {
      const todasReservas = await this.getReservas()
      return todasReservas.filter(r => r.actividadId === actividadId)
    } catch (error) {
      console.error('❌ Error obteniendo reservas por actividad:', error)
      throw error
    }
  }

  async deleteReserva(id) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Sheets no inicializado')
      }

      const reservas = await this.getReservas()
      const index = reservas.findIndex(r => r.id === id)
      
      if (index === -1) {
        throw new Error('Reserva no encontrada')
      }

      const rowNumber = index + 2

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.reservasSheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }]
        }
      })

      console.log('🗑️ Reserva eliminada:', id)
      return { success: true }
    } catch (error) {
      console.error('❌ Error eliminando reserva:', error)
      throw error
    }
  }

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('google_sheets_token')
    this.authClient = null
    this.sheets = null
    this.initialized = false
    console.log('👋 Sesión de Google Sheets cerrada')
  }
}

// Exportar instancia única
const sheetsService = new SheetsService()
export default sheetsService
