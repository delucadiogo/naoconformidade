-- Criação da tabela de tipos de produto
CREATE TABLE IF NOT EXISTS tipos_produto (
    id SERIAL PRIMARY KEY,
    rotulo VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de tipos de ação
CREATE TABLE IF NOT EXISTS tipos_acao (
    id SERIAL PRIMARY KEY,
    rotulo VARCHAR(255) NOT NULL,
    valor VARCHAR(255) NOT NULL UNIQUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualização automática do atualizado_em para tipos_produto
CREATE TRIGGER update_tipos_produto_atualizado_em
    BEFORE UPDATE ON tipos_produto
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em_column();

-- Trigger para atualização automática do atualizado_em para tipos_acao
CREATE TRIGGER update_tipos_acao_atualizado_em
    BEFORE UPDATE ON tipos_acao
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em_column(); 