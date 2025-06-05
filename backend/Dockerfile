# Build stage
FROM node:18-alpine

# Adicionar dependências necessárias
RUN apk add --no-cache python3 make g++ postgresql-client

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com flags para maior compatibilidade
RUN npm install --verbose --legacy-peer-deps --no-optional && \
    npm cache clean --force

# Copiar código fonte
COPY . .

# Criar diretório para uploads e scripts
RUN mkdir -p uploads && chmod 777 uploads && \
    mkdir -p scripts

# Criar script de inicialização
RUN echo '#!/bin/sh\n\
# Esperar o PostgreSQL iniciar\n\
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c \'\q\'; do\n\
  echo "PostgreSQL ainda não está pronto - aguardando..."\n\
  sleep 2\n\
done\n\
\n\
echo "PostgreSQL está pronto - executando migrations..."\n\
\n\
# Executar o script SQL\n\
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/src/database/migrations/init.sql\n\
\n\
echo "Migrations executadas com sucesso!"' > /app/scripts/init-db.sh && \
    chmod +x /app/scripts/init-db.sh

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["/bin/sh", "-c", "/app/scripts/init-db.sh && npm start"] 