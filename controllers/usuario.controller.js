const Usuario = require('../models/usuario.model');

// GET /usuarios -> lista todos los usuarios (vista tabla)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ fechaRegistro: -1 });
    res.render('usuarios/list', { usuarios, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).render('usuarios/list', { usuarios: [], error: 'Error al listar usuarios' });
  }
};

// GET /usuarios/nuevo -> formulario de creacion
exports.formularioNuevo = (req, res) => {
  res.render('usuarios/form', { usuario: null, error: null });
};

// GET /usuarios/api -> version JSON (util para pruebas / consumo API)
exports.listarUsuariosJSON = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// POST /usuarios -> crea un usuario nuevo
exports.crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      rut,
      correo,
      telefono,
      fechaNacimiento,
      nacionalidad,
      genero,
      contrasena,
      comuna,
      calle,
      numero,
      departamentoOficina
    } = req.body;

    const nuevoUsuario = new Usuario({
      nombre,
      rut,
      correo,
      telefono,
      fechaNacimiento: fechaNacimiento || undefined,
      nacionalidad,
      genero,
      contrasena,
      direccion: {
        comuna,
        calle,
        numero,
        departamentoOficina
      }
    });

    await nuevoUsuario.save();
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    const mensaje =
      error.code === 11000
        ? 'Ya existe un usuario con ese RUT o correo'
        : Object.values(error.errors || {}).map((e) => e.message).join(' | ') || 'Error al crear usuario';
    res.status(400).render('usuarios/form', { usuario: req.body, error: mensaje });
  }
};

// GET /usuarios/:id -> obtiene un usuario puntual (JSON)
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};
