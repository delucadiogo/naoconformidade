-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Criação da tabela de não conformidades
CREATE TABLE IF NOT EXISTS nao_conformidades (
  id SERIAL PRIMARY KEY,
  data_lancamento DATE NOT NULL,
  nome_produto VARCHAR(255) NOT NULL,
  validade DATE NOT NULL,
  lote VARCHAR(100) NOT NULL,
  tipo_produto VARCHAR(50) NOT NULL,
  descricao TEXT,
  fotos TEXT[],
  data_liberacao DATE,
  acao_tomada VARCHAR(100),
  criado_por INT REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_data_lancamento ON nao_conformidades(data_lancamento);
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_criado_por ON nao_conformidades(criado_por);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email); 