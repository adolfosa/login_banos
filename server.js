const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth'); // Rutas relacionadas con login, registro, logout

const app = express();

// Middleware para interpretar datos enviados por formularios (formato URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta "public" (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión del usuario
app.use(session({
  secret: 'clave-segura-wit',        // Clave para firmar la cookie de sesión
  resave: false,                     // No guarda la sesión si no hubo cambios
  saveUninitialized: false           // No guarda sesiones vacías (sin login)
}));

// Uso del router principal en la raíz de la app ('/')
app.use('/', authRoutes);            // Esto activa todas las rutas definidas en routes/auth.js

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
