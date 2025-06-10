-- Atualiza a senha do usuário com o hash correto
UPDATE usuarios 
SET senha_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'ti01@oliveira.com.br';

-- Verifica se o usuário foi atualizado
SELECT id, email, senha_hash 
FROM usuarios 
WHERE email = 'ti01@oliveira.com.br'; 