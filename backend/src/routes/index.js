const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuarioRoutes');
const naoConformidadeRoutes = require('./naoConformidadeRoutes');
const userRoutes = require('./userRoutes');
const configRoutes = require('./configRoutes');

router.use('/usuarios', usuarioRoutes);
router.use('/nao-conformidades', naoConformidadeRoutes);
router.use('/users', userRoutes);
router.use('/config', configRoutes);

module.exports = router; 