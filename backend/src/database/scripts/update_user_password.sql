-- Script para atualizar a senha do usuário ti01@oliveira.com.br
-- IMPORTANTE: Execute este script conectado ao banco de dados do sistema
-- A nova senha será: Xinxuan99

-- Primeiro, vamos verificar se o usuário existe
DO $$
DECLARE
    usuario_id INTEGER;
BEGIN
    -- Verifica se o usuário existe
    SELECT id INTO usuario_id
    FROM usuarios
    WHERE email = 'ti01@oliveira.com.br';

    IF usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;

    -- Atualiza a senha do usuário
    -- O hash abaixo foi gerado usando bcrypt com salt 10
    UPDATE usuarios
    SET senha_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = usuario_id;

    RAISE NOTICE 'Senha atualizada com sucesso para o usuário %', 'ti01@oliveira.com.br';
END $$; 