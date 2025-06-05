const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? true // Permite todas as origens em produção
    : ['http://localhost:8060', 'http://192.168.2.175:8060'], // Restringe em desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Range']
};

app.use(cors(corsOptions));

// Configuração para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Configuração do parser de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas - todas sob /api
app.use('/api', routes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app; 