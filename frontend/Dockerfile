# Build stage
FROM node:18-alpine as build

# Adicionar ferramentas necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro
COPY package*.json ./

# Mostrar conteúdo dos arquivos para debug
RUN echo "Conteúdo do package.json:" && cat package.json
RUN echo "Node version:" && node -v
RUN echo "NPM version:" && npm -v

# Instalar dependências com mais verbosidade
RUN npm install --verbose --legacy-peer-deps && \
    npm cache clean --force

# Copiar o resto dos arquivos do projeto
COPY . .

# Criar arquivo .env com as variáveis de ambiente
RUN echo "VITE_API_URL=http://backend:3000/api" > .env

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar a build do React
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 