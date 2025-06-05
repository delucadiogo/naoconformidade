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

# Criar diretório para uploads
RUN mkdir -p uploads && chmod 777 uploads

# Dar permissão de execução ao script de inicialização
RUN chmod +x /app/scripts/init-db.sh

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["/bin/sh", "-c", "/app/scripts/init-db.sh && npm start"] 