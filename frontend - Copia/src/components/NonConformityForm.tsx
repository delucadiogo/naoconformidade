import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNonConformity } from '@/contexts/NonConformityContext';
import { useConfig } from '@/contexts/ConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhotoUpload from './PhotoUpload';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const formSchema = z.object({
  data_lancamento: z.string().min(1, 'Data de lançamento é obrigatória'),
  nome_produto: z.string().min(1, 'Nome do produto é obrigatório'),
  validade: z.string().min(1, 'Data de validade é obrigatória'),
  lote: z.string().min(1, 'Lote é obrigatório'),
  tipo_produto: z.string().min(1, 'Tipo de produto é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  data_liberacao: z.string().optional(),
  acao_tomada: z.string().optional(),
});

interface NonConformityFormProps {
  editingId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NonConformityForm: React.FC<NonConformityFormProps> = ({
  editingId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { addNonConformity, updateNonConformity, getNonConformity } = useNonConformity();
  const { productTypes, actionTypes, loading: configLoading } = useConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_lancamento: format(new Date(), 'yyyy-MM-dd'),
      nome_produto: '',
      validade: '',
      lote: '',
      tipo_produto: '',
      descricao: '',
      data_liberacao: '',
      acao_tomada: '',
    },
  });

  useEffect(() => {
    if (editingId) {
      const nonConformity = getNonConformity(editingId);
      if (nonConformity) {
        form.reset({
          data_lancamento: format(new Date(nonConformity.data_lancamento), 'yyyy-MM-dd'),
          nome_produto: nonConformity.nome_produto,
          validade: format(new Date(nonConformity.validade), 'yyyy-MM-dd'),
          lote: nonConformity.lote,
          tipo_produto: nonConformity.tipo_produto,
          descricao: nonConformity.descricao,
          data_liberacao: nonConformity.data_liberacao ? format(new Date(nonConformity.data_liberacao), 'yyyy-MM-dd') : '',
          acao_tomada: nonConformity.acao_tomada || '',
        });
      }
    }
  }, [editingId, getNonConformity, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      // Adiciona as fotos ao FormData
      photos.forEach((photo) => {
        formData.append('fotos', photo);
      });

      if (editingId) {
        await updateNonConformity(editingId, formData);
        toast.success('Não conformidade atualizada com sucesso!');
      } else {
        await addNonConformity(formData);
        toast.success('Não conformidade registrada com sucesso!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar não conformidade:', error);
      toast.error('Erro ao salvar não conformidade');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-600">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-slate-800">
          {editingId ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="data_lancamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Lançamento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_produto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lote</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_produto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Produto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acao_tomada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Tomada</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a ação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_liberacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Liberação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Fotos</FormLabel>
            <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NonConformityForm;
