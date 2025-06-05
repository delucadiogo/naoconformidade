require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_FOLDER)));

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 