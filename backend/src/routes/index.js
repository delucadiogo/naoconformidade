const express = require('express');
const router = express.Router();
const { authRouter, usuarioRouter } = require('./usuarioRoutes');
const naoConformidadeRoutes = require('./naoConformidadeRoutes');
const configRoutes = require('./configRoutes');

// Rotas de autenticação
router.use('/auth', authRouter);

// Rotas de recursos
router.use('/usuarios', usuarioRouter);
router.use('/nao-conformidades', naoConformidadeRoutes);
router.use('/config', configRoutes);

module.exports = router; 