import axios from 'axios';

const createUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/usuarios/registrar', {
      nome: 'TI01',
      email: 'ti01@oliveira.com.br',
      senha: 'Xinxuan99'
    });

    console.log('Usuário criado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.response?.data || error.message);
  }
};

createUser(); 