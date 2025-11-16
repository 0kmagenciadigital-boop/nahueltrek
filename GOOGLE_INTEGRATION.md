# 🌐 Integración con Google Services - NahuelTrek

Este documento detalla la implementación completa de 4 integraciones con Google para reemplazar dependencias de PHP y mejorar funcionalidades.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Google Cloud Setup](#google-cloud-setup)
3. [Google Drive - Almacenamiento de Imágenes](#google-drive)
4. [Google Sheets - Base de Datos](#google-sheets)
5. [Google Maps - Ubicaciones](#google-maps)
6. [Google Forms - Reservaciones](#google-forms)
7. [Despliegue](#despliegue)

---

## 📌 Requisitos Previos

### Herramientas Necesarias
- Cuenta de Google (Gmail)
- Node.js 18+ instalado
- Navegador web moderno
- Editor de código (VS Code recomendado)

### Beneficios de la Integración
✅ **Elimina PHP server** - No más crashes del servidor local  
✅ **Almacenamiento ilimitado** - 15GB gratis en Google Drive  
✅ **Base de datos robusta** - Google Sheets como backend  
✅ **Mapas interactivos** - Ubicaciones visuales con Street View  
✅ **Sistema de reservas** - Google Forms con notificaciones automáticas  
✅ **Acceso desde cualquier lugar** - Cloud-first architecture  
✅ **Backups automáticos** - Google maneja la redundancia  
✅ **Cero costo de hosting backend** - Solo frontend en Hostinger  

---

## 🚀 Google Cloud Setup

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Clic en "Seleccionar proyecto" → "Nuevo proyecto"
3. Nombre del proyecto: `nahueltrek-blog`
4. Clic en "Crear"
5. Esperar a que se cree el proyecto (30-60 segundos)

### Paso 2: Habilitar APIs Necesarias

En el menú lateral → **APIs y servicios** → **Biblioteca**

Buscar y habilitar las siguientes APIs:
- ✅ **Google Drive API** (para imágenes)
- ✅ **Google Sheets API** (para base de datos)
- ✅ **Google Maps JavaScript API** (para mapas)
- ✅ **Google Maps Geocoding API** (para convertir direcciones a coordenadas)

Para cada una:
1. Buscar el nombre en la biblioteca
2. Clic en la tarjeta de la API
3. Clic en "HABILITAR"
4. Esperar confirmación

### Paso 3: Crear Credenciales

#### A) API Key para Google Maps (uso público)

1. **APIs y servicios** → **Credenciales** → **+ CREAR CREDENCIALES** → **Clave de API**
2. Se genera la clave (ej: `AIzaSyC8X...`)
3. Clic en el nombre de la clave para configurarla
4. **Restricciones de API**: Seleccionar "Restringir clave"
5. Marcar:
   - Google Maps JavaScript API
   - Geocoding API
6. **Restricciones de aplicación**: 
   - Seleccionar "Referentes HTTP (sitios web)"
   - Agregar:
     - `http://localhost:5173/*`
     - `https://nahueltrek.0km.app/*`
7. Clic en "GUARDAR"

**Guardar esta clave:** `VITE_GOOGLE_MAPS_API_KEY=AIzaSyC8X...`

#### B) OAuth 2.0 para Drive y Sheets (acceso a tu cuenta)

1. **APIs y servicios** → **Pantalla de consentimiento de OAuth**
2. Seleccionar **"Externo"** → Clic en "CREAR"
3. Completar formulario:
   - **Nombre de la aplicación**: NahuelTrek Blog
   - **Correo electrónico de asistencia**: tu@gmail.com
   - **Logotipo**: (opcional)
   - **Dominios autorizados**: `0km.app`
   - **Correo de contacto**: tu@gmail.com
4. Clic en "GUARDAR Y CONTINUAR"
5. **Permisos (Scopes)**: Clic en "AGREGAR O QUITAR PERMISOS"
   - Buscar y agregar:
     - `../auth/drive.file` (crear/editar archivos en Drive)
     - `../auth/spreadsheets` (crear/editar hojas de cálculo)
6. Clic en "ACTUALIZAR" → "GUARDAR Y CONTINUAR"
7. **Usuarios de prueba**: Agregar tu correo Gmail → "AGREGAR"
8. Clic en "GUARDAR Y CONTINUAR" → "VOLVER AL PANEL"

9. **Credenciales** → **+ CREAR CREDENCIALES** → **ID de cliente de OAuth 2.0**
10. Tipo de aplicación: **"Aplicación web"**
11. Nombre: `NahuelTrek Web Client`
12. **URIs de redireccionamiento autorizados**:
    - `http://localhost:5173`
    - `https://nahueltrek.0km.app`
13. Clic en "CREAR"
14. Aparece ventana con **ID de cliente** y **Secreto de cliente**
15. Clic en "DESCARGAR JSON" → Guardar como `credentials.json` en la raíz del proyecto

**Contenido del archivo `credentials.json`:**
```json
{
  "web": {
    "client_id": "123456789-abc.apps.googleusercontent.com",
    "project_id": "nahueltrek-blog",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "GOCSPX-...",
    "redirect_uris": [
      "http://localhost:5173",
      "https://nahueltrek.0km.app"
    ]
  }
}
```

### Paso 4: Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Google Maps (público - incluido en build)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC8X...

# Google OAuth (privado - solo para desarrollo)
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-...

# Google Drive Folder ID (crear después)
VITE_GOOGLE_DRIVE_FOLDER_ID=

# Google Sheets IDs (crear después)
VITE_GOOGLE_SHEETS_ACTIVIDADES_ID=
VITE_GOOGLE_SHEETS_LUGARES_ID=
```

**⚠️ IMPORTANTE:** Agregar `.env` al `.gitignore` para no subir credenciales a GitHub:

```bash
echo ".env" >> .gitignore
echo "credentials.json" >> .gitignore
echo "token.json" >> .gitignore
```

---

## 📁 Google Drive - Almacenamiento de Imágenes

### Configuración Inicial

#### 1. Crear Carpeta en Google Drive

1. Ir a [Google Drive](https://drive.google.com/)
2. Clic derecho → **Nueva carpeta** → Nombre: `NahuelTrek-Images`
3. Abrir la carpeta
4. Copiar el ID de la URL: `https://drive.google.com/drive/folders/[ID_DE_LA_CARPETA]`
5. Agregar a `.env`: `VITE_GOOGLE_DRIVE_FOLDER_ID=[ID_DE_LA_CARPETA]`

#### 2. Hacer la Carpeta Pública (para que las imágenes sean visibles)

1. Clic derecho en la carpeta → **Compartir**
2. Cambiar "Restringido" a **"Cualquier usuario con el enlace"**
3. Permisos: **"Lector"** (solo ver, no editar)
4. Clic en "Listo"

### Instalación de Dependencias

```bash
npm install googleapis@131 @google-cloud/local-auth@3.0.1 google-auth-library@9.6.3
```

### Implementación

La integración se ha implementado en `src/services/DriveService.js` con las siguientes funciones:

#### Características Principales:
- **Autenticación automática** con OAuth 2.0
- **Upload de imágenes** con compresión automática
- **URLs públicas** generadas automáticamente
- **Caché de tokens** para no pedir permisos cada vez
- **Validación de archivos** (tipo, tamaño)
- **Gestión de errores** detallada

#### API del Servicio:

```javascript
import DriveService from './services/DriveService'

// Inicializar (una sola vez al cargar la app)
await DriveService.initialize()

// Subir imagen
const result = await DriveService.uploadImage(file)
// Retorna: { success: true, url: 'https://drive.google.com/...', fileId: '...' }

// Eliminar imagen (opcional)
await DriveService.deleteImage(fileId)
```

### Uso en Componentes

Los componentes `Admin.jsx` y `BlogLugares.jsx` ya están actualizados para usar Drive automáticamente cuando esté configurado. El sistema detecta si las credenciales de Google están presentes y usa Drive; si no, fallback a PHP local.

---

## 📊 Google Sheets - Base de Datos

### Configuración Inicial

#### 1. Crear Hojas de Cálculo

##### Hoja 1: Actividades

1. Ir a [Google Sheets](https://sheets.google.com/)
2. **Hoja de cálculo en blanco** → Nombre: `NahuelTrek-Actividades`
3. Renombrar la primera pestaña a `Actividades`
4. Crear encabezados en la fila 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | titulo | descripcion | duracion | dificultad | precio | incluye | imagen | destacado | fechaCreacion | lugarId |

5. Copiar el ID de la URL: `https://docs.google.com/spreadsheets/d/[ID_DE_LA_HOJA]/edit`
6. Agregar a `.env`: `VITE_GOOGLE_SHEETS_ACTIVIDADES_ID=[ID]`

##### Hoja 2: Lugares

1. Crear otra hoja: **Hoja de cálculo en blanco** → Nombre: `NahuelTrek-Lugares`
2. Renombrar la primera pestaña a `Lugares`
3. Crear encabezados en la fila 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | titulo | descripcion | ubicacion | contenido | categoria | destacado | imagenes | fechaCreacion | lat | lng |

4. Copiar el ID y agregar a `.env`: `VITE_GOOGLE_SHEETS_LUGARES_ID=[ID]`

#### 2. Compartir Hojas con la Aplicación

Para cada hoja:
1. Clic en **Compartir** (botón verde arriba derecha)
2. En "Agregar personas y grupos", pegar el email de tu cuenta de servicio  
   (Está en `credentials.json` → `client_email`)
3. Permisos: **"Editor"**
4. Desmarcar "Notificar a las personas"
5. Clic en "Compartir"

### Migración de Datos Actuales

Para transferir datos de `actividades.json` y `lugares.json` a Google Sheets:

```bash
node scripts/migrate-to-sheets.js
```

Este script (incluido en el proyecto) lee los archivos JSON y crea las filas correspondientes en las hojas.

### Implementación

La integración se encuentra en `src/services/SheetsService.js`:

#### API del Servicio:

```javascript
import SheetsService from './services/SheetsService'

// Inicializar
await SheetsService.initialize()

// CRUD Actividades
const actividades = await SheetsService.getActividades()
const nuevaActividad = await SheetsService.createActividad({ titulo: '...', ... })
await SheetsService.updateActividad(id, { titulo: '...' })
await SheetsService.deleteActividad(id)

// CRUD Lugares
const lugares = await SheetsService.getLugares()
const nuevoLugar = await SheetsService.createLugar({ titulo: '...', ... })
await SheetsService.updateLugar(id, { titulo: '...' })
await SheetsService.deleteLugar(id)
```

### Ventajas sobre JSON Files:
- ✅ **Edición manual fácil**: Puedes editar datos directamente en Google Sheets
- ✅ **Backups automáticos**: Google maneja versiones y recuperación
- ✅ **Acceso compartido**: Múltiples usuarios pueden editar (con permisos)
- ✅ **Sin servidor**: No necesitas PHP ni base de datos tradicional
- ✅ **Escalable**: Soporta miles de filas sin problemas
- ✅ **Exportable**: Descarga como CSV, Excel, PDF

---

## 🗺️ Google Maps - Ubicaciones Interactivas

### Configuración Inicial

Ya tienes la API Key de Maps del paso anterior. Ahora vamos a integrar mapas en la UI.

### Instalación de Dependencias

```bash
npm install @react-google-maps/api@2.19.3
```

### Implementación

Se han creado dos componentes:

#### 1. `MapPicker.jsx` - Selector de Ubicación (para el formulario de lugares)

```javascript
import MapPicker from './components/MapPicker'

<MapPicker
  initialLat={-41.1335}
  initialLng={-71.3103}
  onLocationSelect={(lat, lng, address) => {
    // Guardar lat, lng en el estado del formulario
  }}
/>
```

Características:
- Mapa interactivo con marker arrastrable
- Búsqueda de lugares por nombre (autocomplete)
- Geocoding reverso (obtiene dirección desde coordenadas)
- Click en el mapa para colocar marker
- Zoom y pan

#### 2. `MapDisplay.jsx` - Mostrar Ubicación (en las cards de lugares)

```javascript
import MapDisplay from './components/MapDisplay'

<MapDisplay
  lat={-41.1335}
  lng={-71.3103}
  title="Parque Nacional Nahuel Huapi"
  zoom={12}
/>
```

Características:
- Mapa estático de solo lectura
- Marker con título
- Tooltip con información
- Responsive

### Actualización de Formulario de Lugares

El componente `BlogLugares.jsx` ahora incluye:

```javascript
// En el estado del formulario
lugarForm: {
  // ... campos existentes
  lat: null,
  lng: null,
  ubicacion: '' // dirección de texto
}

// En el formulario
<MapPicker
  initialLat={lugarForm.lat}
  initialLng={lugarForm.lng}
  onLocationSelect={(lat, lng, address) => {
    setLugarForm(prev => ({
      ...prev,
      lat,
      lng,
      ubicacion: address
    }))
  }}
/>
```

### Visualización en Cards

Las tarjetas de lugares ahora muestran:
- **Mapa pequeño** con la ubicación
- **Botón "Ver en Google Maps"** que abre Google Maps en nueva pestaña
- **Dirección** debajo del título

---

## 📝 Google Forms - Sistema de Reservaciones

### Configuración Inicial

#### 1. Crear Google Form

1. Ir a [Google Forms](https://forms.google.com/)
2. **Formulario en blanco** → Título: `Reservaciones NahuelTrek`
3. Descripción: `Complete el formulario para reservar su actividad`

#### 2. Agregar Campos

Crear las siguientes preguntas:

**Campo 1: Actividad**
- Tipo: Respuesta corta
- Pregunta: "¿Qué actividad desea reservar?"
- Obligatorio: SÍ

**Campo 2: Nombre Completo**
- Tipo: Respuesta corta
- Pregunta: "Nombre completo"
- Obligatorio: SÍ

**Campo 3: Email**
- Tipo: Respuesta corta
- Pregunta: "Correo electrónico"
- Validación: Texto → Dirección de correo electrónico
- Obligatorio: SÍ

**Campo 4: Teléfono**
- Tipo: Respuesta corta
- Pregunta: "Teléfono / WhatsApp"
- Validación: Texto → Número
- Obligatorio: SÍ

**Campo 5: Fecha Preferida**
- Tipo: Fecha
- Pregunta: "Fecha preferida para la actividad"
- Obligatorio: SÍ

**Campo 6: Número de Personas**
- Tipo: Respuesta corta
- Pregunta: "Número de personas"
- Validación: Número → Mayor o igual a 1
- Obligatorio: SÍ

**Campo 7: Comentarios**
- Tipo: Párrafo
- Pregunta: "Comentarios o requerimientos especiales"
- Obligatorio: NO

#### 3. Configurar Respuestas

1. Pestaña **"Respuestas"**
2. Clic en el ícono de Google Sheets (verde)
3. Seleccionar **"Crear una hoja de cálculo nueva"**
4. Nombre: `Reservaciones NahuelTrek`
5. Clic en "Crear"

Ahora cada respuesta se guarda automáticamente en esa hoja.

#### 4. Configurar Notificaciones por Email

1. Abrir la hoja de respuestas creada
2. **Herramientas** → **Editor de secuencias de comandos**
3. Pegar este código:

```javascript
function enviarNotificacion(e) {
  var fila = e.values;
  var fecha = fila[0]; // Marca temporal
  var actividad = fila[1];
  var nombre = fila[2];
  var email = fila[3];
  var telefono = fila[4];
  var fechaActividad = fila[5];
  var personas = fila[6];
  var comentarios = fila[7];
  
  // Email al administrador
  var asunto = "Nueva Reservación - " + actividad;
  var mensaje = "Se ha recibido una nueva reservación:\n\n" +
                "Actividad: " + actividad + "\n" +
                "Cliente: " + nombre + "\n" +
                "Email: " + email + "\n" +
                "Teléfono: " + telefono + "\n" +
                "Fecha: " + fechaActividad + "\n" +
                "Personas: " + personas + "\n" +
                "Comentarios: " + comentarios + "\n\n" +
                "Responder al cliente lo antes posible.";
  
  MailApp.sendEmail("tu@gmail.com", asunto, mensaje);
  
  // Email al cliente (confirmación)
  var asuntoCliente = "Confirmación de Reservación - NahuelTrek";
  var mensajeCliente = "Hola " + nombre + ",\n\n" +
                       "Hemos recibido tu solicitud de reservación para:\n\n" +
                       "Actividad: " + actividad + "\n" +
                       "Fecha: " + fechaActividad + "\n" +
                       "Personas: " + personas + "\n\n" +
                       "Nos pondremos en contacto contigo pronto para confirmar los detalles.\n\n" +
                       "Saludos,\n" +
                       "Equipo NahuelTrek";
  
  MailApp.sendEmail(email, asuntoCliente, mensajeCliente);
}
```

4. Cambiar `tu@gmail.com` por tu email real
5. **Archivo** → **Guardar** → Nombre del proyecto: `Notificaciones Reservaciones`
6. **Activadores** (ícono de reloj) → **+ Agregar activador**
7. Configurar:
   - Función: `enviarNotificacion`
   - Evento: **Desde una hoja de cálculo** → **Al enviar el formulario**
8. Clic en "Guardar"
9. Autorizar permisos (primera vez)

#### 5. Obtener URL del Formulario

1. Volver al formulario
2. Clic en **"Enviar"** (arriba derecha)
3. Copiar la URL que aparece
4. Agregar a `.env`: `VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/...`

### Integración en el Sitio

El formulario se puede integrar de dos formas:

#### Opción A: Iframe Embedido

```javascript
// En el modal de detalle de actividad
<iframe
  src={import.meta.env.VITE_GOOGLE_FORM_URL + "?embedded=true"}
  width="100%"
  height="800"
  frameBorder="0"
  marginHeight="0"
  marginWidth="0"
>
  Cargando formulario...
</iframe>
```

#### Opción B: Botón que Abre en Nueva Pestaña

```javascript
<button
  onClick={() => window.open(import.meta.env.VITE_GOOGLE_FORM_URL, '_blank')}
  className="btn-reservar"
>
  🎫 Reservar Ahora
</button>
```

Se ha implementado la **Opción B** en `App.jsx` dentro del modal de actividades, con pre-llenado automático del nombre de la actividad:

```javascript
const formUrl = `${import.meta.env.VITE_GOOGLE_FORM_URL}?entry.123456=${encodeURIComponent(actividad.titulo)}`
```

*(Reemplazar `entry.123456` con el ID real del campo "Actividad" del formulario)*

---

## 🚀 Despliegue en Producción

### Preparación del Build

1. **Verificar variables de entorno** en `.env`:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC8X...
   VITE_GOOGLE_CLIENT_ID=123456789...
   VITE_GOOGLE_DRIVE_FOLDER_ID=1ABC...
   VITE_GOOGLE_SHEETS_ACTIVIDADES_ID=1XYZ...
   VITE_GOOGLE_SHEETS_LUGARES_ID=1DEF...
   VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/...
   ```

2. **Compilar para producción**:
   ```bash
   npm run build
   ```

3. **Verificar que no haya errores**:
   - El build debe completar exitosamente
   - Revisar carpeta `dist/` generada

### Subir a Hostinger

1. **Conectar por FTP/SFTP**:
   - Host: `ftp.nahueltrek.0km.app`
   - Usuario: (tu usuario de Hostinger)
   - Contraseña: (tu contraseña)
   - Puerto: 21 (FTP) o 22 (SFTP)

2. **Navegar a** `public_html/`

3. **Eliminar archivos antiguos** (opcional, hacer backup primero):
   ```bash
   rm -rf public_html/*
   ```

4. **Subir contenido de `dist/`**:
   - Seleccionar todos los archivos dentro de `dist/`
   - Arrastrar a `public_html/`
   - Esperar que termine la transferencia

5. **Configurar .htaccess** para SPA routing:
   
   Crear archivo `public_html/.htaccess`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Actualizar URLs en Google Cloud

1. **Google Cloud Console** → **Credenciales**
2. Editar el **ID de cliente de OAuth 2.0**
3. **URIs de redireccionamiento autorizados**:
   - Eliminar: `http://localhost:5173`
   - Mantener: `https://nahueltrek.0km.app`
4. Guardar

5. **API de Maps** → Editar restricciones
6. **Referentes HTTP**:
   - Eliminar: `http://localhost:5173/*`
   - Mantener: `https://nahueltrek.0km.app/*`
7. Guardar

### Verificación Post-Despliegue

Visitar `https://nahueltrek.0km.app` y verificar:

- ✅ El sitio carga correctamente
- ✅ Las imágenes de Google Drive se muestran
- ✅ Los datos de Google Sheets se cargan
- ✅ Los mapas de Google Maps funcionan
- ✅ El formulario de reservaciones abre
- ✅ La autenticación con Google funciona
- ✅ No hay errores en la consola del navegador (F12)

### Pruebas Funcionales

1. **Crear una actividad nueva**:
   - Subir imagen → Debe ir a Google Drive
   - Verificar que aparece en Google Sheets
   - Verificar que se muestra en el sitio

2. **Crear un lugar nuevo**:
   - Seleccionar ubicación en el mapa
   - Subir imágenes
   - Verificar en Google Sheets
   - Verificar que el mapa se muestra en la card

3. **Hacer una reservación**:
   - Abrir formulario de Google
   - Completar y enviar
   - Verificar email de confirmación
   - Verificar que llegó a la hoja de respuestas

---

## 🔧 Troubleshooting

### Problema: "Error de autenticación con Google"

**Solución**:
1. Verificar que `credentials.json` está en la raíz del proyecto
2. Eliminar `token.json` si existe
3. Volver a ejecutar la app → te pedirá autorización de nuevo
4. Aceptar todos los permisos

### Problema: "Imágenes no se muestran de Google Drive"

**Solución**:
1. Verificar que la carpeta de Drive es pública (cualquier usuario con el enlace)
2. Revisar que el `VITE_GOOGLE_DRIVE_FOLDER_ID` es correcto
3. Abrir una imagen en el navegador directamente para verificar permisos

### Problema: "Google Sheets no actualiza los datos"

**Solución**:
1. Verificar IDs de las hojas en `.env`
2. Verificar que las hojas están compartidas con el cliente OAuth
3. Revisar que los encabezados (columnas) coinciden exactamente
4. Comprobar que hay conexión a internet

### Problema: "Google Maps no se muestra"

**Solución**:
1. Verificar `VITE_GOOGLE_MAPS_API_KEY` en `.env`
2. Revisar restricciones de la API Key en Google Cloud Console
3. Verificar que la API de Maps JavaScript está habilitada
4. Abrir consola (F12) para ver errores específicos

### Problema: "El formulario de reservaciones no funciona"

**Solución**:
1. Verificar URL del formulario en `.env`
2. Comprobar que el formulario está publicado (no en modo borrador)
3. Probar abrir el formulario directamente en el navegador
4. Verificar que el script de notificaciones está activado

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)
- [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Google Forms](https://support.google.com/docs/answer/6281888)

### Tutoriales
- [OAuth 2.0 para Apps Web](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Subir archivos a Drive con JavaScript](https://developers.google.com/drive/api/guides/manage-uploads)
- [CRUD con Google Sheets](https://developers.google.com/sheets/api/guides/values)

### Soporte
- [Google Cloud Support](https://cloud.google.com/support)
- [Stack Overflow - google-drive-api](https://stackoverflow.com/questions/tagged/google-drive-api)
- [Stack Overflow - google-sheets-api](https://stackoverflow.com/questions/tagged/google-sheets-api)

---

## 🎉 Conclusión

Con estas integraciones has logrado:

✅ **Eliminar dependencias de PHP** - Todo en el cloud  
✅ **Sistema robusto y escalable** - Aprovechando infraestructura de Google  
✅ **Administración simplificada** - Edita datos directamente en Sheets  
✅ **Experiencia de usuario mejorada** - Mapas interactivos, formularios profesionales  
✅ **Costo cero en backend** - Solo pagas hosting del frontend  
✅ **Backups automáticos** - Google maneja todo  
✅ **Accesible desde cualquier lugar** - Cloud-first  

**¡Tu blog de trekking ahora es profesional y escalable! 🏔️✨**
