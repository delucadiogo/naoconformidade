import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  email: string;
  password?: string; // opcional para atualização
  role: string;
  department: string;
  isActive: boolean;
}

const userService = {
  // Listar todos os usuários
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  // Buscar um usuário específico
  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Criar um novo usuário
  async create(userData: UserInput): Promise<User> {
    if (!userData.password) {
      throw new Error('Senha é obrigatória para criar um novo usuário');
    }
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Atualizar um usuário
  async update(id: number, userData: UserInput): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deletar um usuário
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};

export default userService; 