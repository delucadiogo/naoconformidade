const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function checkUser() {
  try {
    console.log('Conectando ao banco de dados...');
    
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1',
      ['ti01@oliveira.com.br']
    );

    if (result.rows.length > 0) {
      console.log('Usuário encontrado:');
      console.log('ID:', result.rows[0].id);
      console.log('Nome:', result.rows[0].nome);
      console.log('Email:', result.rows[0].email);
      console.log('Senha hash existe:', !!result.rows[0].senha_hash);
    } else {
      console.log('Usuário não encontrado no banco de dados');
    }
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
  } finally {
    await pool.end();
  }
}

checkUser(); 