# Build stage
FROM node:18-alpine

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para uploads
RUN mkdir -p uploads && chmod 777 uploads

# Adiciona o script de migração
COPY scripts/run-migrations.sh /app/scripts/
RUN chmod +x /app/scripts/run-migrations.sh

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 