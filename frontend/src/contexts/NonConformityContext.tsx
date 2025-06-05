import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nonConformityService, CreateNonConformityDTO, NonConformity } from '@/services/nonConformityService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface NonConformityContextType {
  nonConformities: NonConformity[];
  isLoading: boolean;
  error: Error | null;
  addNonConformity: (data: CreateNonConformityDTO) => Promise<void>;
  updateNonConformity: (id: string, data: Partial<CreateNonConformityDTO>) => Promise<void>;
  deleteNonConformity: (id: string) => Promise<void>;
  getNonConformity: (id: string) => NonConformity | undefined;
}

const NonConformityContext = createContext<NonConformityContextType | undefined>(undefined);

export const useNonConformity = () => {
  const context = useContext(NonConformityContext);
  if (context === undefined) {
    throw new Error('useNonConformity must be used within a NonConformityProvider');
  }
  return context;
};

export const NonConformityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar todas as não conformidades
  const { data: nonConformities = [], isLoading, error } = useQuery({
    queryKey: ['nonConformities'],
    queryFn: nonConformityService.getAll,
    enabled: !!user // Só executa a query se houver um usuário autenticado
  });

  // Adicionar não conformidade
  const addMutation = useMutation({
    mutationFn: nonConformityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar não conformidade:', error);
      toast.error('Erro ao criar não conformidade');
    }
  });

  // Atualizar não conformidade
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNonConformityDTO> }) => 
      nonConformityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar não conformidade:', error);
      toast.error('Erro ao atualizar não conformidade');
    }
  });

  // Deletar não conformidade
  const deleteMutation = useMutation({
    mutationFn: nonConformityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade deletada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar não conformidade:', error);
      toast.error('Erro ao deletar não conformidade');
    }
  });

  const addNonConformity = async (data: CreateNonConformityDTO) => {
    if (!user) {
      toast.error('Você precisa estar autenticado para criar uma não conformidade');
      return;
    }
    await addMutation.mutateAsync(data);
  };

  const updateNonConformity = async (id: string, data: Partial<CreateNonConformityDTO>) => {
    if (!user) {
      toast.error('Você precisa estar autenticado para atualizar uma não conformidade');
      return;
    }
    await updateMutation.mutateAsync({ id, data });
  };

  const deleteNonConformity = async (id: string) => {
    if (!user) {
      toast.error('Você precisa estar autenticado para deletar uma não conformidade');
      return;
    }
    await deleteMutation.mutateAsync(id);
  };

  const getNonConformity = (id: string) => {
    return nonConformities.find(nc => nc.id === id);
  };

  const value = {
    nonConformities,
    isLoading,
    error,
    addNonConformity,
    updateNonConformity,
    deleteNonConformity,
    getNonConformity
  };

  return (
    <NonConformityContext.Provider value={value}>
      {children}
    </NonConformityContext.Provider>
  );
};
