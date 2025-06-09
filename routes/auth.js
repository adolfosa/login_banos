const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../db_config/db');

const router = express.Router();

// Ruta principal de login
router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('http://localhost:8080/index.html');
  }
  res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Procesar login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.send(`<script>alert("Usuario no encontrado"); window.location.href="/";</script>`);
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user.username;
      return res.redirect('/');
    } else {
      return res.send(`<script>alert("Contraseña incorrecta"); window.location.href="/";</script>`);
    }

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Mostrar formulario de registro
router.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'registro.html'));
});

// Procesar registro
router.post('/registro', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.send(`<script>alert("Usuario ya existe"); window.location.href="/registro";</script>`);
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);

    res.send(`<script>alert("Usuario creado exitosamente"); window.location.href="/";</script>`);
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});

module.exports = router;
