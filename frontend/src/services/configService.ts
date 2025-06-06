import api from './api';
import { getAuthToken } from '../utils/auth';

export interface ConfigType {
  id: number;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigInput {
  label: string;
  value: string;
}

class ConfigService {
  private static getHeaders() {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Tipos de Produto
  static async getAllProductTypes(): Promise<ConfigType[]> {
    const response = await api.get('/api/config/product-types', this.getHeaders());
    return response.data;
  }

  static async createProductType(data: ConfigInput): Promise<ConfigType> {
    console.log('Enviando dados para criar tipo de produto:', data);
    const response = await api.post('/api/config/product-types', data, this.getHeaders());
    return response.data;
  }

  static async deleteProductType(id: number): Promise<void> {
    await api.delete(`/api/config/product-types/${id}`, this.getHeaders());
  }

  // Tipos de Situação (antigo Tipos de Ação)
  static async getAllSituationTypes(): Promise<ConfigType[]> {
    const response = await api.get('/api/config/situation-types', this.getHeaders());
    return response.data;
  }

  static async createSituationType(data: ConfigInput): Promise<ConfigType> {
    console.log('Enviando dados para criar tipo de situação:', data);
    const response = await api.post('/api/config/situation-types', data, this.getHeaders());
    return response.data;
  }

  static async deleteSituationType(id: number): Promise<void> {
    await api.delete(`/api/config/situation-types/${id}`, this.getHeaders());
  }

  // Ações
  static async getAllActions(): Promise<ConfigType[]> {
    const response = await api.get('/api/config/actions', this.getHeaders());
    return response.data;
  }

  static async createAction(data: ConfigInput): Promise<ConfigType> {
    console.log('Enviando dados para criar ação:', data);
    const response = await api.post('/api/config/actions', data, this.getHeaders());
    return response.data;
  }

  static async deleteAction(id: number): Promise<void> {
    await api.delete(`/api/config/actions/${id}`, this.getHeaders());
  }
}

export default ConfigService; 