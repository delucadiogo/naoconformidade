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

  // Tipos de Ação
  static async getAllActionTypes(): Promise<ConfigType[]> {
    const response = await api.get('/api/config/action-types', this.getHeaders());
    return response.data;
  }

  static async createActionType(data: ConfigInput): Promise<ConfigType> {
    console.log('Enviando dados para criar tipo de ação:', data);
    const response = await api.post('/api/config/action-types', data, this.getHeaders());
    return response.data;
  }

  static async deleteActionType(id: number): Promise<void> {
    await api.delete(`/api/config/action-types/${id}`, this.getHeaders());
  }
}

export default ConfigService; 