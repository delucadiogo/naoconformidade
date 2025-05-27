# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências com mais verbosidade
RUN npm install --legacy-peer-deps --verbose

# Copiar resto dos arquivos
COPY . .

# Criar arquivo .env
RUN echo "VITE_API_URL=http://backend:3001/api" > .env

# Mostrar conteúdo do diretório para debug
RUN ls -la

# Tentar build com mais informações de erro
RUN npm run build || (echo "Build failed" && npm run build --verbose && exit 1)

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