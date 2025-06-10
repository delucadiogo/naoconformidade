-- Cria a extensão pgcrypto se não existir
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cria a tabela de usuários se não existir
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

-- Insere o usuário admin apenas se não existir
INSERT INTO usuarios (nome, email, senha_hash, funcao, departamento)
SELECT 'Admin', 'ti01@oliveira.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'TI'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'ti01@oliveira.com.br'
); 