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
        Authorization: `Bearer ${token}`
      }
    };
  }

  // Tipos de Produto
  static async getAllProductTypes(): Promise<ConfigType[]> {
    const response = await api.get('/config/product-types', this.getHeaders());
    return response.data;
  }

  static async createProductType(data: ConfigInput): Promise<ConfigType> {
    const response = await api.post('/config/product-types', data, this.getHeaders());
    return response.data;
  }

  static async deleteProductType(id: number): Promise<void> {
    await api.delete(`/config/product-types/${id}`, this.getHeaders());
  }

  // Tipos de Ação
  static async getAllActionTypes(): Promise<ConfigType[]> {
    const response = await api.get('/config/action-types', this.getHeaders());
    return response.data;
  }

  static async createActionType(data: ConfigInput): Promise<ConfigType> {
    const response = await api.post('/config/action-types', data, this.getHeaders());
    return response.data;
  }

  static async deleteActionType(id: number): Promise<void> {
    await api.delete(`/config/action-types/${id}`, this.getHeaders());
  }
}

export default ConfigService; 