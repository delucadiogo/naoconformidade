const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

async function generateAndUpdateHash() {
    const email = 'ti01@oliveira.com.br';
    const senha = 'Xinxuan99';

    try {
        console.log('=== Gerando novo hash ===');
        // Gera um novo salt
        const salt = await bcrypt.genSalt(10);
        console.log('Novo salt:', salt);

        // Gera o hash da senha
        const hash = await bcrypt.hash(senha, salt);
        console.log('Novo hash:', hash);

        // Verifica se o hash está correto
        const senhaValida = await bcrypt.compare(senha, hash);
        console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');

        if (senhaValida) {
            console.log('\n=== Atualizando usuário ===');
            // Atualiza o usuário com o novo hash
            const resultado = await pool.query(
                'UPDATE usuarios SET senha_hash = $1, atualizado_em = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, email, senha_hash',
                [hash, email]
            );

            if (resultado.rows.length > 0) {
                console.log('Usuário atualizado:', resultado.rows[0]);
                
                // Verifica se a atualização foi bem sucedida
                const usuario = await pool.query(
                    'SELECT id, email, senha_hash FROM usuarios WHERE email = $1',
                    [email]
                );

                console.log('\n=== Verificando atualização ===');
                console.log('Usuário encontrado:', usuario.rows[0]);
                
                // Testa a senha novamente
                const senhaValidaApos = await bcrypt.compare(senha, usuario.rows[0].senha_hash);
                console.log('Senha válida após atualização:', senhaValidaApos ? 'Sim' : 'Não');
            } else {
                console.log('Usuário não encontrado');
            }
        } else {
            console.log('Hash inválido, não atualizando usuário');
        }

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await pool.end();
    }
}

generateAndUpdateHash(); 