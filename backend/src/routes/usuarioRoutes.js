const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de autenticação
router.post('/auth/login', usuarioController.login);

// Rotas de usuários
router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.post('/', usuarioController.criar);
router.put('/:id', usuarioController.atualizar);
router.delete('/:id', usuarioController.deletar);

module.exports = router; 