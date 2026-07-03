const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/usuarios', usuarioController.listarUsuarios);
router.get('/usuarios/api', usuarioController.listarUsuariosJSON);
router.get('/usuarios/nuevo', usuarioController.formularioNuevo);
router.get('/usuarios/:id', usuarioController.obtenerUsuario);
router.post('/usuarios', usuarioController.crearUsuario);

module.exports = router;
