import axios, { AxiosRequestConfig } from 'axios';

// Configuração base do axios
export const api = axios.create({
  baseURL: 'http://192.168.2.175:3001',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
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
    return response;
  },
  (error) => {
    console.error('Erro na resposta da API:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Dados do erro:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de conexão - sem resposta do servidor');
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

export const nonConformityService = {
  create: async (data: FormData) => {
    const response = await api.post('/nao-conformidades', data, setFormDataConfig());
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/nao-conformidades/${id}`, data, setFormDataConfig());
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/nao-conformidades/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/nao-conformidades');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/nao-conformidades/${id}`);
    return response.data;
  }
};

export const userService = {
  create: async (data: any) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  }
};

export default api; 