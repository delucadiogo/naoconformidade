const bcrypt = require('bcryptjs');

async function generateHash() {
  const senha = 'Xinxuan99';
  
  try {
    // Gera um novo salt
    const salt = await bcrypt.genSalt(10);
    console.log('Salt gerado:', salt);
    
    // Gera o hash da senha
    const hash = await bcrypt.hash(senha, salt);
    console.log('Hash gerado:', hash);
    
    // Verifica se o hash está correto
    const senhaValida = await bcrypt.compare(senha, hash);
    console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');
    
    // Gera o SQL para atualizar a senha
    console.log('\nSQL para atualizar a senha:');
    console.log(`UPDATE usuarios SET senha_hash = '${hash}' WHERE email = 'ti01@oliveira.com.br';`);
    
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
}

generateHash(); 