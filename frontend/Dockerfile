# Build stage
FROM node:18-alpine as build

# Adicionar ferramentas necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instalar dependências com mais verbosidade e sem audit
RUN npm ci --verbose --no-audit --no-optional && npm cache clean --force

# Copiar o resto dos arquivos do projeto
COPY . .

# Criar arquivo .env com as variáveis de ambiente
RUN echo "VITE_API_URL=http://backend:3000/api" > .env

# Build da aplicação
RUN npm run build || (echo "Build failed" && npm run build --verbose && exit 1)

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