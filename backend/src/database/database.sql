-- Conectar ao PostgreSQL e criar o banco de dados se não existir
\c postgres;
CREATE DATABASE nao_conformidades;

-- Conectar ao banco de dados criado
\c nao_conformidades;

-- Incluir o arquivo de migração dos usuários
\i src/database/migrations/001_create_users_table.sql; 