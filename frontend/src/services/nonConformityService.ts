import api from '@/lib/api';

export interface NonConformity {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  attachments?: string[];
}

export interface CreateNonConformityDTO {
  title: string;
  description: string;
  attachments?: File[];
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
    const response = await api.get('/non-conformities');
    return response.data;
  },

  getById: async (id: number): Promise<NonConformity> => {
    const response = await api.get(`/non-conformities/${id}`);
    return response.data;
  },

  create: async (data: CreateNonConformityDTO): Promise<NonConformity> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post('/non-conformities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (data: UpdateNonConformityDTO): Promise<NonConformity> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.status) formData.append('status', data.status);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.put(`/non-conformities/${data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/non-conformities/${id}`);
  },
}; 