# 🎨 Be·Lu Cerámica Studio - Guía de Inicio

## ✅ Tu app está lista para usar

He creado una aplicación web completa para gestionar Be·Lu Cerámica Studio con todas las funcionalidades que solicitaste.

---

## 🚀 Cómo Iniciar

### Opción 1: Línea de comandos
```bash
cd C:\Users\I556043\Desktop\BeluCeramicaApp
npm start
```

### Opción 2: Con Claude Code (recomendado)
En la interfaz de Claude Code, presiona **Ctrl+K** y busca "launch" o usa el botón de preview.

---

## 🌐 Acceder a la App

Una vez que el servidor está corriendo, abre tu navegador en:
```
http://localhost:5000
```

---

## 👤 Cuentas de Prueba

### Administradoras
```
Email: beludeanquin@gmail.com
Contraseña: admin123

Email: lucrebayj@gmail.com
Contraseña: admin123
```

### Alumnas (Registro libre)
Cualquiera puede registrarse con nombre, apellido, email y contraseña.

---

## 📋 Funcionalidades Implementadas

### ✨ Para Alumnas:
- ✅ Registro e inicio de sesión
- ✅ Ver clases disponibles
- ✅ Inscribirse a clases (máx 10 por turno)
- ✅ Seguimiento de pagos
- ✅ Ver reglas de la casa
- ✅ Ver horarios y precios
- ✅ Ver catálogo de piezas bizcocho
- ✅ Ver piezas contramolde

### 📊 Para Administradoras:
- ✅ Dashboard con estadísticas
- ✅ Crear y programar clases
- ✅ Ver listado de alumnas registradas
- ✅ Gestionar piezas bizcocho
- ✅ Gestionar piezas contramolde
- ✅ Registrar pagos
- ✅ Control de asistencia

---

## 🎨 Diseño

La app usa **colores pasteles extraídos de tu logo**:
- Rosa pastel (#F5D5D0) - Principal
- Terracota suave (#D4A5A0) - Acentos
- Colores tierra claros - Secundarios

Completamente **responsive**: funciona en celular, tablet y desktop.

---

## 📅 Datos Iniciales Cargados

### Clases de Junio 2026:
- **Jueves 4 de Junio** - 18:00 a 20:00
- **Viernes 5 de Junio** - 10:00 a 12:00 y 18:00 a 20:00
- **Jueves 18 de Junio** - 18:00 a 20:00
- **Viernes 19 de Junio** - 10:00 a 12:00 y 18:00 a 20:00
- **Jueves 25 de Junio** - 18:00 a 20:00

### Piezas Bizcocho (Ejemplos):
- Taza Base - $5.000
- Plato Decorativo - $8.000
- Macetas - $4.000-$6.000
- Cuenco - $7.000

### Piezas Contramolde (Ejemplos):
- Forma de Hoja - $12.000
- Forma de Flor - $15.000
- Y más...

---

## 📊 Reglas Configuradas

✓ **Cancelación:** 24 horas antes de la clase
✓ **Pagos:** Hasta el 10 de cada mes
✓ **Recargo:** 10% después del vencimiento
✓ **Seña:** $10.000
✓ **Taller regular:** $70.000/mes
✓ **Clase suelta:** $27.000
✓ **Lugares por turno:** 10

---

## 🔧 Estructura de Carpetas

```
BeluCeramicaApp/
├── server.js              ← Backend (Express + SQLite)
├── public/
│   └── index.html         ← Frontend (React todo en uno)
├── init-db.js             ← Script para inicializar datos
├── belu_ceramica.db       ← Base de datos (se crea automáticamente)
├── package.json           ← Dependencias
├── .env                   ← Variables de entorno
├── .claude/
│   └── launch.json        ← Configuración para preview
└── README.md              ← Documentación técnica
```

---

## ⚙️ Tecnologías Usadas

- **Backend:** Node.js + Express
- **Base de datos:** SQLite3
- **Frontend:** React 18 (sin build, directo en HTML)
- **Autenticación:** JWT + bcryptjs
- **Estilos:** CSS3 con variables personalizadas

---

## 🎯 Próximos Pasos (Opcionales)

Si quieres mejoras futuras, podemos agregar:

1. **Notificaciones por email** - Recordatorios de clases y pagos
2. **Integración WhatsApp** - Avisos automáticos
3. **Galería de imágenes** - Para piezas
4. **Reportes en PDF** - Estados de pago
5. **Sistema de calificaciones** - Para trabajos
6. **Backup automático** - De la base de datos

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar las contraseñas de admin?**
R: Sí, inicialmente están como "admin123" pero puedes cambiarlas en la base de datos.

**P: ¿Qué pasa si las alumnas no pagan a tiempo?**
R: La app registra el atraso. Ustedes pueden marcar manualmente qué alumnas pueden seguir asistiendo.

**P: ¿Puedo agregar más clases durante el mes?**
R: Sí, desde el panel de admin puedes crear nuevas clases en cualquier momento.

**P: ¿Las alumnas pueden cancelar clases?**
R: La funcionalidad está lista para implementar, actualmente solo se pueden inscribir.

---

## 📞 Soporte

Si algo no funciona o quieres hacer cambios, avísame y lo ajustamos.

---

¡A disfrutar tu app! 💜🎨

Hecho con amor para Be·Lu Cerámica Studio
