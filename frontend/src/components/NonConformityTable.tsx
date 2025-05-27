import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canEditNonConformity, canDeleteNonConformity } from '@/utils/permissions';
import NonConformityDetails from './NonConformityDetails';

interface NonConformity {
  id: string;
  data_lancamento: string;
  nome_produto: string;
  validade: string;
  lote: string;
  tipo_produto: string;
  acao_tomada: string;
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

  const handleView = (nc: NonConformity) => {
    setSelectedNonConformity(nc);
  };

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
              <tr key={nc.id}>
                <td className="px-4 py-3 text-slate-900">
                  {formatDate(nc.data_lancamento)}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-slate-900">{nc.nome_produto}</div>
                    <div className="text-sm text-slate-500">
                      Validade: {formatDate(nc.validade)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-900">{nc.lote}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {nc.tipo_produto}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {nc.acao_tomada}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-900">
                  {nc.criado_por_nome || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(nc)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEditNonConformity(user) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(nc.id)}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDeleteNonConformity(user) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(nc.id)}
                        className="text-red-600 hover:text-red-800"
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
