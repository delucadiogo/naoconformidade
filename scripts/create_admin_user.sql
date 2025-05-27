-- Primeiro, vamos garantir que a tabela usuarios existe
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    funcao VARCHAR(50) NOT NULL DEFAULT 'user',
    departamento VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir o usuário administrador
-- A senha é 'Xinxuan99' (já com hash bcrypt)
INSERT INTO usuarios (nome, email, senha_hash, funcao, departamento, ativo)
VALUES (
    'Diogo',
    'ti01@oliveira.com.br',
    '$2b$10$8jxM1Zdm5czS6LLZtFp3/.Rd0YHWoJKYm2p4LQv2NVrhLF/SumKHi',
    'admin',
    'TI',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT id, nome, email, funcao, departamento, ativo, criado_em 
FROM usuarios 
WHERE email = 'ti01@oliveira.com.br'; 