# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com flags para evitar problemas
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Criar arquivo .env se não existir
RUN echo "VITE_API_URL=http://backend:3001/api" > .env

# Criar build de produção
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar build do React para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 