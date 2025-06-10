-- Primeiro, vamos remover todos os usuários existentes
DELETE FROM usuarios WHERE email = 'ti01@oliveira.com.br';

-- Agora vamos criar um novo usuário com uma senha mais simples
INSERT INTO usuarios (
    nome,
    email,
    senha_hash,
    funcao,
    departamento,
    ativo
) VALUES (
    'Admin',
    'ti01@oliveira.com.br',
    '$2a$10$rQnM1.5Nk5P5k5P5k5P5kO5k5P5k5P5k5P5k5P5k5P5k5P5k5P5k5P5k',
    'admin',
    'TI',
    true
);

-- Vamos verificar se o usuário foi criado
SELECT 
    id,
    nome,
    email,
    senha_hash,
    funcao,
    departamento,
    ativo,
    criado_em,
    atualizado_em
FROM usuarios 
WHERE email = 'ti01@oliveira.com.br'; 