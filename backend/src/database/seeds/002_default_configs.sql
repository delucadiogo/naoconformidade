-- Inserir tipos de produto padrão
INSERT INTO tipos_produto (rotulo, valor) VALUES
('Produto Acabado', 'produto_acabado'),
('Ingrediente', 'ingrediente'),
('Embalagem', 'embalagem'),
('Filme', 'filme'),
('Caixa', 'caixa')
ON CONFLICT (valor) DO NOTHING;

-- Inserir tipos de ação padrão
INSERT INTO tipos_acao (rotulo, valor) VALUES
('Liberada para Comercialização', 'liberada_comercializacao'),
('Devolução ao Fornecedor', 'devolucao_fornecedor'),
('Descarte do Produto', 'descarte_produto')
ON CONFLICT (valor) DO NOTHING; 