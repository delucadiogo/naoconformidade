import axios, { AxiosRequestConfig } from 'axios';

// Configuração base do axios
export const api = axios.create({
  baseURL: 'http://192.168.2.175:3001', // Removido /api da baseURL
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para configurar o token no axios
const setAuthToken = (token: string) => {
  console.log('Configurando token no axios:', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Função para remover o token do axios
const removeAuthToken = () => {
  console.log('Removendo token do axios');
  delete api.defaults.headers.common['Authorization'];
};

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor de requisição - Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Headers da requisição:', config.headers);
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
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      url: response.config?.url,
      method: response.config?.method
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      const status = error.response.status;
      const data = error.response.data;

      // Log detalhado do erro
      console.error('Erro na resposta da API:', {
        status,
        data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });

      // Se o erro for 401, limpa o token e dispara um evento customizado
      if (status === 401) {
        console.log('Erro 401 detectado, limpando token e disparando evento de logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        removeAuthToken();
        window.dispatchEvent(new Event('auth:logout'));
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de conexão - sem resposta do servidor:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
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
  },
  setToken: (token: string) => {
    setAuthToken(token);
  },
  removeToken: () => {
    removeAuthToken();
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