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

// Rotas para tipos de ação
router.get('/action-types', ConfigController.getAllActionTypes);
router.post('/action-types', ConfigController.createActionType);
router.delete('/action-types/:id', ConfigController.deleteActionType);

module.exports = router; 