const express = require('express');
const cors = require('cors');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const naoConformidadeRoutes = require('./routes/naoConformidadeRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rotas
app.use('/auth', usuarioRoutes); // Rota de autenticação
app.use('/usuarios', usuarioRoutes); // Rota de usuários
app.use('/nao-conformidades', naoConformidadeRoutes);
app.use('/config', configRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app; 