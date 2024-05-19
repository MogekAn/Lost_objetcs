const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('../routes/auth');
const studentRoutes = require('../routes/students');
const adminRoutes = require('../routes/admin');

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/admin', adminRoutes);

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
