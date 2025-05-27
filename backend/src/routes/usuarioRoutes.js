const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de autenticação
router.post('/auth/login', usuarioController.login);

// Rotas de usuários
router.get('/usuarios', usuarioController.index);
router.get('/usuarios/:id', usuarioController.show);
router.post('/usuarios', usuarioController.create);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.delete);

module.exports = router; 