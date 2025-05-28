-- Script para redefinir a senha do usuário ti01@oliveira.com.br
-- IMPORTANTE: Execute este script conectado ao banco de dados do sistema
-- A nova senha será: Xinxuan99

-- Primeiro, vamos verificar se o usuário existe
DO $$
DECLARE
    usuario_id INTEGER;
    nova_senha_hash TEXT;
BEGIN
    -- Verifica se o usuário existe
    SELECT id INTO usuario_id
    FROM usuarios
    WHERE email = 'ti01@oliveira.com.br';

    IF usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado';
    END IF;

    -- Define a nova senha usando a função crypt do pgcrypto
    -- Certifique-se de que a extensão pgcrypto está instalada
    -- CREATE EXTENSION IF NOT EXISTS pgcrypto;
    nova_senha_hash = crypt('Xinxuan99', gen_salt('bf', 10));

    -- Atualiza a senha do usuário
    UPDATE usuarios
    SET senha_hash = nova_senha_hash,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = usuario_id;

    RAISE NOTICE 'Senha atualizada com sucesso para o usuário %', 'ti01@oliveira.com.br';
END $$; 