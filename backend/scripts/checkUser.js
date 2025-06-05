const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'nao_conformidades',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

async function checkUser() {
  try {
    console.log('Conectando ao banco de dados...');
    
    const result = await pool.query(
      'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1',
      ['ti01@oliveira.com.br']
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('Usuário encontrado:');
      console.log('ID:', user.id);
      console.log('Nome:', user.nome);
      console.log('Email:', user.email);
      console.log('Senha hash:', user.senha_hash);

      // Testa a senha
      const senha = 'Xinxuan99';
      const senhaValida = await bcrypt.compare(senha, user.senha_hash);
      console.log('\nTeste de senha:');
      console.log('Senha fornecida:', senha);
      console.log('Senha é válida:', senhaValida);

      // Gera um novo hash para comparação
      const salt = await bcrypt.genSalt(10);
      const novoHash = await bcrypt.hash(senha, salt);
      console.log('\nNovo hash gerado:', novoHash);
      console.log('Comparação com novo hash:', await bcrypt.compare(senha, novoHash));
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