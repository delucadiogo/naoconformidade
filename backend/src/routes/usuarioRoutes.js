const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/auth');

// Roteador de autenticação
const authRouter = express.Router();
authRouter.post('/login', usuarioController.login);

// Roteador de usuários
const usuarioRouter = express.Router();

// Aplicar middleware de autenticação em todas as rotas de usuário
usuarioRouter.use(authMiddleware);

// Rotas de usuário
usuarioRouter.get('/', usuarioController.listar);
usuarioRouter.get('/:id', usuarioController.buscarPorId);
usuarioRouter.post('/', usuarioController.criar);
usuarioRouter.put('/:id', usuarioController.atualizar);
usuarioRouter.delete('/:id', usuarioController.deletar);

module.exports = {
  authRouter,
  usuarioRouter
}; 