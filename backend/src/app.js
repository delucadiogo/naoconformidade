const express = require('express');
const cors = require('cors');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const naoConformidadeRoutes = require('./routes/naoConformidadeRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();

// Configuração mais específica do CORS
app.use(cors({
  origin: ['http://192.168.2.175:8060', 'http://localhost:8060'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Range']
}));

app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas - todas sob /api
app.use('/api/auth', usuarioRoutes); // Rotas de autenticação
app.use('/api/usuarios', usuarioRoutes); // Rotas de usuários
app.use('/api/nao-conformidades', naoConformidadeRoutes);
app.use('/api/config', configRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app; 