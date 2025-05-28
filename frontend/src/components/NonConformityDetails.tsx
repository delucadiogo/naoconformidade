import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn } from 'lucide-react';

interface NonConformityDetailsProps {
  nonConformity: {
    data_lancamento: string;
    nome_produto: string;
    validade: string;
    lote: string;
    tipo_produto: string;
    acao_tomada: string;
    criado_por_nome?: string;
    descricao?: string;
    fotos?: string[];
  };
  onClose: () => void;
}

const NonConformityDetails: React.FC<NonConformityDetailsProps> = ({
  nonConformity,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (date: string) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getImageUrl = (filename: string) => {
    // URL base do backend
    const baseUrl = 'http://192.168.2.175:3001';
    return `${baseUrl}/uploads/${filename}`;
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Não Conformidade</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="font-semibold">Data de Lançamento</h4>
              <p>{formatDate(nonConformity.data_lancamento)}</p>
            </div>

            <div>
              <h4 className="font-semibold">Nome do Produto</h4>
              <p>{nonConformity.nome_produto}</p>
            </div>

            <div>
              <h4 className="font-semibold">Validade</h4>
              <p>{formatDate(nonConformity.validade)}</p>
            </div>

            <div>
              <h4 className="font-semibold">Lote</h4>
              <p>{nonConformity.lote}</p>
            </div>

            <div>
              <h4 className="font-semibold">Tipo de Produto</h4>
              <p>{nonConformity.tipo_produto}</p>
            </div>

            <div>
              <h4 className="font-semibold">Ação Tomada</h4>
              <p>{nonConformity.acao_tomada || 'Não definida'}</p>
            </div>

            <div>
              <h4 className="font-semibold">Registrado por</h4>
              <p>{nonConformity.criado_por_nome || '-'}</p>
            </div>
          </div>

          {nonConformity.descricao && (
            <div className="mt-4">
              <h4 className="font-semibold">Descrição</h4>
              <p className="whitespace-pre-wrap">{nonConformity.descricao}</p>
            </div>
          )}

          {nonConformity.fotos && nonConformity.fotos.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Fotos</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {nonConformity.fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer transition-all duration-200 group-hover:opacity-90"
                      onClick={() => setSelectedImage(foto)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white/80 hover:bg-white"
                        onClick={() => setSelectedImage(foto)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para visualização ampliada da imagem */}
      {selectedImage && (
        <Dialog open onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Visualização da Imagem</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img
                src={getImageUrl(selectedImage)}
                alt="Imagem ampliada"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default NonConformityDetails; 