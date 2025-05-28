import api from '@/lib/api';

export interface NonConformity {
  id: string;
  data_lancamento: string;
  nome_produto: string;
  validade: string;
  lote: string;
  tipo_produto: string;
  tipo_produto_rotulo?: string;
  descricao: string;
  fotos?: string[];
  data_liberacao?: string;
  acao_tomada: string;
  acao_tomada_rotulo?: string;
  criado_em: string;
  criado_por_nome?: string;
}

export interface CreateNonConformityDTO {
  data_lancamento: string;
  nome_produto: string;
  validade: string;
  lote: string;
  tipo_produto: string;
  descricao: string;
  data_liberacao?: string;
  acao_tomada?: string;
  fotos?: File[];
}

export interface UpdateNonConformityDTO {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  attachments?: File[];
}

export const nonConformityService = {
  getAll: async (): Promise<NonConformity[]> => {
    const response = await api.get('/nao-conformidades');
    return response.data;
  },

  getById: async (id: string): Promise<NonConformity> => {
    const response = await api.get(`/nao-conformidades/${id}`);
    return response.data;
  },

  create: async (data: CreateNonConformityDTO): Promise<NonConformity> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'fotos') {
        formData.append(key, value);
      }
    });
    
    if (data.fotos) {
      data.fotos.forEach((file) => {
        formData.append('fotos', file);
      });
    }

    const response = await api.post('/nao-conformidades', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateNonConformityDTO>): Promise<NonConformity> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'fotos') {
        formData.append(key, value);
      }
    });
    
    if (data.fotos) {
      data.fotos.forEach((file) => {
        formData.append('fotos', file);
      });
    }

    const response = await api.put(`/nao-conformidades/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/nao-conformidades/${id}`);
  },
}; 