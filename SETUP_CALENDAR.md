# 📅 Setup Rápido - Google Calendar

## Paso 1: Habilitar API

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccionar proyecto `nahueltrek-blog`
3. **APIs y servicios** → **Biblioteca**
4. Buscar **"Google Calendar API"**
5. Clic en **HABILITAR**

## Paso 2: Crear Calendario Dedicado

1. Ir a [Google Calendar](https://calendar.google.com/)
2. Lado izquierdo → **"+"** junto a "Otros calendarios"
3. **"Crear nuevo calendario"**
4. Completar:
   ```
   Nombre: NahuelTrek - Actividades y Reservas
   Descripción: Calendario de trekking y outdoor
   Zona horaria: (GMT-03:00) Santiago
   ```
5. Clic en **"Crear calendario"**

## Paso 3: Configurar Permisos

1. En lista de calendarios → Buscar `NahuelTrek - Actividades y Reservas`
2. Clic en **⋮** (3 puntos) → **"Configuración y uso compartido"**
3. Sección **"Permisos de acceso"**:
   - ☑️ **"Hacer disponible públicamente"**
   - Permisos: **"Ver todos los detalles del evento"**
4. Guardar cambios

## Paso 4: Obtener Calendar ID

1. En la misma página de configuración
2. Bajar hasta **"Integrar calendario"**
3. Copiar el **ID del calendario** 
   - Formato: `abc123def456@group.calendar.google.com`
4. Agregar a tu archivo `.env`:
   ```bash
   VITE_GOOGLE_CALENDAR_ID=abc123def456@group.calendar.google.com
   ```

## Paso 5: Compartir con OAuth

1. En **"Permisos de acceso"** de la configuración del calendario
2. Clic en **"+ Agregar personas y grupos"**
3. Pegar el email de tu cuenta de servicio OAuth
   - Está en `credentials.json` → `client_email`
   - Ejemplo: `nahueltrek@proyecto-123456.iam.gserviceaccount.com`
4. Permisos: **"Hacer cambios en los eventos"**
5. Desmarcar **"Notificar"**
6. Guardar

## ✅ Verificación

Tu `.env` debe tener:

```bash
# Google Calendar
VITE_GOOGLE_CALENDAR_ID=abc123def456@group.calendar.google.com

# Otras variables...
VITE_GOOGLE_CLIENT_ID=tu_client_id
VITE_GOOGLE_CLIENT_SECRET=tu_client_secret
VITE_GOOGLE_SHEETS_ACTIVIDADES_ID=...
VITE_GOOGLE_SHEETS_LUGARES_ID=...
VITE_GOOGLE_SHEETS_RESERVAS_ID=...
```

## 🎯 Funcionalidades

Con Calendar configurado:

### Eventos Automáticos
- ✅ Cada actividad creada → Evento verde en calendario
- ✅ Cada reserva → Evento rojo + email al cliente
- ✅ Editar actividad → Evento se actualiza
- ✅ Eliminar actividad → Evento se borra

### Control de Disponibilidad
- ✅ Máximo 3 reservas por fecha/actividad
- ✅ Verifica disponibilidad antes de reservar
- ✅ Alerta si fecha está llena

### Notificaciones
- ✅ Email al cliente con invitación de calendario
- ✅ Cliente puede agregar a su calendario personal
- ✅ Recordatorios automáticos 1 día y 1 hora antes

### Vista Pública
- ✅ URL pública del calendario: 
  ```
  https://calendar.google.com/calendar/embed?src=TU_CALENDAR_ID
  ```
- ✅ Embed en tu sitio web
- ✅ Clientes ven fechas disponibles

## 🚀 Testing

Después de configurar:

1. **Agregar una actividad** en el admin panel
2. **Verificar** que aparece en Google Calendar
3. **Hacer una reserva** de prueba
4. **Revisar email** de notificación
5. **Verificar evento** en el calendario con datos del cliente

## 🆘 Problemas Comunes

### "Calendar API not enabled"
→ Volver a Paso 1, asegurarse que API está habilitada

### "Insufficient permissions"
→ Verificar Paso 5, compartir calendario con cuenta de servicio

### "Events not showing"
→ Verificar que CALENDAR_ID en `.env` es correcto

### "Client not receiving email"
→ Verificar que calendario es público y tiene permisos correctos

---

**Documentación completa:** Ver `GOOGLE_INTEGRATION.md` sección Calendar
