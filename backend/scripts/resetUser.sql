-- Remove o usuário atual
DELETE FROM usuarios WHERE email = 'ti01@oliveira.com.br';

-- Cria o novo usuário com uma senha mais simples
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
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    'TI',
    true
);

-- Verifica se o usuário foi criado
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