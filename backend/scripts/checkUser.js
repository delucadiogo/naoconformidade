const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

async function checkUser() {
  try {
    const email = 'ti01@oliveira.com.br';
    const senha = 'Xinxuan99';

    console.log('Verificando usuário:', email);

    // Busca o usuário
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
      console.log('Usuário não encontrado no banco de dados');
      return;
    }

    console.log('Usuário encontrado:', {
      id: usuario.id,
      email: usuario.email,
      senha_hash: usuario.senha_hash
    });

    // Gera um novo hash para comparação
    const salt = await bcrypt.genSalt(10);
    const novoHash = await bcrypt.hash(senha, salt);
    console.log('Novo hash gerado:', novoHash);

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');

    if (!senhaValida) {
      console.log('A senha fornecida não corresponde ao hash armazenado');
    }

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
  } finally {
    // Fecha a conexão com o banco
    await pool.end();
  }
}

checkUser(); 