import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nonConformityService, NonConformity, CreateNonConformityDTO, UpdateNonConformityDTO } from '@/services/nonConformityService';
import { toast } from 'sonner';

interface NonConformityContextType {
  nonConformities: NonConformity[];
  isLoading: boolean;
  error: Error | null;
  addNonConformity: (data: CreateNonConformityDTO) => Promise<void>;
  updateNonConformity: (data: UpdateNonConformityDTO) => Promise<void>;
  deleteNonConformity: (id: number) => Promise<void>;
  getNonConformity: (id: number) => NonConformity | undefined;
}

const NonConformityContext = createContext<NonConformityContextType | undefined>(undefined);

export function NonConformityProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Buscar todas as não conformidades
  const { data: nonConformities = [], isLoading, error } = useQuery({
    queryKey: ['nonConformities'],
    queryFn: nonConformityService.getAll,
  });

  // Adicionar não conformidade
  const addMutation = useMutation({
    mutationFn: nonConformityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade criada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar não conformidade: ${error.message}`);
    },
  });

  // Atualizar não conformidade
  const updateMutation = useMutation({
    mutationFn: nonConformityService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar não conformidade: ${error.message}`);
    },
  });

  // Deletar não conformidade
  const deleteMutation = useMutation({
    mutationFn: nonConformityService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nonConformities'] });
      toast.success('Não conformidade excluída com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir não conformidade: ${error.message}`);
    },
  });

  const addNonConformity = async (data: CreateNonConformityDTO) => {
    await addMutation.mutateAsync(data);
  };

  const updateNonConformity = async (data: UpdateNonConformityDTO) => {
    await updateMutation.mutateAsync(data);
  };

  const deleteNonConformity = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const getNonConformity = (id: number) => {
    return nonConformities.find((nc) => nc.id === id);
  };

  const value = {
    nonConformities,
    isLoading,
    error,
    addNonConformity,
    updateNonConformity,
    deleteNonConformity,
    getNonConformity,
  };

  return (
    <NonConformityContext.Provider value={value}>
      {children}
    </NonConformityContext.Provider>
  );
}

export function useNonConformity() {
  const context = useContext(NonConformityContext);
  if (context === undefined) {
    throw new Error('useNonConformity must be used within a NonConformityProvider');
  }
  return context;
}
