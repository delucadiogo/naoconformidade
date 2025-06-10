const bcrypt = require('bcryptjs');

async function generateWorkingHash() {
    const senha = '123456'; // Senha mais simples para teste

    try {
        console.log('=== Gerando Hash Funcional ===');
        
        // Gera um novo salt
        const salt = await bcrypt.genSalt(10);
        console.log('Salt:', salt);
        
        // Gera o hash
        const hash = await bcrypt.hash(senha, salt);
        console.log('Hash:', hash);
        
        // Testa o hash
        const senhaValida = await bcrypt.compare(senha, hash);
        console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');
        
        if (senhaValida) {
            console.log('\n=== SQL para Atualizar Usuário ===');
            console.log(`
-- Primeiro, remova o usuário atual
DELETE FROM usuarios WHERE email = 'ti01@oliveira.com.br';

-- Agora crie o novo usuário
INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    funcao,
    departamento,
    ativo
) VALUES (
    'Admin',
    'ti01@oliveira.com.br',
    '${hash}',
    'admin',
    'TI',
    true
);

-- Verifique se o usuário foi criado
SELECT id, email, senha_hash FROM usuarios WHERE email = 'ti01@oliveira.com.br';
            `);
            
            console.log('\n=== Instruções ===');
            console.log('1. Execute o SQL gerado acima no banco de dados');
            console.log('2. Tente fazer login com:');
            console.log('   Email: ti01@oliveira.com.br');
            console.log('   Senha: 123456');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

generateWorkingHash(); 