#!/bin/bash

# Aguarda o postgres estar pronto
echo "Aguardando o Postgres iniciar..."
sleep 5

# Executa as migrações em ordem
for migration in /app/src/database/migrations/*.sql
do
  echo "Executando migração: $migration"
  psql -U postgres -d nao_conformidades -f $migration
done

echo "Migrações concluídas!" 