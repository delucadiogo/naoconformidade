-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de tipos de produto
CREATE TABLE IF NOT EXISTS tipos_produto (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de tipos de ação
CREATE TABLE IF NOT EXISTS tipos_acao (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de não conformidades
CREATE TABLE IF NOT EXISTS nao_conformidades (
    id SERIAL PRIMARY KEY,
    data_lancamento DATE NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    validade DATE NOT NULL,
    lote VARCHAR(255) NOT NULL,
    tipo_produto VARCHAR(255) NOT NULL,
    acao_tomada VARCHAR(255),
    descricao TEXT,
    fotos TEXT[],
    criado_por INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin inicial
INSERT INTO usuarios (nome, email, senha) 
VALUES ('TI01', 'ti01@oliveira.com.br', '$2b$10$YourHashHere') 
ON CONFLICT (email) DO NOTHING; 