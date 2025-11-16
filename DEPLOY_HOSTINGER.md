# 🚀 Guía de Deployment a Hostinger - NahuelTrek

## 📦 Archivos Compilados

El proyecto ya está compilado y listo en la carpeta `dist/`

**Build completado:**
- ✅ index.html (0.63 kB)
- ✅ CSS: 233.40 kB (comprimido: 31.73 kB)
- ✅ JavaScript: 247.52 kB (comprimido: 73.84 kB)
- ✅ Imágenes NDR: 7 archivos (2.35 MB total)
- ✅ Logo incluido

---

## 📋 Pasos para Subir a Hostinger

### 1. Conectar por FTP/SFTP

**Opción A: FileZilla (Recomendado)**

1. Descargar FileZilla: https://filezilla-project.org/
2. Abrir FileZilla
3. Configurar conexión:
   - **Host:** `ftp.nahueltrek.0km.app` o `ftp.0km.app`
   - **Usuario:** (tu usuario de Hostinger)
   - **Contraseña:** (tu contraseña)
   - **Puerto:** 21 (FTP) o 22 (SFTP - más seguro)
4. Clic en "Conexión rápida"

**Opción B: Panel de Hostinger (File Manager)**

1. Ir a https://hpanel.hostinger.com/
2. Login con tu cuenta
3. Seleccionar el dominio `nahueltrek.0km.app`
4. Ir a **Archivos** → **Administrador de archivos**
5. Navegar a `public_html/`

---

### 2. Limpiar Directorio (Opcional pero Recomendado)

**⚠️ IMPORTANTE:** Haz backup primero si hay algo importante

En `public_html/`:
1. Seleccionar todos los archivos existentes
2. Eliminar o mover a carpeta `_backup_old/`

---

### 3. Subir Archivos del Build

Desde tu computadora, ir a: `d:\nahueltrek-source\dist\`

**Subir TODO el contenido de `dist/` a `public_html/`:**

```
public_html/
├── index.html
├── assets/
│   ├── index-CV1I2UyN.js
│   ├── index-CzOjZOHV.css
│   ├── logo-CUECnOxu.png
│   ├── [7 imágenes NDR].jfif
```

**Métodos de subida:**

- **FileZilla:** Arrastrar carpeta `assets/` y archivo `index.html` al panel derecho
- **File Manager:** Clic en "Upload" → Seleccionar archivos → Subir

---

### 4. Subir Backend PHP (APIs)

Crear carpeta `api/` en `public_html/`:

```
public_html/
├── api/
│   ├── actividades.php
│   ├── lugares.php
│   └── upload-image.php
```

Subir desde: `d:\nahueltrek-source\api\`

---

### 5. Subir Carpetas de Datos

Crear y subir:

```
public_html/
├── data/
│   ├── actividades.json
│   └── lugares.json (con los 10 lugares de La Araucanía)
├── uploads/
│   └── [imágenes subidas por usuarios]
```

**⚠️ IMPORTANTE:** Cambiar permisos de estas carpetas:

- `data/` → Permisos: **755** (rwxr-xr-x)
- `uploads/` → Permisos: **755** (rwxr-xr-x)
- `actividades.json` → Permisos: **644** (rw-r--r--)
- `lugares.json` → Permisos: **644** (rw-r--r--)

**Cómo cambiar permisos en FileZilla:**
1. Clic derecho en carpeta → "Permisos de archivo..."
2. Ingresar número: `755` para carpetas, `644` para archivos
3. Marcar "Aplicar cambios a archivos y carpetas de forma recursiva"
4. OK

**Cómo cambiar permisos en File Manager:**
1. Seleccionar carpeta → Clic derecho → "Permisos"
2. Configurar: Propietario: Leer+Escribir+Ejecutar, Grupo: Leer+Ejecutar, Público: Leer+Ejecutar
3. Guardar

---

### 6. Configurar .htaccess para SPA Routing

Crear archivo `.htaccess` en `public_html/`:

```apache
# Habilitar rewrite
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # No reescribir archivos que existen
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Redirigir todo al index.html para React Router
  RewriteRule . /index.html [L]
</IfModule>

# Configurar PHP para APIs
<FilesMatch "\.php$">
  SetHandler application/x-httpd-php82
</FilesMatch>

# Habilitar CORS para APIs
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>

# Comprimir archivos para mejor rendimiento
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>

# Cache para assets estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Cómo crear .htaccess:**

- **FileZilla:** Clic derecho en panel remoto → "Crear archivo" → Nombre: `.htaccess`
- **File Manager:** Botón "+ Archivo" → Nombre: `.htaccess` → Editar → Pegar contenido

---

### 7. Verificar Estructura Final

```
public_html/
├── .htaccess
├── index.html
├── assets/
│   ├── index-CV1I2UyN.js
│   ├── index-CzOjZOHV.css
│   └── [imágenes]
├── api/
│   ├── actividades.php
│   ├── lugares.php
│   └── upload-image.php
├── data/
│   ├── actividades.json
│   └── lugares.json
└── uploads/
    └── [vacío por ahora]
```

---

## ✅ Verificación Post-Deploy

### 1. Probar el Sitio

Visitar: https://nahueltrek.0km.app

**Debe cargar:**
- ✅ Página principal con hero
- ✅ Menú de navegación
- ✅ Sección NDR con 7 imágenes
- ✅ Calendario de actividades
- ✅ Footer

### 2. Probar APIs

Abrir en navegador o usar curl:

```bash
# API de actividades
https://nahueltrek.0km.app/api/actividades.php

# API de lugares (debe mostrar los 10 lugares)
https://nahueltrek.0km.app/api/lugares.php
```

**Debe retornar:** JSON con datos (no error 404 o 500)

### 3. Probar Blog de Lugares

1. En el sitio, hacer scroll al menú
2. Clic en "Lugares" (o botón "📍 Blog Lugares" si estás autenticado)
3. Debe mostrar los 10 lugares de La Araucanía:
   - Parque Nacional Conguillío ⭐
   - Volcán Villarrica ⭐
   - Parque Nacional Huerquehue ⭐
   - Ojos del Caburga
   - Parque Nacional Nahuelbuta ⭐
   - Termas Geométricas
   - Lago Caburga
   - Saltos del Huilo Huilo
   - Centro de Esquí Corralco
   - Laguna Arcoíris

### 4. Probar Panel Admin

1. Hacer clic en "Admin" en el menú
2. Login con contraseña: `nahueltrek2025`
3. Verificar que puedes:
   - ✅ Ver actividades
   - ✅ Agregar nueva actividad
   - ✅ Subir imagen (debe funcionar si permisos están OK)
   - ✅ Editar actividad existente

### 5. Abrir Consola del Navegador (F12)

**No debe haber:**
- ❌ Errores 404 (archivos no encontrados)
- ❌ Errores 500 (error del servidor)
- ❌ Errores CORS (problemas de acceso a API)
- ❌ Errores de JavaScript

---

## 🐛 Troubleshooting

### Problema: "Página en blanco"

**Causa:** Ruta incorrecta de archivos

**Solución:**
1. Verificar que `index.html` está en la raíz de `public_html/`
2. Verificar que carpeta `assets/` está junto a `index.html`
3. Abrir consola (F12) y ver errores específicos

---

### Problema: "API no funciona - Error 404"

**Causa:** Carpeta `api/` no existe o PHP no está habilitado

**Solución:**
1. Verificar que `api/` está en `public_html/api/`
2. Verificar extensión `.php` en los archivos
3. En panel Hostinger → Configuración → Verificar que PHP 8.x está habilitado
4. Verificar `.htaccess` está creado con configuración de PHP

---

### Problema: "No se pueden subir imágenes"

**Causa:** Permisos incorrectos en carpeta `uploads/`

**Solución:**
1. Verificar permisos de `uploads/`: debe ser **755**
2. Verificar permisos de `api/upload-image.php`: debe ser **644**
3. Si aún falla, cambiar permisos de `uploads/` a **777** (menos seguro pero funciona)

---

### Problema: "JSON no se guarda (actividades/lugares)"

**Causa:** Permisos incorrectos en carpeta `data/`

**Solución:**
1. Permisos de `data/`: **755**
2. Permisos de archivos JSON: **644**
3. Verificar que el usuario PHP tiene permisos de escritura

---

### Problema: "CSS o JS no cargan"

**Causa:** Ruta incorrecta o caché del navegador

**Solución:**
1. Hacer **Ctrl+Shift+R** (hard refresh) en el navegador
2. Verificar en panel de Network (F12 → Network) qué archivos fallan
3. Verificar que nombres de archivos en `index.html` coinciden con los de `assets/`

---

## 📱 Optimizaciones Post-Deploy

### 1. Configurar SSL/HTTPS

En panel de Hostinger:
1. **Seguridad** → **SSL**
2. Activar "Let's Encrypt SSL" (gratis)
3. Forzar HTTPS: Activar redirección automática

### 2. Configurar DNS (si no está ya)

En panel de Hostinger:
1. **Dominios** → Seleccionar `nahueltrek.0km.app`
2. Verificar que apunta a la IP correcta del hosting

### 3. Configurar Backups Automáticos

En panel de Hostinger:
1. **Archivos** → **Backups**
2. Configurar backup semanal automático

---

## 🎯 Próximos Pasos

Una vez que el sitio esté funcionando en producción:

1. **Configurar Google Services** (elimina necesidad de PHP):
   - Ver archivo `GOOGLE_INTEGRATION.md`
   - Configurar Google Drive para imágenes
   - Configurar Google Sheets para base de datos
   - Configurar Google Maps para ubicaciones

2. **Agregar más contenido:**
   - Más actividades en el calendario
   - Más lugares en el blog
   - Fotos propias en la galería

3. **SEO y Marketing:**
   - Agregar meta tags para redes sociales
   - Configurar Google Analytics
   - Crear sitemap.xml
   - Registrar en Google Search Console

---

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía completa
2. Verifica logs de error en Hostinger: **Archivos** → **Logs de error**
3. Abre consola del navegador (F12) para ver errores específicos
4. Contacta soporte de Hostinger si es problema del servidor

---

**¡Éxito con tu deployment! 🚀🏔️**
