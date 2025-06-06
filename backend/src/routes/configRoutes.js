const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/ConfigController');
const authMiddleware = require('../middlewares/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para tipos de produto
router.get('/product-types', ConfigController.getAllProductTypes);
router.post('/product-types', ConfigController.createProductType);
router.delete('/product-types/:id', ConfigController.deleteProductType);

// Rotas para tipos de situação (antigo tipos de ação)
router.get('/situation-types', ConfigController.getAllSituationTypes);
router.post('/situation-types', ConfigController.createSituationType);
router.delete('/situation-types/:id', ConfigController.deleteSituationType);

// Rotas para ações
router.get('/actions', ConfigController.getAllActions);
router.post('/actions', ConfigController.createAction);
router.delete('/actions/:id', ConfigController.deleteAction);

module.exports = router; 