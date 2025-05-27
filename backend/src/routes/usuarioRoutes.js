const express = require('express');
const usuarioController = require('../controllers/usuarioController');

// Roteador de autenticação
const authRouter = express.Router();
authRouter.post('/login', usuarioController.login);

// Roteador de usuários
const usuarioRouter = express.Router();
usuarioRouter.get('/', usuarioController.listar);
usuarioRouter.get('/:id', usuarioController.buscarPorId);
usuarioRouter.post('/', usuarioController.criar);
usuarioRouter.put('/:id', usuarioController.atualizar);
usuarioRouter.delete('/:id', usuarioController.deletar);

module.exports = {
  authRouter,
  usuarioRouter
}; 