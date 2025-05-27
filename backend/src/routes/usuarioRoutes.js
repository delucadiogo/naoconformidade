const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de autenticação
router.post('/auth/login', usuarioController.login);

// Rotas de usuários
router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:id', usuarioController.buscarPorId);
router.post('/usuarios', usuarioController.criar);
router.put('/usuarios/:id', usuarioController.atualizar);
router.delete('/usuarios/:id', usuarioController.deletar);

module.exports = router; 