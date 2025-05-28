-- Criação das tabelas de configuração

-- Tabela de tipos de produto
CREATE TABLE IF NOT EXISTS tipos_produto (
    id SERIAL PRIMARY KEY,
    rotulo VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tipos de ação
CREATE TABLE IF NOT EXISTS tipos_acao (
    id SERIAL PRIMARY KEY,
    rotulo VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para atualização automática do campo atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para tipos_produto
CREATE TRIGGER update_tipos_produto_atualizado_em
    BEFORE UPDATE ON tipos_produto
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em_column();

-- Trigger para tipos_acao
CREATE TRIGGER update_tipos_acao_atualizado_em
    BEFORE UPDATE ON tipos_acao
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em_column();

-- Inserir alguns dados iniciais
INSERT INTO tipos_produto (rotulo, valor)
VALUES 
    ('Produto Acabado', 'produto_acabado'),
    ('Matéria Prima', 'materia_prima'),
    ('Material de Embalagem', 'material_embalagem')
ON CONFLICT (valor) DO NOTHING;

INSERT INTO tipos_acao (rotulo, valor)
VALUES 
    ('Liberada para Comercialização', 'liberada_comercializacao'),
    ('Reprocesso', 'reprocesso'),
    ('Descarte', 'descarte')
ON CONFLICT (valor) DO NOTHING; 