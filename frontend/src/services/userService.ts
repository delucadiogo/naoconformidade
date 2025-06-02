import api from './api';

export interface User {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  departamento: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface UserInput {
  nome: string;
  email: string;
  senha?: string;
  funcao: string;
  departamento: string;
  ativo: boolean;
}

const userService = {
  // Listar todos os usuários
  async getAll(): Promise<User[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Buscar um usuário específico
  async getById(id: string): Promise<User> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Criar um novo usuário
  async create(userData: UserInput): Promise<User> {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  // Atualizar um usuário
  async update(id: string, userData: UserInput): Promise<User> {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  // Deletar um usuário
  async delete(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  }
};

export default userService; 