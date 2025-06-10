const bcrypt = require('bcryptjs');

async function testPassword() {
    const senha = 'Xinxuan99';
    const hashArmazenado = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    try {
        // Gera um novo hash para comparação
        const salt = await bcrypt.genSalt(10);
        const novoHash = await bcrypt.hash(senha, salt);
        
        console.log('Teste de senha:');
        console.log('Senha fornecida:', senha);
        console.log('Hash armazenado:', hashArmazenado);
        console.log('Novo hash gerado:', novoHash);
        
        // Testa a comparação com o hash armazenado
        const senhaValida = await bcrypt.compare(senha, hashArmazenado);
        console.log('\nComparação com hash armazenado:', senhaValida ? 'Válida' : 'Inválida');
        
        // Testa a comparação com o novo hash
        const senhaValidaNovo = await bcrypt.compare(senha, novoHash);
        console.log('Comparação com novo hash:', senhaValidaNovo ? 'Válida' : 'Inválida');
        
        // Gera um novo hash com salt fixo para teste
        const saltFixo = '$2a$10$N9qo8uLOickgx2ZMRZoMye';
        const hashComSaltFixo = await bcrypt.hash(senha, saltFixo);
        console.log('\nHash com salt fixo:', hashComSaltFixo);
        
        // Testa a comparação com o hash de salt fixo
        const senhaValidaSaltFixo = await bcrypt.compare(senha, hashComSaltFixo);
        console.log('Comparação com hash de salt fixo:', senhaValidaSaltFixo ? 'Válida' : 'Inválida');

    } catch (error) {
        console.error('Erro ao testar senha:', error);
    }
}

testPassword(); 