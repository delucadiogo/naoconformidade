-- Primeiro, vamos criar uma tabela temporária com a nova estrutura
CREATE TABLE IF NOT EXISTS nao_conformidades_new (
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

-- Copiar os dados existentes para a nova tabela
INSERT INTO nao_conformidades_new (
    id,
    titulo,
    descricao,
    local,
    data_ocorrencia,
    data_deteccao,
    status,
    tipo,
    gravidade,
    responsavel_id,
    criado_por_id,
    data_lancamento,
    nome_produto,
    validade,
    lote,
    tipo_produto,
    data_liberacao,
    acao_tomada,
    situacao,
    fotos,
    criado_em,
    atualizado_em
)
SELECT 
    id,
    titulo,
    descricao,
    local,
    data_ocorrencia,
    data_deteccao,
    status,
    tipo,
    gravidade,
    responsavel_id,
    criado_por_id,
    data_lancamento,
    nome_produto,
    validade,
    lote,
    tipo_produto,
    data_liberacao,
    acao_tomada,
    COALESCE(situacao, 'Pendente'),
    fotos,
    criado_em,
    atualizado_em
FROM nao_conformidades;

-- Remover a tabela antiga
DROP TABLE nao_conformidades;

-- Renomear a nova tabela para o nome original
ALTER TABLE nao_conformidades_new RENAME TO nao_conformidades;

-- Recriar os índices
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_status ON nao_conformidades(status);
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_data_ocorrencia ON nao_conformidades(data_ocorrencia);
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_situacao ON nao_conformidades(situacao);

-- Recriar o trigger de atualização
CREATE TRIGGER atualizar_timestamp_nao_conformidades
    BEFORE UPDATE ON nao_conformidades
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp(); 