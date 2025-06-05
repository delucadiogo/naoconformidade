const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Configuração do CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Range']
}));

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
  console.error('URL que causou o erro:', req.url);
  console.error('Método que causou o erro:', req.method);
  console.error('Headers da requisição:', req.headers);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app; 