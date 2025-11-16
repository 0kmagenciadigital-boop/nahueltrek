# 🏔️ NahuelTrek - Blog de Trekking y Aventuras

Sistema de gestión de actividades outdoor con integración completa de Google Services.

## ✨ Características

- 🎯 **Admin Panel** - CRUD completo para actividades y lugares
- 📁 **Google Drive** - Almacenamiento de imágenes en la nube
- 📊 **Google Sheets** - Base de datos sin servidor
- 🗺️ **Google Maps** - Ubicaciones interactivas con mapas
- 📝 **Google Forms** - Sistema de reservaciones
- 🎨 **UI Moderna** - Diseño responsive y atractivo
- 🔐 **Autenticación** - Login seguro con contraseña
- 🌐 **Cloud-First** - Sin dependencias de PHP ni MySQL

## 🚀 Quick Start

### 1. Clonar repositorio

```bash
git clone https://github.com/0kmagenciadigital-boop/nahueltrek.git
cd nahueltrek
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Google Services

**⚠️ IMPORTANTE:** Antes de ejecutar la app, debes configurar las integraciones de Google.

1. Lee la documentación completa: **[GOOGLE_INTEGRATION.md](./GOOGLE_INTEGRATION.md)**
2. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/)
3. Habilita las APIs necesarias (Drive, Sheets, Maps)
4. Genera credenciales OAuth 2.0
5. Copia `.env.example` a `.env` y completa las variables

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📚 Documentación

- **[GOOGLE_INTEGRATION.md](./GOOGLE_INTEGRATION.md)** - Guía completa de integración con Google
- **[BLOG_LUGARES.md](./BLOG_LUGARES.md)** - Documentación del sistema de lugares

## 🛠️ Tecnologías

- **Frontend:**
  - React 19.1.1
  - Vite 7.2.1
  - ESLint

- **Google Services:**
  - Google Drive API (almacenamiento)
  - Google Sheets API (base de datos)
  - Google Maps JavaScript API (mapas)
  - Google Forms (reservaciones)

- **Librerías:**
  - `googleapis` - Cliente oficial de Google APIs
  - `google-auth-library` - Autenticación OAuth 2.0
  - `@react-google-maps/api` - Componentes de Maps para React

## 📁 Estructura del Proyecto

```
nahueltrek/
├── src/
│   ├── components/
│   │   ├── Admin.jsx           # Panel de administración
│   │   ├── BlogLugares.jsx     # Gestión de lugares
│   │   ├── MapPicker.jsx       # Selector de ubicación
│   │   └── MapDisplay.jsx      # Visualización de mapas
│   ├── services/
│   │   ├── DriveService.js     # Servicio de Google Drive
│   │   └── SheetsService.js    # Servicio de Google Sheets
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globales
├── scripts/
│   └── migrate-to-sheets.js    # Migración JSON → Sheets
├── data/
│   ├── actividades.json        # (Legacy) Backup de actividades
│   └── lugares.json            # (Legacy) Backup de lugares
├── uploads/                    # (Legacy) Imágenes locales
├── .env.example                # Template de variables de entorno
├── GOOGLE_INTEGRATION.md       # Documentación de Google
└── BLOG_LUGARES.md            # Documentación de lugares
```

## 🔐 Seguridad

- ✅ `.env` está en `.gitignore` (no se sube a GitHub)
- ✅ `credentials.json` está protegido
- ✅ `token.json` no se comparte
- ✅ API Keys con restricciones de dominio
- ✅ OAuth 2.0 con scopes limitados

**⚠️ NUNCA subas credenciales a repositorios públicos**

## 🌐 Despliegue

### Hostinger

1. Compilar el proyecto:
   ```bash
   npm run build
   ```

2. Subir contenido de `dist/` a `public_html/` vía FTP/SFTP

3. Crear archivo `.htaccess` para SPA routing:
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

4. Actualizar URLs en Google Cloud Console:
   - Agregar `https://nahueltrek.0km.app` a redirect URIs
   - Actualizar restricciones de API Keys

Ver más detalles en [GOOGLE_INTEGRATION.md](./GOOGLE_INTEGRATION.md#despliegue-en-producción)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y propiedad de 0KM Agencia Digital.

## 👥 Autores

- **0KM Agencia Digital** - [GitHub](https://github.com/0kmagenciadigital-boop)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación en [GOOGLE_INTEGRATION.md](./GOOGLE_INTEGRATION.md)
2. Busca en [Issues](https://github.com/0kmagenciadigital-boop/nahueltrek/issues)
3. Crea un nuevo Issue con detalles del problema

## 📊 Estado del Proyecto

- ✅ UI moderna implementada
- ✅ Admin panel funcional
- ✅ Sistema de lugares (blog)
- ✅ Relación lugares-actividades
- ✅ Imagen única por actividad
- ✅ Integración Google Drive (NEW)
- ✅ Integración Google Sheets (NEW)
- ✅ Integración Google Maps (NEW)
- ✅ Integración Google Forms (NEW)
- ⏳ Deployment en producción (pendiente)

---

**¡Gracias por usar NahuelTrek! 🏔️✨**

