import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import { canEditNonConformity, canDeleteNonConformity } from '@/utils/permissions';
import NonConformityDetails from './NonConformityDetails';

interface NonConformity {
  id: string;
  data_lancamento: string;
  nome_produto: string;
  validade: string;
  lote: string;
  tipo_produto: string;
  tipo_produto_rotulo?: string;
  acao_tomada: string;
  acao_tomada_rotulo?: string;
  criado_por_nome?: string;
  descricao?: string;
  fotos?: string[];
}

interface NonConformityTableProps {
  nonConformities: NonConformity[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NonConformityTable: React.FC<NonConformityTableProps> = ({
  nonConformities,
  onEdit,
  onDelete: handleDelete,
}) => {
  const { user } = useAuth();
  const { productTypes, actionTypes, loading } = useConfig();
  const [selectedNonConformity, setSelectedNonConformity] = useState<NonConformity | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '-';
    }
  };

  const getProductTypeLabel = (value: string) => {
    if (!productTypes || loading) return value;
    const type = productTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getActionTypeLabel = (value: string) => {
    if (!actionTypes || loading) return value;
    const type = actionTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const handleView = (nc: NonConformity) => {
    setSelectedNonConformity(nc);
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Data Lançamento
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Produto
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Lote
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Ação Tomada
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Cadastrado por
              </th>
              <th className="px-4 py-3 text-left text-slate-700 font-medium">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {nonConformities.map((nc) => (
              <tr key={nc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(nc.data_lancamento)}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">{nc.nome_produto}</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      Validade: {formatDate(nc.validade)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{nc.lote}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{getProductTypeLabel(nc.tipo_produto)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{nc.acao_tomada ? getActionTypeLabel(nc.acao_tomada) : 'Não definida'}</Badge>
                </td>
                <td className="px-4 py-3">{nc.criado_por_nome}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(nc)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEditNonConformity(user) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(nc.id)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDeleteNonConformity(user) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(nc.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNonConformity && (
        <NonConformityDetails
          nonConformity={selectedNonConformity}
          onClose={() => setSelectedNonConformity(null)}
        />
      )}
    </>
  );
};

export default NonConformityTable;
