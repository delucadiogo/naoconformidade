import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://backend:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
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