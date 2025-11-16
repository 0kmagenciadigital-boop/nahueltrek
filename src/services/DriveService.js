/**
 * Google Drive Service
 * Maneja la subida y gestión de imágenes en Google Drive
 * Reemplaza el sistema PHP local con almacenamiento en la nube
 */

import { google } from 'googleapis'

class DriveService {
  constructor() {
    this.drive = null
    this.folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID
    this.initialized = false
    this.authClient = null
  }

  /**
   * Inicializa el servicio de Google Drive
   * Debe llamarse al inicio de la aplicación
   */
  async initialize() {
    try {
      // Verificar que las credenciales están configuradas
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
      
      if (!clientId || !clientSecret) {
        console.warn('⚠️ Google Drive no configurado. Usando upload local.')
        return false
      }

      // Crear cliente OAuth2
      const OAuth2 = google.auth.OAuth2
      this.authClient = new OAuth2(
        clientId,
        clientSecret,
        window.location.origin // URL de redirección
      )

      // Intentar cargar token guardado del localStorage
      const savedToken = localStorage.getItem('google_drive_token')
      if (savedToken) {
        this.authClient.setCredentials(JSON.parse(savedToken))
        this.drive = google.drive({ version: 'v3', auth: this.authClient })
        this.initialized = true
        console.log('✅ Google Drive inicializado desde token guardado')
        return true
      }

      console.log('ℹ️ Google Drive requiere autenticación')
      return false
    } catch (error) {
      console.error('❌ Error inicializando Google Drive:', error)
      return false
    }
  }

  /**
   * Autentica al usuario con Google OAuth
   * Abre ventana de autorización
   */
  async authenticate() {
    try {
      const scopes = ['https://www.googleapis.com/auth/drive.file']
      
      // Generar URL de autorización
      const authUrl = this.authClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      })

      // Abrir ventana de autorización
      const authWindow = window.open(
        authUrl,
        'Google Drive Authorization',
        'width=600,height=700'
      )

      // Esperar el código de autorización
      return new Promise((resolve, reject) => {
        const checkWindowClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkWindowClosed)
            reject(new Error('Ventana de autorización cerrada'))
          }
        }, 1000)

        // Escuchar el mensaje con el código
        window.addEventListener('message', async (event) => {
          if (event.data.type === 'google_auth_code') {
            clearInterval(checkWindowClosed)
            authWindow.close()

            try {
              // Intercambiar código por tokens
              const { tokens } = await this.authClient.getToken(event.data.code)
              this.authClient.setCredentials(tokens)
              
              // Guardar token en localStorage
              localStorage.setItem('google_drive_token', JSON.stringify(tokens))
              
              // Inicializar Drive API
              this.drive = google.drive({ version: 'v3', auth: this.authClient })
              this.initialized = true
              
              console.log('✅ Autenticación exitosa con Google Drive')
              resolve(true)
            } catch (error) {
              reject(error)
            }
          }
        })
      })
    } catch (error) {
      console.error('❌ Error en autenticación:', error)
      throw error
    }
  }

  /**
   * Verifica si el servicio está listo para usar
   */
  isReady() {
    return this.initialized && this.drive !== null
  }

  /**
   * Sube una imagen a Google Drive
   * @param {File} file - Archivo de imagen a subir
   * @returns {Promise<{success: boolean, url: string, fileId: string}>}
   */
  async uploadImage(file) {
    try {
      // Verificar inicialización
      if (!this.isReady()) {
        throw new Error('Google Drive no está inicializado. Llama a authenticate() primero.')
      }

      // Validar archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no válido. Solo JPG, PNG o WEBP.')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Archivo muy grande. Máximo 5MB.')
      }

      // Generar nombre único
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const uniqueName = `nahueltrek_${timestamp}.${extension}`

      console.log(`📤 Subiendo imagen: ${uniqueName}...`)

      // Convertir File a Buffer/ArrayBuffer para Node.js
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Metadatos del archivo
      const fileMetadata = {
        name: uniqueName,
        parents: this.folderId ? [this.folderId] : [],
        description: 'Imagen subida desde NahuelTrek Blog'
      }

      // Media del archivo
      const media = {
        mimeType: file.type,
        body: buffer
      }

      // Subir a Drive
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink'
      })

      const fileId = response.data.id

      // Hacer el archivo público (cualquiera con el enlace puede ver)
      await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      })

      // Obtener URL pública
      const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`

      console.log('✅ Imagen subida exitosamente:', publicUrl)

      return {
        success: true,
        url: publicUrl,
        fileId: fileId,
        filename: uniqueName,
        size: file.size
      }
    } catch (error) {
      console.error('❌ Error subiendo imagen a Drive:', error)
      
      // Manejar errores de autenticación
      if (error.code === 401 || error.code === 403) {
        // Token expirado, limpiar y pedir reautenticación
        localStorage.removeItem('google_drive_token')
        this.initialized = false
        throw new Error('Sesión expirada. Por favor, vuelve a autenticarte.')
      }

      throw new Error(`Error al subir imagen: ${error.message}`)
    }
  }

  /**
   * Elimina una imagen de Google Drive
   * @param {string} fileId - ID del archivo a eliminar
   */
  async deleteImage(fileId) {
    try {
      if (!this.isReady()) {
        throw new Error('Google Drive no está inicializado')
      }

      await this.drive.files.delete({
        fileId: fileId
      })

      console.log(`🗑️ Imagen eliminada: ${fileId}`)
      return { success: true }
    } catch (error) {
      console.error('❌ Error eliminando imagen:', error)
      throw error
    }
  }

  /**
   * Extrae el fileId de una URL de Google Drive
   * @param {string} url - URL de Google Drive
   * @returns {string|null} - fileId o null si no es válido
   */
  extractFileId(url) {
    if (!url || typeof url !== 'string') return null
    
    // Formato: https://drive.google.com/uc?export=view&id=FILE_ID
    const match = url.match(/[?&]id=([^&]+)/)
    return match ? match[1] : null
  }

  /**
   * Cierra sesión y limpia tokens
   */
  logout() {
    localStorage.removeItem('google_drive_token')
    this.authClient = null
    this.drive = null
    this.initialized = false
    console.log('👋 Sesión de Google Drive cerrada')
  }
}

// Exportar instancia única (singleton)
const driveService = new DriveService()
export default driveService
