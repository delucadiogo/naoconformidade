const express = require('express');
const router = express.Router();
const { authRouter, usuarioRouter } = require('./usuarioRoutes');
const naoConformidadeRoutes = require('./naoConformidadeRoutes');
const configRoutes = require('./configRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas de autenticação
router.use('/auth', authRouter);

// Rotas de usuários
router.use('/usuarios', usuarioRouter);

// Rotas de não conformidades
router.use('/nao-conformidades', naoConformidadeRoutes);

// Rotas de configuração
router.use('/config', configRoutes);

module.exports = router; 