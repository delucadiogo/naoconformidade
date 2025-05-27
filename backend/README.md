# Backend - Sistema de Controle de Não Conformidades Internas

Este é o backend do sistema de Controle de Não Conformidades Internas, desenvolvido com Node.js, Express e PostgreSQL.

## Requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL 17
- Git

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=nao_conformidades
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
UPLOAD_FOLDER=uploads
```

4. Crie o banco de dados:
```bash
psql -U seu_usuario -d postgres
CREATE DATABASE nao_conformidades;
\c nao_conformidades
\i src/database/init.sql
```

5. Inicie o servidor:
```bash
npm run dev
```

## Endpoints da API

### Usuários

- `POST /api/usuarios/registrar`: Registra um novo usuário
  - Body: `{ "nome": "string", "email": "string", "senha": "string" }`

- `POST /api/usuarios/login`: Realiza login
  - Body: `{ "email": "string", "senha": "string" }`

### Não Conformidades

Todas as rotas de não conformidades requerem autenticação via token JWT no header:
`Authorization: Bearer <seu_token>`

- `POST /api/nao-conformidades`: Cria uma nova não conformidade
  - Body (multipart/form-data):
    - data_lancamento: "YYYY-MM-DD"
    - nome_produto: string
    - validade: "YYYY-MM-DD"
    - lote: string
    - tipo_produto: string
    - descricao: string
    - data_liberacao: "YYYY-MM-DD" (opcional)
    - acao_tomada: string (opcional)
    - fotos: arquivos (máximo 5)

- `GET /api/nao-conformidades`: Lista todas as não conformidades

- `GET /api/nao-conformidades/:id`: Busca uma não conformidade específica

- `PUT /api/nao-conformidades/:id`: Atualiza uma não conformidade
  - Body: Mesmo formato do POST

- `DELETE /api/nao-conformidades/:id`: Deleta uma não conformidade

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   │   
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   └── naoConformidadeController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── usuarioRoutes.js
│   │   └── naoConformidadeRoutes.js
│   ├── database/
│   │   └── init.sql
│   └── server.js
├── uploads/
├── .env
├── package.json
└── README.md
```

## Desenvolvimento

- Use `npm run dev` para iniciar o servidor em modo de desenvolvimento com hot-reload
- Os logs de criação e atualização são exibidos no console
- As fotos são salvas no diretório `uploads/`

## Segurança

- Senhas são hasheadas antes de serem salvas no banco
- Autenticação via JWT
- Validação de tipos de arquivo para upload de imagens
- Limite de tamanho para upload de arquivos (5MB por arquivo)
- CORS configurado para segurança 