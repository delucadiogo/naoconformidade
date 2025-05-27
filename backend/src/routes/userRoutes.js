const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Rotas de usuários
router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

module.exports = router; 