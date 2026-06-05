const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'belu-ceramica-studio-secret-key-2026';

console.log(`🚀 Servidor iniciando en puerto ${PORT}`);

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(express.static('public', { etag: false, lastModified: false, maxAge: 0 }));

// Base de datos en JSON
const dbFile = path.join(__dirname, 'data.json');
const defaultDb = {
  users: [
    { id: 1, email: 'beludeanquin@gmail.com', nombre: 'Belu', apellido: 'Deanquin', password: bcrypt.hashSync('admin123', 10), role: 'admin', created_at: new Date().toISOString() },
    { id: 2, email: 'lucrebayj@gmail.com', nombre: 'Lucrecia', apellido: 'Bayj', password: bcrypt.hashSync('admin123', 10), role: 'admin', created_at: new Date().toISOString() }
  ],
  clases: [],
  inscripciones: [],
  pagos: [],
  piezas_bizcocho: [],
  piezas_contramolde: []
};

let db = defaultDb;
let idCounters = { userId: 3, claseId: 1, inscripcionId: 1, pagoId: 1, piezaId: 1 };

const loadDb = () => {
  try {
    if (fs.existsSync(dbFile)) {
      db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      idCounters.userId = Math.max(...db.users.map(u => u.id || 0)) + 1;
      console.log('✅ Base de datos cargada');
    } else {
      saveDb();
      console.log('✅ Base de datos inicializada');
    }
  } catch (err) {
    console.error('Error cargando DB:', err);
  }
};

const saveDb = () => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error guardando DB:', err);
  }
};

loadDb();

// MIDDLEWARE
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradoras' });
  }
  next();
};

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido, role: user.role }
  });
});

app.post('/api/auth/registrar-alumna', verificarToken, verificarAdmin, (req, res) => {
  const { email, nombre, apellido, password } = req.body;
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email ya registrado' });
  }

  const newUser = {
    id: idCounters.userId++,
    email,
    nombre,
    apellido,
    password: bcrypt.hashSync(password, 10),
    role: 'alumna',
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();
  res.json({ ...newUser, password: undefined });
});

// CLASES
app.get('/api/clases', (req, res) => {
  res.json(db.clases.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
});

app.post('/api/clases', verificarToken, verificarAdmin, (req, res) => {
  const { fecha, dia, horario, turno } = req.body;
  const newClase = {
    id: idCounters.claseId++,
    fecha,
    dia,
    horario,
    turno,
    created_at: new Date().toISOString()
  };
  db.clases.push(newClase);
  saveDb();
  res.json(newClase);
});

// INSCRIPCIONES
app.post('/api/inscripciones', verificarToken, (req, res) => {
  const { clase_id } = req.body;
  const user_id = req.user.id;

  const count = db.inscripciones.filter(i => i.user_id === user_id).length;
  if (count >= 3) {
    return res.status(400).json({ error: 'Solo puedes inscribirte a máximo 3 clases por mes' });
  }

  const newInscripcion = {
    id: idCounters.inscripcionId++,
    user_id,
    clase_id,
    asistio: 0,
    fecha_inscripcion: new Date().toISOString()
  };
  db.inscripciones.push(newInscripcion);
  saveDb();
  res.json(newInscripcion);
});

app.delete('/api/inscripciones/:claseId', verificarToken, (req, res) => {
  const index = db.inscripciones.findIndex(i => i.clase_id == req.params.claseId && i.user_id == req.user.id);
  if (index !== -1) {
    db.inscripciones.splice(index, 1);
    saveDb();
  }
  res.json({ message: 'Cancelado' });
});

app.get('/api/mis-clases', verificarToken, (req, res) => {
  const claseIds = db.inscripciones.filter(i => i.user_id == req.user.id).map(i => i.clase_id);
  res.json(db.clases.filter(c => claseIds.includes(c.id)));
});

// PAGOS
app.get('/api/pagos/:userId', verificarToken, (req, res) => {
  res.json(db.pagos.filter(p => p.user_id == req.params.userId));
});

app.post('/api/pagos', verificarToken, verificarAdmin, (req, res) => {
  const { user_id, monto, tipo, mes, año } = req.body;
  const newPago = {
    id: idCounters.pagoId++,
    user_id,
    monto,
    tipo,
    mes,
    año,
    estado: 'pendiente',
    fecha_pago: null,
    fecha_vencimiento: new Date(año, mes - 1, 10).toISOString(),
    created_at: new Date().toISOString()
  };
  db.pagos.push(newPago);
  saveDb();
  res.json(newPago);
});

// PIEZAS
app.get('/api/piezas-bizcocho', (req, res) => {
  res.json(db.piezas_bizcocho);
});

app.post('/api/piezas-bizcocho', verificarToken, verificarAdmin, (req, res) => {
  const { modelo, descripcion, valor, cantidad_disponible } = req.body;
  const newPieza = {
    id: idCounters.piezaId++,
    modelo,
    descripcion,
    valor,
    cantidad_disponible,
    created_at: new Date().toISOString()
  };
  db.piezas_bizcocho.push(newPieza);
  saveDb();
  res.json(newPieza);
});

app.get('/api/piezas-contramolde', (req, res) => {
  res.json(db.piezas_contramolde);
});

app.post('/api/piezas-contramolde', verificarToken, verificarAdmin, (req, res) => {
  const { modelo, valor } = req.body;
  const newPieza = {
    id: idCounters.piezaId++,
    modelo,
    valor,
    created_at: new Date().toISOString()
  };
  db.piezas_contramolde.push(newPieza);
  saveDb();
  res.json(newPieza);
});

// ALUMNAS
app.get('/api/alumnas', verificarToken, verificarAdmin, (req, res) => {
  res.json(db.users.filter(u => u.role === 'alumna').map(u => ({ id: u.id, email: u.email, nombre: u.nombre, apellido: u.apellido, role: u.role, created_at: u.created_at })));
});

app.delete('/api/alumnas/:id', verificarToken, verificarAdmin, (req, res) => {
  const idx = db.users.findIndex(u => u.id == req.params.id);
  if (idx !== -1) {
    db.users.splice(idx, 1);
    db.inscripciones = db.inscripciones.filter(i => i.user_id != req.params.id);
    db.pagos = db.pagos.filter(p => p.user_id != req.params.id);
    saveDb();
  }
  res.json({ message: 'Eliminada' });
});

app.put('/api/alumnas/:id', verificarToken, verificarAdmin, (req, res) => {
  const { email, nombre, apellido } = req.body;
  const user = db.users.find(u => u.id == req.params.id);
  if (user) {
    user.email = email;
    user.nombre = nombre;
    user.apellido = apellido;
    saveDb();
  }
  res.json({ message: 'Actualizada' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});

// Keep-alive para Render
if (process.env.RENDER) {
  setInterval(() => {
    const http = require('http');
    const url = `http://localhost:${PORT}/health`;
    http.get(url, () => {
      console.log(`🔄 Keep-alive ping: ${new Date().toISOString()}`);
    }).on('error', () => {});
  }, 540000); // Cada 9 minutos
}
