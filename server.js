const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Reinicio de servidor - 2026-06-05
const app = express();
const PORT = process.env.PORT || process.env.RAILWAY_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-cambiar-en-prod';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar base de datos
const db = new sqlite3.Database('./belu_ceramica.db', (err) => {
  if (err) console.error('Error al conectar DB:', err);
  else console.log('Base de datos conectada');
});

// Crear tablas
db.serialize(() => {
  // Tabla de usuarias
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    nombre TEXT,
    apellido TEXT,
    password TEXT,
    role TEXT DEFAULT 'alumna',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de clases
  db.run(`CREATE TABLE IF NOT EXISTS clases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE,
    dia TEXT,
    horario TEXT,
    turno TEXT,
    capacidad INTEGER DEFAULT 10,
    asistentes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de inscripciones a clases
  db.run(`CREATE TABLE IF NOT EXISTS inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    clase_id INTEGER,
    asistio INTEGER DEFAULT 0,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(clase_id) REFERENCES clases(id)
  )`);

  // Tabla de pagos
  db.run(`CREATE TABLE IF NOT EXISTS pagos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    monto REAL,
    tipo TEXT,
    mes INTEGER,
    año INTEGER,
    estado TEXT DEFAULT 'pendiente',
    fecha_pago DATETIME,
    fecha_vencimiento DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Tabla de workshops
  db.run(`CREATE TABLE IF NOT EXISTS workshops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    descripcion TEXT,
    fecha DATE,
    horario TEXT,
    precio REAL,
    capacidad INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de inscripciones a workshops
  db.run(`CREATE TABLE IF NOT EXISTS workshop_inscripciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    workshop_id INTEGER,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(workshop_id) REFERENCES workshops(id)
  )`);

  // Tabla de piezas bizcocho
  db.run(`CREATE TABLE IF NOT EXISTS piezas_bizcocho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo TEXT,
    descripcion TEXT,
    valor REAL,
    cantidad_disponible INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de reservas de piezas
  db.run(`CREATE TABLE IF NOT EXISTS reservas_piezas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pieza_id INTEGER,
    cantidad INTEGER,
    estado TEXT DEFAULT 'activa',
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(pieza_id) REFERENCES piezas_bizcocho(id)
  )`);

  // Tabla de piezas contramolde
  db.run(`CREATE TABLE IF NOT EXISTS piezas_contramolde (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    modelo TEXT,
    valor REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// MIDDLEWARE DE AUTENTICACIÓN
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
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

// AUTENTICACIÓN - Solo para admins
app.post('/api/auth/register', (req, res) => {
  res.status(403).json({ error: 'El registro de alumnas lo hace solo la administración' });
});

// Admin registra una alumna
app.post('/api/auth/registrar-alumna', verificarToken, verificarAdmin, (req, res) => {
  console.log('✓ ENDPOINT REGISTRAR ALUMNA LLAMADO');
  const { email, nombre, apellido, password } = req.body;

  if (!email || !nombre || !apellido || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (email, nombre, apellido, password, role) VALUES (?, ?, ?, ?, ?)`,
    [email, nombre, apellido, hashedPassword, 'alumna'],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email ya registrado o datos inválidos' });

      res.json({
        id: this.lastID,
        email,
        nombre,
        apellido,
        role: 'alumna',
        message: 'Alumna registrada exitosamente'
      });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Usuario no encontrado' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role
      }
    });
  });
});

// CLASES - ADMIN
app.post('/api/clases', verificarToken, verificarAdmin, (req, res) => {
  const { fecha, dia, horario, turno } = req.body;
  db.run(
    `INSERT INTO clases (fecha, dia, horario, turno) VALUES (?, ?, ?, ?)`,
    [fecha, dia, horario, turno],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, fecha, dia, horario, turno });
    }
  );
});

app.get('/api/clases', (req, res) => {
  db.all(`SELECT * FROM clases ORDER BY fecha`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// INSCRIPCIONES A CLASES
app.post('/api/inscripciones', verificarToken, (req, res) => {
  const { clase_id } = req.body;
  const user_id = req.user.id;

  // Contar inscripciones actuales del mes
  db.get(
    `SELECT COUNT(*) as count FROM inscripciones WHERE user_id = ?`,
    [user_id],
    (err, row) => {
      if (err) return res.status(400).json({ error: 'Error al verificar inscripciones' });

      if (row.count >= 3) {
        return res.status(400).json({ error: 'Solo puedes inscribirte a máximo 3 clases por mes. Ya tienes 3 inscripciones.' });
      }

      db.run(
        `INSERT INTO inscripciones (user_id, clase_id) VALUES (?, ?)`,
        [user_id, clase_id],
        function (err) {
          if (err) return res.status(400).json({ error: 'Error al inscribirse' });
          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// CANCELAR INSCRIPCIÓN (alumna cancela una clase)
app.delete('/api/inscripciones/:claseId', verificarToken, (req, res) => {
  const { claseId } = req.params;
  const user_id = req.user.id;

  db.run(
    `DELETE FROM inscripciones WHERE user_id = ? AND clase_id = ?`,
    [user_id, claseId],
    function (err) {
      if (err) return res.status(400).json({ error: 'Error al cancelar inscripción' });
      res.json({ message: 'Inscripción cancelada exitosamente' });
    }
  );
});

app.get('/api/mis-clases', verificarToken, (req, res) => {
  db.all(
    `SELECT c.* FROM clases c
     JOIN inscripciones i ON c.id = i.clase_id
     WHERE i.user_id = ? ORDER BY c.fecha`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
});

// PAGOS
app.get('/api/pagos/:userId', verificarToken, (req, res) => {
  db.all(
    `SELECT * FROM pagos WHERE user_id = ? ORDER BY fecha_pago DESC`,
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/api/pagos', verificarToken, verificarAdmin, (req, res) => {
  const { user_id, monto, tipo, mes, año } = req.body;
  const fecha_vencimiento = new Date(año, mes - 1, 10);

  db.run(
    `INSERT INTO pagos (user_id, monto, tipo, mes, año, fecha_vencimiento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, monto, tipo, mes, año, fecha_vencimiento.toISOString()],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// WORKSHOPS
app.get('/api/workshops', (req, res) => {
  db.all(`SELECT * FROM workshops ORDER BY fecha`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/workshops', verificarToken, verificarAdmin, (req, res) => {
  const { titulo, descripcion, fecha, horario, precio, capacidad } = req.body;
  db.run(
    `INSERT INTO workshops (titulo, descripcion, fecha, horario, precio, capacidad)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [titulo, descripcion, fecha, horario, precio, capacidad],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PIEZAS BIZCOCHO
app.get('/api/piezas-bizcocho', (req, res) => {
  db.all(`SELECT * FROM piezas_bizcocho`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/piezas-bizcocho', verificarToken, verificarAdmin, (req, res) => {
  const { modelo, descripcion, valor, cantidad_disponible } = req.body;
  db.run(
    `INSERT INTO piezas_bizcocho (modelo, descripcion, valor, cantidad_disponible)
     VALUES (?, ?, ?, ?)`,
    [modelo, descripcion, valor, cantidad_disponible],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PIEZAS CONTRAMOLDE
app.get('/api/piezas-contramolde', (req, res) => {
  db.all(`SELECT * FROM piezas_contramolde`, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/piezas-contramolde', verificarToken, verificarAdmin, (req, res) => {
  const { modelo, valor } = req.body;
  db.run(
    `INSERT INTO piezas_contramolde (modelo, valor) VALUES (?, ?)`,
    [modelo, valor],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// LISTAR ALUMNAS
app.get('/api/alumnas', verificarToken, verificarAdmin, (req, res) => {
  db.all(
    `SELECT id, email, nombre, apellido, role, created_at FROM users WHERE role = 'alumna' ORDER BY nombre`,
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ELIMINAR ALUMNA (dar de baja)
app.delete('/api/alumnas/:id', verificarToken, verificarAdmin, (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM inscripciones WHERE user_id = ?`, [id], (err) => {
    if (err) return res.status(400).json({ error: err.message });

    db.run(`DELETE FROM pagos WHERE user_id = ?`, [id], (err) => {
      if (err) return res.status(400).json({ error: err.message });

      db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Alumna eliminada exitosamente', id });
      });
    });
  });
});

// EDITAR ALUMNA
app.put('/api/alumnas/:id', verificarToken, verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { email, nombre, apellido } = req.body;

  db.run(
    `UPDATE users SET email = ?, nombre = ?, apellido = ? WHERE id = ?`,
    [email, nombre, apellido, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Alumna actualizada', id });
    }
  );
});

app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`));
