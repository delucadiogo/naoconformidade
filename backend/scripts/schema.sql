-- Cria a extensão pgcrypto se não existir
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(100) NOT NULL,
    funcao VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de tipos de produto
CREATE TABLE IF NOT EXISTS tipos_produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de tipos de situação (antiga tipos_acao)
CREATE TABLE IF NOT EXISTS tipos_situacao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de ações
CREATE TABLE IF NOT EXISTS acao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de não conformidades
CREATE TABLE IF NOT EXISTS nao_conformidades (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT NOT NULL,
    local VARCHAR(200) NOT NULL,
    data_ocorrencia TIMESTAMP NOT NULL,
    data_deteccao TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    gravidade VARCHAR(50) NOT NULL,
    responsavel_id INTEGER REFERENCES usuarios(id),
    criado_por_id INTEGER REFERENCES usuarios(id),
    data_lancamento DATE,
    nome_produto VARCHAR(200),
    validade DATE,
    lote VARCHAR(50),
    tipo_produto VARCHAR(100),
    data_liberacao DATE,
    acao_tomada TEXT,
    situacao VARCHAR(100),
    fotos TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de fotos das não conformidades
CREATE TABLE IF NOT EXISTS fotos_nao_conformidade (
    id SERIAL PRIMARY KEY,
    nao_conformidade_id INTEGER REFERENCES nao_conformidades(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    tamanho INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de ações corretivas
CREATE TABLE IF NOT EXISTS acoes_corretivas (
    id SERIAL PRIMARY KEY,
    nao_conformidade_id INTEGER REFERENCES nao_conformidades(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    prazo TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    responsavel_id INTEGER REFERENCES usuarios(id),
    criado_por_id INTEGER REFERENCES usuarios(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insere tipos de produto padrão
INSERT INTO tipos_produto (nome, descricao) VALUES
('Alimento', 'Produtos alimentícios em geral'),
('Bebida', 'Bebidas em geral'),
('Medicamento', 'Medicamentos e produtos farmacêuticos'),
('Cosmético', 'Produtos cosméticos e de higiene pessoal'),
('Material de Limpeza', 'Produtos de limpeza em geral')
ON CONFLICT (nome) DO NOTHING;

-- Insere tipos de situação padrão
INSERT INTO tipos_situacao (nome, descricao) VALUES
('Correção Imediata', 'Ação para corrigir o problema imediatamente'),
('Ação Corretiva', 'Ação para prevenir a recorrência do problema'),
('Ação Preventiva', 'Ação para prevenir problemas similares'),
('Treinamento', 'Ação de treinamento para equipe'),
('Revisão de Processo', 'Revisão e atualização de processos')
ON CONFLICT (nome) DO NOTHING;

-- Insere ações padrão
INSERT INTO acao (nome, descricao) VALUES
('Liberada para Comercialização', 'Produto liberado para venda após análise'),
('Devolução ao Fornecedor', 'Produto devolvido ao fornecedor'),
('Descarte do Produto', 'Produto descartado por não conformidade')
ON CONFLICT (nome) DO NOTHING;

-- Insere configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('EMPRESA_NOME', 'Oliveira', 'Nome da empresa'),
('EMPRESA_LOGO', 'logo.png', 'Nome do arquivo do logo'),
('EMAIL_NOTIFICACAO', 'ti01@oliveira.com.br', 'Email para notificações'),
('DIAS_PRAZO_PADRAO', '7', 'Prazo padrão em dias para ações corretivas')
ON CONFLICT (chave) DO NOTHING;

-- Insere o usuário admin padrão
INSERT INTO usuarios (nome, email, senha_hash, funcao, departamento)
SELECT 'Admin', 'ti01@oliveira.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'TI'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'ti01@oliveira.com.br'
);

-- Cria índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_status ON nao_conformidades(status);
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_data_ocorrencia ON nao_conformidades(data_ocorrencia);
CREATE INDEX IF NOT EXISTS idx_acoes_corretivas_status ON acoes_corretivas(status);
CREATE INDEX IF NOT EXISTS idx_acoes_corretivas_prazo ON acoes_corretivas(prazo);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_departamento ON usuarios(departamento);
CREATE INDEX IF NOT EXISTS idx_tipos_produto_nome ON tipos_produto(nome);
CREATE INDEX IF NOT EXISTS idx_tipos_situacao_nome ON tipos_situacao(nome);
CREATE INDEX IF NOT EXISTS idx_acao_nome ON acao(nome);

-- Cria função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Cria triggers para atualizar o timestamp
CREATE TRIGGER atualizar_timestamp_usuarios
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_nao_conformidades
    BEFORE UPDATE ON nao_conformidades
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_acoes_corretivas
    BEFORE UPDATE ON acoes_corretivas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_configuracoes
    BEFORE UPDATE ON configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_tipos_produto
    BEFORE UPDATE ON tipos_produto
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_tipos_situacao
    BEFORE UPDATE ON tipos_situacao
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_acao
    BEFORE UPDATE ON acao
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp(); 