const bcrypt = require('bcryptjs');

async function debugPassword() {
    const senha = 'Xinxuan99';
    const hashArmazenado = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    try {
        console.log('=== Teste de Senha ===');
        console.log('Senha:', senha);
        console.log('Hash armazenado:', hashArmazenado);
        console.log('Versão do bcrypt:', bcrypt.version);
        
        // Teste 1: Comparação direta
        console.log('\n=== Teste 1: Comparação Direta ===');
        const senhaValida = await bcrypt.compare(senha, hashArmazenado);
        console.log('Resultado:', senhaValida ? 'Válida' : 'Inválida');

        // Teste 2: Gerar novo hash e comparar
        console.log('\n=== Teste 2: Novo Hash ===');
        const salt = await bcrypt.genSalt(10);
        const novoHash = await bcrypt.hash(senha, salt);
        console.log('Novo salt:', salt);
        console.log('Novo hash:', novoHash);
        const senhaValidaNovo = await bcrypt.compare(senha, novoHash);
        console.log('Resultado:', senhaValidaNovo ? 'Válida' : 'Inválida');

        // Teste 3: Usar o mesmo salt do hash armazenado
        console.log('\n=== Teste 3: Mesmo Salt ===');
        const saltArmazenado = hashArmazenado.substring(0, 29); // Extrai o salt do hash
        console.log('Salt extraído:', saltArmazenado);
        const hashComMesmoSalt = await bcrypt.hash(senha, saltArmazenado);
        console.log('Hash com mesmo salt:', hashComMesmoSalt);
        const senhaValidaMesmoSalt = await bcrypt.compare(senha, hashComMesmoSalt);
        console.log('Resultado:', senhaValidaMesmoSalt ? 'Válida' : 'Inválida');

        // Teste 4: Comparar com diferentes codificações
        console.log('\n=== Teste 4: Diferentes Codificações ===');
        const senhaBuffer = Buffer.from(senha);
        const senhaValidaBuffer = await bcrypt.compare(senhaBuffer, hashArmazenado);
        console.log('Resultado com Buffer:', senhaValidaBuffer ? 'Válida' : 'Inválida');

        // Teste 5: Gerar hash com configurações específicas
        console.log('\n=== Teste 5: Hash com Configurações Específicas ===');
        const hashEspecifico = await bcrypt.hash(senha, 10);
        console.log('Hash específico:', hashEspecifico);
        const senhaValidaEspecifico = await bcrypt.compare(senha, hashEspecifico);
        console.log('Resultado:', senhaValidaEspecifico ? 'Válida' : 'Inválida');

    } catch (error) {
        console.error('Erro durante os testes:', error);
    }
}

debugPassword(); 