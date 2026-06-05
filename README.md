# Be·Lu Cerámica Studio - App de Gestión

App web para gestionar clases, inscripciones, pagos y catálogo de piezas.

## Características

✨ **Para Alumnas:**
- Registro e inicio de sesión
- Inscripción a clases mensuales
- Gestión de cambios (hasta 24h antes)
- Seguimiento de pagos
- Catálogo de piezas bizcocho y contramolde
- Información de workshops

📊 **Para Administradoras:**
- Crear y programar clases mensuales
- Registrar asistencia
- Gestionar pagos
- Administrar piezas y reservas
- Panel de estadísticas

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor
```bash
npm start
```

O en modo desarrollo con auto-reload:
```bash
npm run dev
```

### 3. Acceder a la app
Abre tu navegador en: **http://localhost:5000**

## Cuentas de Administradoras

Las cuentas de admin deben crearse manualmente en la base de datos.

**Emails de admin:**
- beludeanquin@gmail.com
- lucrebayj@gmail.com

## Estructura

```
BeluCeramicaApp/
├── server.js           # Backend Express + SQLite
├── public/
│   └── index.html      # Frontend React (todo en uno)
├── belu_ceramica.db    # Base de datos (se crea automáticamente)
├── package.json
├── .env                # Variables de entorno
└── README.md
```

## Datos Iniciales

**Horarios:**
- Jueves: 18:00 - 20:00
- Viernes: 10:00 - 12:00
- Viernes: 18:00 - 20:00

**Precios:**
- Taller regular: $70.000/mes
- Clase suelta: $27.000
- Seña inicial: $10.000

**Reglas:**
- Cancelación: 24 horas antes
- Pagos: hasta el 10 de cada mes
- Recargo por atraso: 10%
- Lugares por turno: 10

## Próximas Mejoras

- [ ] Envío de notificaciones por email
- [ ] Integración con WhatsApp
- [ ] Importar piezas por galería de imágenes
- [ ] Reporte de pagos en PDF
- [ ] Sistema de evaluaciones

---

Hecho con 💜 para Be·Lu Cerámica Studio
