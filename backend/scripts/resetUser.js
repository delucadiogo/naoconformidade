const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

async function resetUser() {
    const email = 'ti01@oliveira.com.br';
    const novaSenha = 'Admin@123'; // Nova senha mais simples

    try {
        console.log('=== Resetando Usuário ===');
        
        // Remove o usuário atual
        await pool.query('DELETE FROM usuarios WHERE email = $1', [email]);
        console.log('Usuário removido');

        // Gera o hash da nova senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(novaSenha, salt);
        console.log('Novo hash gerado:', senhaHash);

        // Cria o novo usuário
        const resultado = await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash, funcao, departamento, ativo) VALUES ($1, $2, $3, $4, $5, true) RETURNING id, email, senha_hash',
            ['Admin', email, senhaHash, 'admin', 'TI']
        );

        console.log('Novo usuário criado:', resultado.rows[0]);

        // Testa a senha
        const senhaValida = await bcrypt.compare(novaSenha, resultado.rows[0].senha_hash);
        console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');

        if (senhaValida) {
            console.log('\n=== Instruções ===');
            console.log('Use as seguintes credenciais para fazer login:');
            console.log('Email:', email);
            console.log('Senha:', novaSenha);
        } else {
            console.log('ERRO: A senha não está funcionando corretamente');
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await pool.end();
    }
}

resetUser(); 