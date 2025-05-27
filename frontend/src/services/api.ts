import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'http://192.168.2.175:3001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30000 // aumentando para 30 segundos
});

// Configuração de retry
axiosRetry(api, { 
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // espera 1s, 2s, 3s entre as tentativas
  },
  retryCondition: (error) => {
    // Retry em erros de rede ou timeout
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.code === 'ECONNABORTED';
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  console.log('Configuração da requisição:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Erro na configuração da requisição:', error);
  return Promise.reject(error);
});

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    if (error.response) {
      console.error('Resposta do servidor:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
      console.error('URL tentada:', error.config.url);
      console.error('Método:', error.config.method);
    } else {
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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

export const authService = {
  login: async (email: string, senha: string) => {
    try {
      console.log('Tentando fazer login com:', { email });
      const response = await api.post('/api/auth/login', { email, senha });
      console.log('Resposta do login:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
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