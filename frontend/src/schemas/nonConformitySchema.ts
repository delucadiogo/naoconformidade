import { z } from 'zod';

export const nonConformityFormSchema = z.object({
  data_lancamento: z.string().min(1, 'Data de lançamento é obrigatória'),
  nome_produto: z.string().min(1, 'Nome do produto é obrigatório'),
  validade: z.string().min(1, 'Validade é obrigatória'),
  lote: z.string().min(1, 'Lote é obrigatório'),
  tipo_produto: z.string().min(1, 'Tipo de produto é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  fotos: z.array(z.string()).optional(),
  data_liberacao: z.string().optional(),
  acao_tomada: z.string().min(1, 'Ação tomada é obrigatória'),
  situacao: z.string().min(1, 'Situação é obrigatória')
});

export type NonConformityFormData = z.infer<typeof nonConformityFormSchema>; 