const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

async function testAllPossibilities() {
    const email = 'ti01@oliveira.com.br';
    const senha = 'Xinxuan99';

    try {
        console.log('=== Informações do Sistema ===');
        console.log('Versão do bcrypt:', bcrypt.version);
        console.log('Versão do Node:', process.version);
        console.log('Plataforma:', process.platform);
        console.log('Codificação:', process.env.LANG || 'não definida');

        // Teste 1: Verificar o usuário no banco
        console.log('\n=== Teste 1: Verificar Usuário no Banco ===');
        const usuario = await pool.query(
            'SELECT id, email, senha_hash, LENGTH(senha_hash) as tamanho_hash FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuario.rows.length > 0) {
            console.log('Usuário encontrado:', usuario.rows[0]);
        } else {
            console.log('Usuário não encontrado');
            return;
        }

        // Teste 2: Testar diferentes codificações da senha
        console.log('\n=== Teste 2: Diferentes Codificações ===');
        const senhaUtf8 = Buffer.from(senha, 'utf8');
        const senhaAscii = Buffer.from(senha, 'ascii');
        const senhaLatin1 = Buffer.from(senha, 'latin1');

        console.log('Senha UTF-8:', senhaUtf8.toString('hex'));
        console.log('Senha ASCII:', senhaAscii.toString('hex'));
        console.log('Senha Latin1:', senhaLatin1.toString('hex'));

        // Teste 3: Gerar hash com diferentes configurações
        console.log('\n=== Teste 3: Diferentes Configurações de Hash ===');
        
        // Hash com salt padrão
        const saltPadrao = await bcrypt.genSalt(10);
        const hashPadrao = await bcrypt.hash(senha, saltPadrao);
        console.log('Hash com salt padrão:', hashPadrao);
        console.log('Comparação com salt padrão:', await bcrypt.compare(senha, hashPadrao));

        // Hash com salt fixo
        const saltFixo = '$2a$10$N9qo8uLOickgx2ZMRZoMye';
        const hashFixo = await bcrypt.hash(senha, saltFixo);
        console.log('Hash com salt fixo:', hashFixo);
        console.log('Comparação com salt fixo:', await bcrypt.compare(senha, hashFixo));

        // Teste 4: Verificar o hash armazenado
        console.log('\n=== Teste 4: Verificar Hash Armazenado ===');
        const hashArmazenado = usuario.rows[0].senha_hash;
        console.log('Hash armazenado:', hashArmazenado);
        console.log('Tamanho do hash:', hashArmazenado.length);
        console.log('Comparação com hash armazenado:', await bcrypt.compare(senha, hashArmazenado));

        // Teste 5: Gerar novo hash e atualizar
        console.log('\n=== Teste 5: Gerar Novo Hash ===');
        const novoHash = await bcrypt.hash(senha, 10);
        console.log('Novo hash:', novoHash);
        console.log('Comparação com novo hash:', await bcrypt.compare(senha, novoHash));

        // Atualizar o usuário com o novo hash
        const resultado = await pool.query(
            'UPDATE usuarios SET senha_hash = $1, atualizado_em = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id, email, senha_hash',
            [novoHash, email]
        );

        if (resultado.rows.length > 0) {
            console.log('Usuário atualizado com sucesso');
            console.log('Novo hash no banco:', resultado.rows[0].senha_hash);
        }

    } catch (error) {
        console.error('Erro durante os testes:', error);
    } finally {
        await pool.end();
    }
}

testAllPossibilities(); 