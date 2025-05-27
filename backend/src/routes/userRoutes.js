const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Rotas de usuários
router.get('/usuarios', UserController.index);
router.get('/usuarios/:id', UserController.show);
router.post('/usuarios', UserController.create);
router.put('/usuarios/:id', UserController.update);
router.delete('/usuarios/:id', UserController.delete);

module.exports = router; 