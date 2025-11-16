/**
 * Script de Migración: JSON → Google Sheets
 * Transfiere datos de actividades.json y lugares.json a Google Sheets
 * 
 * Uso: node scripts/migrate-to-sheets.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Leer variables de entorno
import dotenv from 'dotenv'
dotenv.config()

const ACTIVIDADES_SHEET_ID = process.env.VITE_GOOGLE_SHEETS_ACTIVIDADES_ID
const LUGARES_SHEET_ID = process.env.VITE_GOOGLE_SHEETS_LUGARES_ID

async function authenticate() {
  const credentialsPath = path.join(__dirname, '..', 'credentials.json')
  
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Archivo credentials.json no encontrado')
    console.log('📝 Descárgalo de Google Cloud Console → Credenciales')
    process.exit(1)
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
  const { client_id, client_secret, redirect_uris } = credentials.web

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  // Intentar cargar token guardado
  const tokenPath = path.join(__dirname, '..', 'token.json')
  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
    oAuth2Client.setCredentials(token)
    console.log('✅ Autenticado con token guardado')
    return oAuth2Client
  }

  console.log('⚠️ No hay token guardado. Se requiere autenticación manual.')
  console.log('Por favor, ejecuta la app primero para autenticarte.')
  process.exit(1)
}

async function migrateActividades(auth) {
  try {
    const actividadesPath = path.join(__dirname, '..', 'data', 'actividades.json')
    
    if (!fs.existsSync(actividadesPath)) {
      console.log('⚠️ No se encontró actividades.json')
      return
    }

    const actividades = JSON.parse(fs.readFileSync(actividadesPath, 'utf8'))
    
    if (actividades.length === 0) {
      console.log('ℹ️ No hay actividades para migrar')
      return
    }

    console.log(`\n📦 Migrando ${actividades.length} actividades...`)

    const sheets = google.sheets({ version: 'v4', auth })

    // Preparar filas para Google Sheets
    const rows = actividades.map(act => [
      act.id,
      act.titulo,
      act.descripcion,
      act.duracion,
      act.dificultad,
      act.precio,
      act.incluye,
      act.imagen || act.imagenes?.[0] || '', // Compatibilidad
      act.destacado ? 'TRUE' : 'FALSE',
      act.fechaCreacion || new Date().toISOString(),
      act.lugarId || ''
    ])

    // Subir a Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: ACTIVIDADES_SHEET_ID,
      range: 'Actividades!A2:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows
      }
    })

    console.log('✅ Actividades migradas exitosamente')
  } catch (error) {
    console.error('❌ Error migrando actividades:', error.message)
  }
}

async function migrateLugares(auth) {
  try {
    const lugaresPath = path.join(__dirname, '..', 'data', 'lugares.json')
    
    if (!fs.existsSync(lugaresPath)) {
      console.log('⚠️ No se encontró lugares.json')
      return
    }

    const lugares = JSON.parse(fs.readFileSync(lugaresPath, 'utf8'))
    
    if (lugares.length === 0) {
      console.log('ℹ️ No hay lugares para migrar')
      return
    }

    console.log(`\n📦 Migrando ${lugares.length} lugares...`)

    const sheets = google.sheets({ version: 'v4', auth })

    // Preparar filas
    const rows = lugares.map(lugar => [
      lugar.id,
      lugar.titulo,
      lugar.descripcion,
      lugar.ubicacion,
      lugar.contenido,
      lugar.categoria,
      lugar.destacado ? 'TRUE' : 'FALSE',
      JSON.stringify(lugar.imagenes || []),
      lugar.fechaCreacion || new Date().toISOString(),
      lugar.lat || '',
      lugar.lng || ''
    ])

    // Subir a Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: LUGARES_SHEET_ID,
      range: 'Lugares!A2:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows
      }
    })

    console.log('✅ Lugares migrados exitosamente')
  } catch (error) {
    console.error('❌ Error migrando lugares:', error.message)
  }
}

async function main() {
  console.log('🚀 Iniciando migración JSON → Google Sheets\n')

  // Verificar configuración
  if (!ACTIVIDADES_SHEET_ID || !LUGARES_SHEET_ID) {
    console.error('❌ IDs de Google Sheets no configurados en .env')
    console.log('Necesitas:')
    console.log('  VITE_GOOGLE_SHEETS_ACTIVIDADES_ID')
    console.log('  VITE_GOOGLE_SHEETS_LUGARES_ID')
    process.exit(1)
  }

  try {
    const auth = await authenticate()
    
    await migrateActividades(auth)
    await migrateLugares(auth)
    
    console.log('\n🎉 Migración completada exitosamente!')
    console.log('\n📝 Pasos siguientes:')
    console.log('1. Verifica los datos en Google Sheets')
    console.log('2. Haz backup de los archivos JSON originales')
    console.log('3. Actualiza la app para usar Google Sheets')
    
  } catch (error) {
    console.error('\n❌ Error en la migración:', error.message)
    process.exit(1)
  }
}

main()
