const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const naoConformidadeController = require('../controllers/naoConformidadeController');
const authMiddleware = require('../middlewares/auth');

const upload = multer(multerConfig);

// Middleware de autenticação
router.use(authMiddleware);

// Rota para listar todas as não conformidades
router.get('/', naoConformidadeController.listar);

// Rota para buscar uma não conformidade específica
router.get('/:id', naoConformidadeController.buscarPorId);

// Rota para criar uma nova não conformidade (com upload de fotos)
router.post('/', upload.array('fotos', 5), naoConformidadeController.criar);

// Rota para atualizar uma não conformidade (com upload de fotos)
router.put('/:id', upload.array('fotos', 5), naoConformidadeController.atualizar);

// Rota para deletar uma não conformidade
router.delete('/:id', naoConformidadeController.deletar);

module.exports = router; 