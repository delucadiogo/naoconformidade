-- Script para preparar o ambiente para reset de senha
-- Este script deve ser executado como superusuário (postgres)

-- Criar extensão pgcrypto se não existir
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verificar se a extensão foi instalada
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'pgcrypto'
    ) THEN
        RAISE NOTICE 'Extensão pgcrypto está instalada e pronta para uso';
    ELSE
        RAISE EXCEPTION 'Falha ao instalar a extensão pgcrypto';
    END IF;
END $$; 