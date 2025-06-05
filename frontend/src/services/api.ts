import axios, { AxiosRequestConfig } from 'axios';

// Configuração base do axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000, // Aumentado para 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    console.log('Iniciando requisição para:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida de:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na conexão. Verifique se o servidor está acessível e se a URL está correta:', error.config.baseURL);
    }
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Dados do erro:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de conexão - sem resposta do servidor');
      console.error('URL tentada:', error.config.url);
      console.error('Método:', error.config.method);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

// Função auxiliar para configurar o Content-Type correto para FormData
const setFormDataConfig = (config: AxiosRequestConfig = {}): AxiosRequestConfig => ({
  ...config,
  headers: {
    ...config.headers,
    'Content-Type': 'multipart/form-data'
  }
});

// Serviços da API
export const authService = {
  login: async (email: string, senha: string) => {
    try {
      console.log('Iniciando requisição de login:', { email });
      const response = await api.post('/api/auth/login', { email, senha });
      console.log('Resposta do login:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      throw error;
    }
  }
};

export const userService = {
  create: async (data: any) => {
    const response = await api.post('/api/usuarios', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/api/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/usuarios');
    return response.data;
  }
};

export default api; 