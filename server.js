require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const conectarDB = require('./config/db');

const usuarioRoutes = require('./routes/usuario.routes');
// const entidadRoutes = require('./routes/entidad.routes'); // se agrega cuando definamos la entidad asignada

const app = express();

conectarDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/usuarios'));

app.use('/', usuarioRoutes);
// app.use('/', entidadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
