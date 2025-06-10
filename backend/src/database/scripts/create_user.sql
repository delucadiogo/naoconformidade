-- Script para criar o usuário ti01@oliveira.com.br
-- IMPORTANTE: Execute este script conectado ao banco de dados do sistema
-- A senha será: Xinxuan99

-- Primeiro, vamos verificar se a extensão pgcrypto está instalada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verifica se o usuário já existe
DO $$
DECLARE
    usuario_existe BOOLEAN;
BEGIN
    -- Verifica se o usuário já existe
    SELECT EXISTS (
        SELECT 1 
        FROM usuarios 
        WHERE email = 'ti01@oliveira.com.br'
    ) INTO usuario_existe;

    IF usuario_existe THEN
        RAISE EXCEPTION 'Usuário já existe';
    END IF;

    -- Insere o novo usuário
    INSERT INTO usuarios (
        email,
        senha_hash,
        nome,
        departamento,
        funcao,
        ativo,
        criado_em,
        atualizado_em
    ) VALUES (
        'ti01@oliveira.com.br',
        crypt('Xinxuan99', gen_salt('bf', 10)),
        'TI Oliveira',
        'Tecnologia da Informação',
        'user',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    RAISE NOTICE 'Usuário criado com sucesso: %', 'ti01@oliveira.com.br';
END $$; 