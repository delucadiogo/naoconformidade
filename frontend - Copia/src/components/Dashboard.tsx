import React, { useState } from 'react';
import Header from './Header';
import NonConformityForm from './NonConformityForm';
import NonConformityTable from './NonConformityTable';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';
import { useNonConformity } from '@/contexts/NonConformityContext';
import { useAuth } from '@/contexts/AuthContext';
import { canEditNonConformity, canDeleteNonConformity } from '@/utils/permissions';
import { toast } from 'sonner';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | undefined>();
  const { nonConformities, deleteNonConformity } = useNonConformity();
  const { user } = useAuth();

  const handleNewRecord = () => {
    setEditingId(undefined);
    setActiveView('form');
  };

  const handleEdit = (id: string) => {
    if (!canEditNonConformity(user)) {
      toast.error('Você não tem permissão para editar não conformidades');
      return;
    }
    setEditingId(id);
    setActiveView('form');
  };

  const handleFormSuccess = () => {
    setActiveView('list');
    setEditingId(undefined);
  };

  const handleCancel = () => {
    setActiveView('list');
    setEditingId(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteNonConformity(user)) {
      toast.error('Você não tem permissão para excluir não conformidades');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta não conformidade?')) {
      await deleteNonConformity(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            {activeView === 'form' ? 'Nova Não Conformidade' : 'Não Conformidades'}
          </h1>
          <div className="flex gap-2">
            {activeView === 'list' ? (
              <Button
                onClick={handleNewRecord}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Não Conformidade
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-slate-600"
              >
                <List className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {activeView === 'form' ? (
            <NonConformityForm 
              editingId={editingId}
              onCancel={handleCancel}
              onSuccess={handleFormSuccess}
            />
          ) : (
            <NonConformityTable 
              nonConformities={nonConformities}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
