-- Primeiro, vamos verificar se o usuário existe
SELECT id, email, senha_hash 
FROM usuarios 
WHERE email = 'ti01@oliveira.com.br';

-- Agora vamos atualizar a senha com um novo hash
UPDATE usuarios 
SET senha_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    atualizado_em = CURRENT_TIMESTAMP
WHERE email = 'ti01@oliveira.com.br';

-- Vamos verificar se a atualização foi bem sucedida
SELECT id, email, senha_hash, atualizado_em
FROM usuarios 
WHERE email = 'ti01@oliveira.com.br'; 