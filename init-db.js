const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./belu_ceramica.db');

// Crear cuentas admin
const adminEmails = [
  { email: 'beludeanquin@gmail.com', nombre: 'Belu', apellido: 'Deanquin' },
  { email: 'lucrebayj@gmail.com', nombre: 'Lucrecia', apellido: 'Bayj' }
];

const adminPassword = bcrypt.hashSync('admin123', 10);

db.serialize(() => {
  adminEmails.forEach(admin => {
    db.run(
      `INSERT OR IGNORE INTO users (email, nombre, apellido, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [admin.email, admin.nombre, admin.apellido, adminPassword, 'admin'],
      (err) => {
        if (err) console.error(err);
        else console.log(`✓ Admin ${admin.email} creado/a`);
      }
    );
  });

  // Crear clases de ejemplo para junio 2026
  const clases = [
    { fecha: '2026-06-04', dia: 'Jueves', horario: '18:00 - 20:00', turno: 'J1' },
    { fecha: '2026-06-05', dia: 'Viernes', horario: '10:00 - 12:00', turno: 'V1' },
    { fecha: '2026-06-05', dia: 'Viernes', horario: '18:00 - 20:00', turno: 'V2' },
    { fecha: '2026-06-18', dia: 'Jueves', horario: '18:00 - 20:00', turno: 'J2' },
    { fecha: '2026-06-19', dia: 'Viernes', horario: '10:00 - 12:00', turno: 'V3' },
    { fecha: '2026-06-19', dia: 'Viernes', horario: '18:00 - 20:00', turno: 'V4' },
    { fecha: '2026-06-25', dia: 'Jueves', horario: '18:00 - 20:00', turno: 'J3' },
  ];

  clases.forEach(clase => {
    db.run(
      `INSERT OR IGNORE INTO clases (fecha, dia, horario, turno)
       VALUES (?, ?, ?, ?)`,
      [clase.fecha, clase.dia, clase.horario, clase.turno],
      (err) => {
        if (!err) console.log(`✓ Clase ${clase.fecha} ${clase.horario} creada`);
      }
    );
  });

  // Crear piezas bizcocho de ejemplo
  const piezasBizcocho = [
    { modelo: 'Taza Base', descripcion: 'Taza clásica de cerámica', valor: 5000, cantidad: 20 },
    { modelo: 'Plato Decorativo', descripcion: 'Plato redondo 25cm', valor: 8000, cantidad: 15 },
    { modelo: 'Maceta Pequeña', descripcion: 'Maceta cilíndrica 10cm', valor: 4000, cantidad: 25 },
    { modelo: 'Maceta Mediana', descripcion: 'Maceta cilíndrica 15cm', valor: 6000, cantidad: 20 },
    { modelo: 'Cuenco', descripcion: 'Cuenco profundo 20cm', valor: 7000, cantidad: 12 },
  ];

  piezasBizcocho.forEach(pieza => {
    db.run(
      `INSERT OR IGNORE INTO piezas_bizcocho (modelo, descripcion, valor, cantidad_disponible)
       VALUES (?, ?, ?, ?)`,
      [pieza.modelo, pieza.descripcion, pieza.valor, pieza.cantidad],
      (err) => {
        if (!err) console.log(`✓ Pieza bizcocho "${pieza.modelo}" creada`);
      }
    );
  });

  // Crear piezas contramolde de ejemplo
  const piezasContramolde = [
    { modelo: 'Forma de Hoja', valor: 12000 },
    { modelo: 'Forma de Flor', valor: 15000 },
    { modelo: 'Forma Geométrica', valor: 10000 },
    { modelo: 'Figura Miniatura', valor: 8000 },
  ];

  piezasContramolde.forEach(pieza => {
    db.run(
      `INSERT OR IGNORE INTO piezas_contramolde (modelo, valor)
       VALUES (?, ?)`,
      [pieza.modelo, pieza.valor],
      (err) => {
        if (!err) console.log(`✓ Pieza contramolde "${pieza.modelo}" creada`);
      }
    );
  });
});

db.close(() => {
  console.log('\n✅ Base de datos inicializada correctamente');
  console.log('\n📋 Credenciales de admin:');
  console.log('   Email: beludeanquin@gmail.com');
  console.log('   Contraseña: admin123');
  console.log('\n   Email: lucrebayj@gmail.com');
  console.log('   Contraseña: admin123');
});
