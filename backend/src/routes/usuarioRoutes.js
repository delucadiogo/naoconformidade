const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para registro de usuário
router.post('/registrar', usuarioController.registrar);

// Rota para login
router.post('/login', usuarioController.login);

module.exports = router; 