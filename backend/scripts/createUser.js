const axios = require('axios');

const createUser = async () => {
    console.log('Iniciando criação do usuário...');
    
    try {
        console.log('Enviando requisição para:', 'http://localhost:3000/api/usuarios/registrar');
        console.log('Dados:', {
            nome: 'TI01',
            email: 'ti01@oliveira.com.br',
            senha: 'Xinxuan99'
        });

        const response = await axios.post('http://localhost:3000/api/usuarios/registrar', {
            nome: 'TI01',
            email: 'ti01@oliveira.com.br',
            senha: 'Xinxuan99'
        });

        console.log('Resposta recebida!');
        console.log('Status:', response.status);
        console.log('Usuário criado com sucesso!');
        console.log('Dados do usuário:', response.data);
    } catch (error) {
        console.log('Erro detectado!');
        if (error.response) {
            console.error('Erro ao criar usuário:', error.response.data.mensagem || error.response.data);
            console.error('Status do erro:', error.response.status);
        } else if (error.request) {
            console.error('Erro de conexão:', error.message);
            console.error('Verifique se o servidor está rodando na porta 3000');
        } else {
            console.error('Erro ao criar usuário:', error.message);
        }
    }
};

console.log('Script iniciado');
// Executar a função
createUser().then(() => {
    console.log('Script finalizado');
}).catch((error) => {
    console.error('Erro não tratado:', error);
    process.exit(1);
}); 