const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexões do PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,
  // Configurações adicionais para melhor performance
  max: 20, // número máximo de clientes no pool
  idleTimeoutMillis: 30000, // tempo máximo que um cliente pode ficar inativo
  connectionTimeoutMillis: 2000, // tempo máximo para estabelecer conexão
});

// Evento para log de erros
pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do PostgreSQL', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 