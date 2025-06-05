# Build stage
FROM node:18-alpine as build

# Adicionar ferramentas necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Limpar cache do npm e instalar dependências com mais verbosidade
RUN npm cache clean --force
RUN npm install --legacy-peer-deps --verbose

# Copiar resto dos arquivos
COPY . .

# Criar arquivo .env
RUN echo "VITE_API_URL=http://backend:3000/api" > .env

# Mostrar conteúdo do diretório e ambiente para debug
RUN ls -la
RUN npm list || true
RUN node -v
RUN npm -v

# Build com mais informações de debug
RUN NODE_ENV=production npm run build --verbose

# Production stage
FROM nginx:alpine

# Copiar build do React
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 