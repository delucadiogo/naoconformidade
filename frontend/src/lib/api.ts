import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.2.175:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de autenticação
export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/usuarios/login', { email, senha: password });
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post('/usuarios/registrar', { nome: name, email, senha: password });
    return response.data;
  }
};

// Serviços de não conformidades
export const nonConformityService = {
  async create(data: FormData) {
    const response = await api.post('/nao-conformidades', data);
    return response.data;
  },

  async list() {
    const response = await api.get('/nao-conformidades');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/nao-conformidades/${id}`);
    return response.data;
  },

  async update(id: string, data: FormData) {
    const response = await api.put(`/nao-conformidades/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/nao-conformidades/${id}`);
    return response.data;
  }
};

export default api; 