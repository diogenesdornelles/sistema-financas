# Trabalho de Aplicações Corporativas I

## 1. Título

### Sys-Finan (Sistema de finanças)

#### _Um projeto para o gerenciamento de finanças_

## 2. Descrição do projeto

- O foco inicial é oferecer operações CRUD (criação, leitura, atualização e exclusão) para cada entidade necessária ao sistema, permitindo sua visualização em tela, com possibilidade de expandir funcionalidades.
- O sistema tem como objetivo gerenciar o fluxo de caixa, permitindo registrar entradas e saídas, controlar contas financeiras, gerenciar obrigações (contas a pagar) e recebíveis (contas a receber) e relacionar essas movimentações com os parceiros (fornecedores e clientes) e suas categorias correspondentes.
- As principais tecnologias envolvidas no projeto são Typescript, tanto no backend (Node), quanto no frontend (React-Vite), com persistência de dados em banco de dados Postgres.

## 3. Funcionalidades

- Todas as operações envolvem validações
- As rotas disponíveis são as seguintes:

### Rotas GET - Obter todos os registros

- `GET /user` - Obter todos os usuários
- `GET /cf` - Obter todas as contas financeiras
- `GET /cr` - Obter todos os recebíveis
- `GET /cp` - Obter todos os pagáveis
- `GET /tcf` - Obter todos os tipos de contas financeiras
- `GET /tcr` - Obter todos os tipos de recebíveis
- `GET /tcp` - Obter todos os tipos de pagáveis
- `GET /partner` - Obter todos os parceiros
- `GET /tx` - Obter todas as transações
- `GET /cat` - Obter todas as categorias de transações

### Rotas GET - Obter registro específico por ID

- `GET /user/:id` - Obter usuário específico por ID
- `GET /cf/:id` - Obter conta financeira específica por ID
- `GET /cr/:id` - Obter conta a receber específica por ID
- `GET /cp/:id` - Obter conta a pagar específica por ID
- `GET /tcf/:id` - Obter tipo de conta financeira específico por ID
- `GET /tcr/:id` - Obter tipo de conta a receber específico por ID
- `GET /tcp/:id` - Obter tipo de conta a pagar específico por ID
- `GET /partner/:id` - Obter parceiro específico por ID
- `GET /tx/:id` - Obter transação específica por ID
- `GET /cat/:id` - Obter categoria específica por ID
- `GET /login/:id` - Obter informações de login por ID

### Rotas GET - Relatórios e consultas especiais

- `GET /db/balances/:date` - Obter os balanços de contas financeiras até uma data específica
- `GET /db/cpscrs/:date` - Obter contas a pagar e a receber até uma data futura

### Rotas GET - Paginação (obter registros com skip)

- `GET /user/many/:skip` - Obter usuários com paginação
- `GET /cf/many/:skip` - Obter contas financeiras com paginação
- `GET /cr/many/:skip` - Obter contas a receber com paginação
- `GET /cp/many/:skip` - Obter contas a pagar com paginação
- `GET /tcf/many/:skip` - Obter tipos de contas financeiras com paginação
- `GET /tcr/many/:skip` - Obter tipos de contas a receber com paginação
- `GET /tcp/many/:skip` - Obter tipos de contas a pagar com paginação
- `GET /partner/many/:skip` - Obter parceiros com paginação
- `GET /tx/many/:skip` - Obter transações com paginação
- `GET /cat/many/:skip` - Obter categorias com paginação

### Rotas POST - Criar novos registros

- `POST /user` - Criar novo usuário
- `POST /cf` - Criar nova conta financeira
- `POST /cr` - Criar nova conta a receber
- `POST /cp` - Criar nova conta a pagar
- `POST /tcf` - Criar novo tipo de conta financeira
- `POST /tcr` - Criar novo tipo de conta a receber
- `POST /tcp` - Criar novo tipo de conta a pagar
- `POST /partner` - Criar novo parceiro
- `POST /tx` - Criar nova transação
- `POST /cat` - Criar nova categoria
- `POST /login` - Realizar autenticação/login

### Rotas PUT - Atualizar registros existentes

- `PUT /user/:id` - Atualizar usuário específico
- `PUT /cf/:id` - Atualizar conta financeira específica
- `PUT /cr/:id` - Atualizar conta a receber específica
- `PUT /cp/:id` - Atualizar conta a pagar específica
- `PUT /tcf/:id` - Atualizar tipo de conta financeira específico
- `PUT /tcr/:id` - Atualizar tipo de conta a receber específico
- `PUT /tcp/:id` - Atualizar tipo de conta a pagar específico
- `PUT /partner/:id` - Atualizar parceiro específico
- `PUT /tx/:id` - Atualizar transação específica
- `PUT /cat/:id` - Atualizar categoria específica

### Rotas DELETE - Remover registros

- `DELETE /user/:id` - Remover usuário específico
- `DELETE /cf/:id` - Remover conta financeira específica
- `DELETE /cr/:id` - Remover conta a receber específica
- `DELETE /cp/:id` - Remover conta a pagar específica
- `DELETE /tcf/:id` - Remover tipo de conta financeira específico
- `DELETE /tcr/:id` - Remover tipo de conta a receber específico
- `DELETE /tcp/:id` - Remover tipo de conta a pagar específico
- `DELETE /partner/:id` - Remover parceiro específico
- `DELETE /tx/:id` - Remover transação específica
- `DELETE /cat/:id` - Remover categoria específica

### Rotas para visualização de documentação

- `GET /swagger.json` - Obter resposta json
- `GET /api-docs` - Visualização UI no browser

### Parâmetros e Query Strings

- **:id** - UUID do registro específico
- **:date** - Data no formato YYYY-MM-DD para consultas temporais
- **:skip** - Número de registros a pular para paginação (geralmente múltiplos de 10 ou 20)

### Respostas da API

- Todas as rotas retornam dados em formato JSON com estrutura padronizada; e
- Para averiguar as respostas, coloque a aplicação a rodar (ver item 5.). Após, acesse o browser em `localhost/api-docs`.


## 4. Stack Tecnológica

### Frontend

- [Vite com React e TypeScript](https://vite.dev/guide/): Garante performance e uma experiência de desenvolvimento moderna e escalável.
- [React Hook Forms(RHF)](https://react-hook-form.com/) integrado ao [Zod](https://zod.dev/): Facilita a criação e validação dos formulários, melhorando a experiência do usuário e a integridade dos dados.
- Estilização: A escolha é Material UI [MUI](https://mui.com/), pois oferece flexibilidade e rapidez na implementação de interfaces voltadas a aplicações empresariais.
- [Zustand](https://zustand-demo.pmnd.rs/): Gerenciamento de estado de forma leve e simples.
- [Axios](https://axios-http.com/docs/intro): Facilita a comunicação com a API, garantindo uma integração robusta entre front e back.
- [Tanstack Query ou React Query](https://tanstack.com/query/latest): Um poderoso meio de tratar requisições e o estado de aplicações React.
- Biblioteca de visualização de dados temporais, a [React-chart-2](https://react-chartjs-2.js.org/): Importante para a criação de dashboards e relatórios que auxiliem na análise do fluxo de caixa.

### Backend

- [NodeJS](https://nodejs.org/en), [Express](https://expressjs.com/pt-br/) e [Typescript](https://www.typescriptlang.org/): Proporciona um ambiente robusto, seguro e de fácil manutenção.
- ORM [TypeORM](https://typeorm.io/) e [Sequelize](https://sequelize.org/): Auxilia na modelagem e interação com o PostgreSQL, tornando as operações CRUD mais eficientes e seguras.
- [PostgreSQL](https://www.postgresql.org/): Excelente escolha para um banco de dados relacional robusto, adequado para operações financeiras.
- [Zod](https://zod.dev/): Garante a validação dos dados no backend, protegendo o sistema contra inconsistências e entradas maliciosas.
- [JWT](https://jwt.io/): Implementa autenticação segura, garantindo que apenas usuários autorizados acessem o sistema.
- [Bcrypt](https://www.npmjs.com/package/bcrypt): Utilizado para criptografar senhas, aumentando a segurança do sistema.
- [Dotenv](https://www.npmjs.com/package/dotenv): Facilita a gestão de variáveis de ambiente, permitindo uma configuração mais segura e flexível.
- [Cors](https://www.npmjs.com/package/cors): Permite o controle de acesso entre diferentes origens, essencial para a comunicação entre o frontend e o backend.
- [Helmet](https://helmetjs.github.io/): Adiciona camadas de segurança HTTP, protegendo o sistema contra vulnerabilidades comuns.
- [Swagger](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/): Biblioteca para documentação de APIs.

### Packages

- [Jest](https://jestjs.io/): Framework de testes para garantir a qualidade e a confiabilidade do código, essencial em aplicações críticas como esta.
- [NodeJS](https://nodejs.org/en) e [Typescript](https://www.typescriptlang.org/): Proporciona um ambiente robusto, seguro e de fácil manutenção.

## 5. Requisitos de instalação e principais comandos

- Postgres funcionando em localhost, com a database criada;
- NodeJS versão 19 ou superior e npm;
- Setar as variáveis de ambiente em `.env` (backend) e `.env` (frontend), no root dir, conforme definido no item 6.;
- Start com `npm run start:app`;
- Lint com `npm run lint:all`;
- Formatação com `npm run lint:all`;

## 6. Variáveis de ambiente (.env)

- No frontend:

```plaitext
VITE_API_URL=http://127.0.0.1:3000/
```

- No backend:

```plaintext
HOST=127.0.0.1
DB_HOST=127.0.0.1
POSTGRES_DATABASE=nome do banco de dados
POSTGRES_USER=postgres
DB_PORT=5432
POSTGRES_PASSWORD=sua senha
APP_PORT=3000
SUPER_CPF=senha do super usuário
SUPER_PWD=senha do super usuário
SECRET_KEY=secret key do JWT
EXPIRES_IN=tempo de expiração do token ("1d", por exemplo)
NODE_ENV=development # or production
```

## 7. Testes

### 7.1. Configuração Inicial

Antes de executar os testes, certifique-se de que:

- O banco PostgreSQL deve estar rodando;
- As variáveis de ambiente devidamente configuradas no backend;
- O backend em execução (`npm run dev` no diretório `/backend`);
- O super usuário criado: `npm run seed:super-user`;

### 7.2. Testando com REST Client (VS Code)

Crie um arquivo `api-tests.http` na raiz do projeto:

```http
### Variáveis
@baseUrl = http://127.0.0.1:3000
@token = seu_jwt_token_aqui

### 1. Login do Super Usuário
POST {{baseUrl}}/login
Content-Type: application/json

{
  "cpf": "{{$dotenv SUPER_CPF}}",
  "pwd": "{{$dotenv SUPER_PWD}}"
}

### 2. Listar Usuários
GET {{baseUrl}}/user
Authorization: Bearer {{token}}

### 3. Criar Categoria
POST {{baseUrl}}/cat
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Alimentação",
  "description": "Gastos com alimentação",
  "user": "uuid-do-usuario"
}

### 4. Listar Categorias
GET {{baseUrl}}/cat
Authorization: Bearer {{token}}

### 5. Criar Parceiro
POST {{baseUrl}}/partner
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Fornecedor Teste",
  "type": "PJ",
  "document": "12345678000195",
  "user": "uuid-do-usuario"
}

### 6. Criar Tipo de Conta Financeira
POST {{baseUrl}}/tcf
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Conta Corrente",
  "description": "Conta corrente bancária",
  "user": "uuid-do-usuario"
}

### 7. Criar Conta Financeira
POST {{baseUrl}}/cf
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "number": "12345-6",
  "type": "uuid-do-tipo-cf",
  "user": "uuid-do-usuario",
  "balance": "1000.00",
  "ag": "0001",
  "bank": "Banco Teste"
}

### 8. Relatório de Balanços
GET {{baseUrl}}/db/balances/2024-12-31
Authorization: Bearer {{token}}

### 9. Documentação Swagger
GET {{baseUrl}}/api-docs

### 10. JSON da API
GET {{baseUrl}}/swagger.json
```

### 7.3. Testando com Postman

#### Configuração da Collection:

1. **Criar Collection:** `Sys-Finan API Tests`
2. **Variáveis de Environment:**
   ```
   baseUrl: http://127.0.0.1:3000
   token: (será preenchido após login)
   userId: (será preenchido após login)
   ```

#### Sequência de Testes Recomendada:

1. **Autenticação**

   - `POST /login` - Obter token JWT
   - Salvar token na variável de ambiente

2. **CRUD Básico - Categorias**

   - `POST /cat` - Criar categoria
   - `GET /cat` - Listar categorias
   - `GET /cat/:id` - Buscar categoria específica
   - `PUT /cat/:id` - Atualizar categoria
   - `DELETE /cat/:id` - Remover categoria

3. **CRUD Avançado - Fluxo Completo**

   - Criar Tipo de Conta Financeira (`POST /tcf`)
   - Criar Conta Financeira (`POST /cf`)
   - Criar Parceiro (`POST /partner`)
   - Criar Tipo de Conta a Pagar (`POST /tcp`)
   - Criar Conta a Pagar (`POST /cp`)
   - Listar contas com paginação (`GET /cp/many/0`)

4. **Relatórios**
   - `GET /db/balances/2024-12-31`
   - `GET /db/cpscrs/2024-12-31`

### 7.4. Testes Automatizados com Jest

#### Estrutura de Testes:

```
backend/
├── tests/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── user.test.ts
│   │   ├── category.test.ts
│   │   └── financial-flow.test.ts
│   ├── unit/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── utils/
│   └── setup.ts
```

#### Exemplo de Teste de Integração:

```typescript

import request from "supertest";
import app from "../../src/app";

describe("Authentication", () => {
  it("should login with valid credentials", async () => {
    const response = await request(app).post("/login").send({
      cpf: process.env.SUPER_CPF,
      pwd: process.env.SUPER_PWD,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("token");
  });

  it("should reject invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      cpf: "12345678901",
      pwd: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
```

#### Comandos para Executar Testes:

```bash
npm install --save-dev jest @types/jest supertest @types/supertest

npm test

npm test -- auth.test.ts

npm test -- --coverage

npm test -- --watch
```

### 7.5. Validação de Dados

#### Testes de Validação Zod:

```http
### Teste - Dados inválidos (deve retornar 400)
POST {{baseUrl}}/user
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "",
  "cpf": "123",
  "pwd": "123"
}

### Teste - Campos obrigatórios ausentes
POST {{baseUrl}}/cat
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "description": "Categoria sem nome"
}
```

### 7.6. Testes de Performance

#### Teste de Carga com múltiplas requisições:

```bash
npm install -g artillery

echo "config:
  target: 'http://127.0.0.1:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Get Categories'
    requests:
      - get:
          url: '/cat'" > artillery-config.yml

artillery run artillery-config.yml
```

### 7.7. Checklist de Testes

#### Funcionalidades Básicas:

- [ ] Autenticação com credenciais válidas
- [ ] Rejeição de credenciais inválidas
- [ ] CRUD completo para todas as entidades
- [ ] Validação de dados de entrada
- [ ] Paginação funcionando corretamente
- [ ] Relatórios retornando dados corretos

#### Segurança:

- [ ] Rotas protegidas exigem autenticação
- [ ] Tokens JWT válidos são aceitos
- [ ] Tokens expirados são rejeitados
- [ ] Dados sensíveis não são expostos

#### Performance:

- [ ] Tempo de resposta < 200ms para consultas simples
- [ ] Tempo de resposta < 500ms para relatórios
- [ ] Sistema suporta 50 requisições simultâneas

#### Integridade de Dados:

- [ ] Transações atualizam saldos corretamente
- [ ] Relacionamentos entre entidades funcionam
- [ ] Soft delete preserva referências
- [ ] Validações de negócio são respeitadas

### 7.8. Troubleshooting

#### Problemas Comuns:

1. **Erro 401 - Unauthorized**

   - Verificar se o token JWT está sendo enviado
   - Confirmar se o token não expirou

2. **Erro 400 - Validation Error**

   - Verificar se todos os campos obrigatórios estão preenchidos
   - Confirmar formato dos dados (UUIDs, datas, etc.)

3. **Erro 500 - Internal Server Error**

   - Verificar se o banco de dados está acessível
   - Confirmar se as variáveis de ambiente estão corretas
   - Verificar logs do servidor para detalhes

4. **Timeout de Conexão**
   - Verificar se o backend está rodando na porta correta
   - Confirmar configurações de firewall/proxy

## 8. Estrutura de pastas

## Expansões Futuras

A modularidade do sistema permite a inclusão de funcionalidades adicionais, como:

- Relatórios e Dashboards mais elaborados: Análises visuais do fluxo de caixa e gráficos que auxiliem na tomada de decisão;
- Alertas e Notificações: Lembretes para contas a pagar ou receber, evitando atrasos e multas;
- Controle de Acesso e Auditoria: Implementação de autenticação, autorização e logs para monitorar as atividades do sistema;
- Incluir forma de pagamento para qualificar de forma mais acurada as transações;

## Principais noções sobre as Regras de Negócio

- As contas financeiras (CF) são a alma do sistema, possuindo número com campo principal a ser fornecido e um tipo (TCF);
- Pressupõe-se, de antemão, seja a CF uma conta em instituição bancária usual, de modo que é possível preencher outros campos, como agência e banco;
- Se, porventura, se tratar de um cartão (crédito ou débito) é possível aproveitar os campos com informações que o identifique univocamente;
- Todas as CFs possuem, ainda, um saldo, o qual deve estar sempre atualizado;
- Importante ressaltar que, uma vez criada a conta financeira, com o seu saldo, não é possível manipular de forma direta qualquer tipo de saldo (original ou atual). Isso somente é possível através de interações diretas com a database;
- O saldo somente pode ser incrementado ou decrementado, respectivamente, por um efetivo recebimento ou pagamento de uma conta;
- Para um recebimento, o sistema permite o gerenciamento de contas a receber (CR);
- Para um pagamento, o sistema permite o gerenciamento de contas a pagar (CP);
- Todas as contas possuem um tipo, convém frisar (TCP, TCR, TCF);
- Cada uma dessas contas (a receber ou a pagar) possui um valor, uma data de vencimento, um parceiro (Partner) e um status, com o objetivo de controle;
- O efetivo pagamento ou recebimento, quando registrado, gera uma atualização automática do saldo da respectiva conta;
- Para gerar o movimento de conta, deve haver uma transação (TX) como entidade associativa, em que se registra CP ou CR, a CF e a data da transação;
- Concluímos que não é preciso ter tipo de transação: se a transação estiver ligada com uma conta a receber, será de Entrada e, por outro lado, se for de pagamento, Saída;
- Obviamente, uma transação deve estar ligada, por vez, a uma CP OU CR, não a ambas simultaneamente;
- CP ou CR não precisam de campos de efetivo pagamento ou recebimento, pois estará registrado na pŕopria transação a que se refiram;

## 9. Estrutura de pastas

```
sys_finan
 ├── README.md
 ├─> backend
 │   ├── eslint.config.js
 │   ├── package-lock.json
 │   ├── package.json
 │   ├─> src
 │   │   ├── app.ts
 │   │   ├── appRoutes.ts
 │   │   ├─> config
 │   │   │   ├── sequelize.db.config.ts
 │   │   │   └── typeorm.db.config.ts
 │   │   ├─> controller
 │   │   │   ├── base.controller.ts
 │   │   │   ├── cat.controller.ts
 │   │   │   ├── cf.controller.ts
 │   │   │   ├── cp.controller.ts
 │   │   │   ├── cr.controller.ts
 │   │   │   ├── db.controller.ts
 │   │   │   ├── login.controller.ts
 │   │   │   ├── partner.controller.ts
 │   │   │   ├── tcf.controller.ts
 │   │   │   ├── tcp.controller.ts
 │   │   │   ├── tcr.controller.ts
 │   │   │   ├── tx.controller.ts
 │   │   │   └── user.controller.ts
 │   │   ├─> entity
 │   │   │   └── entities.ts
 │   │   ├─> interfaces
 │   │   │   ├── AuthPayload.interface.ts
 │   │   │   └── CustomRequest.interface.ts
 │   │   ├─> middleware
 │   │   │   └── GeneralMiddleware.ts
 │   │   ├─> migrations
 │   │   │   └─> forTypeorm
 │   │   │       └── InicitalMigration.ts
 │   │   ├─> route
 │   │   │   ├── base.route.ts
 │   │   │   ├── cat.route.ts
 │   │   │   ├── cf.route.ts
 │   │   │   ├── cp.route.ts
 │   │   │   ├── cr.route.ts
 │   │   │   ├── db.route.ts
 │   │   │   ├── login.routes.ts
 │   │   │   ├── partner.route.ts
 │   │   │   ├── tcf.route.ts
 │   │   │   ├── tcp.route.ts
 │   │   │   ├── tcr.route.ts
 │   │   │   ├── tx.route.ts
 │   │   │   └── user.route.ts
 │   │   ├─> seeds
 │   │   │   ├── SeedManager.ts
 │   │   │   ├─> create
 │   │   │   │   ├── createSeedCat.ts
 │   │   │   │   ├── createSeedPartner.ts
 │   │   │   │   ├── createSeedSuperUser.ts
 │   │   │   │   ├── createSeedTcf.ts
 │   │   │   │   ├── createSeedTcp.ts
 │   │   │   │   ├── createSeedTcr.ts
 │   │   │   │   └── createSeedUser.ts
 │   │   │   ├─> dataSeed
 │   │   │   │   ├── catsSeed.ts
 │   │   │   │   ├── partnersSeed.ts
 │   │   │   │   ├── tcfsSeed.ts
 │   │   │   │   ├── tcpsSeed.ts
 │   │   │   │   ├── tcrsSeed.ts
 │   │   │   │   └── usersSeed.ts
 │   │   │   ├─> forTypeorm
 │   │   │   │   └── createSeedSuperUser.ts
 │   │   │   ├── runAllSeeds.ts
 │   │   │   └─> utils
 │   │   │       ├── generateValidCNPJ.ts
 │   │   │       └── generateValidCPF.ts
 │   │   ├── server.ts
 │   │   ├─> service
 │   │   │   ├── base.service.ts
 │   │   │   ├── cat.service.ts
 │   │   │   ├── cf.service.ts
 │   │   │   ├── cp.service.ts
 │   │   │   ├── cr.service.ts
 │   │   │   ├── db.service.ts
 │   │   │   ├── login.service.ts
 │   │   │   ├── partner.service.ts
 │   │   │   ├── tcf.service.ts
 │   │   │   ├── tcp.service.ts
 │   │   │   ├── tcr.service.ts
 │   │   │   ├── tx.service.ts
 │   │   │   └── user.service.ts
 │   │   ├─> types
 │   │   │   ├── baseRouter.type.ts
 │   │   │   └── routeConfig.type.ts
 │   │   └─> utils
 │   │       ├── apiError.util.ts
 │   │       └── hashPwd.util.ts
 │   ├── swagger.json
 │   └── tsconfig.json
 ├─> docs
 │   └── erdSysFinan.png
 ├── dree.setup.ts
 ├─> frontend
 │   ├── eslint.config.js
 │   ├── index.html
 │   ├── package-lock.json
 │   ├── package.json
 │   ├─> public
 │   │   └── env.js
 │   ├─> src
 │   │   ├── App.css
 │   │   ├── App.tsx
 │   │   ├─> api
 │   │   │   └── Api.ts
 │   │   ├─> assets
 │   │   │   └─> images
 │   │   │       ├── dashboard.svg
 │   │   │       ├── help.svg
 │   │   │       ├── logout.svg
 │   │   │       └── manage.svg
 │   │   ├─> components
 │   │   │   ├─> alerts
 │   │   │   │   └── ErrorAlert.tsx
 │   │   │   ├─> dialogs
 │   │   │   │   └── ExcludeDialog.tsx
 │   │   │   ├─> forms
 │   │   │   │   ├─> create
 │   │   │   │   ├─> search
 │   │   │   │   └─> update
 │   │   │   ├─> tables
 │   │   │   │   ├── CatTable.tsx
 │   │   │   │   ├── CfTable.tsx
 │   │   │   │   ├── CpTable.tsx
 │   │   │   │   ├── CrTable.tsx
 │   │   │   │   ├── PartnerTable.tsx
 │   │   │   │   ├── TcfTable.tsx
 │   │   │   │   ├── TcpTable.tsx
 │   │   │   │   ├── TcrTable.tsx
 │   │   │   │   ├── TxTable.tsx
 │   │   │   │   └── UserTable.tsx
 │   │   │   └─> ui
 │   │   │       ├── ButtonUpdateForm.tsx
 │   │   │       ├── CustomBackdrop.tsx
 │   │   │       ├── FormContainer.tsx
 │   │   │       ├── ManageArea.tsx
 │   │   │       ├── RequireAuth.tsx
 │   │   │       └── ToggleThemeButton.tsx
 │   │   ├─> constants
 │   │   │   ├── css.ts
 │   │   │   └── dashboard.ts
 │   │   ├─> contexts
 │   │   │   ├── AuthContext.tsx
 │   │   │   └── ColorModeContext.tsx
 │   │   ├─> domain
 │   │   │   └─> types
 │   │   │       └── formState.ts
 │   │   ├─> hooks
 │   │   │   ├─> service
 │   │   │   │   ├─> cat
 │   │   │   │   ├─> cf
 │   │   │   │   ├─> cp
 │   │   │   │   ├─> cr
 │   │   │   │   ├─> db
 │   │   │   │   ├─> login
 │   │   │   │   ├─> partner
 │   │   │   │   ├─> tcf
 │   │   │   │   ├─> tcp
 │   │   │   │   ├─> tcr
 │   │   │   │   ├─> tx
 │   │   │   │   └─> user
 │   │   │   ├── useAuth.tsx
 │   │   │   ├── useEndSession.tsx
 │   │   │   └── useFormStore.tsx
 │   │   ├── index.css
 │   │   ├─> layouts
 │   │   │   └── RootLayout.tsx
 │   │   ├── main.tsx
 │   │   ├─> pages
 │   │   │   ├── Dashboard.tsx
 │   │   │   ├── ErrorPage.tsx
 │   │   │   ├── Home.tsx
 │   │   │   ├── Login.tsx
 │   │   │   ├── Manage.tsx
 │   │   │   └── Manual.tsx
 │   │   ├─> providers
 │   │   │   ├── ColorModeProvider.tsx
 │   │   │   └── SessionProvider.tsx
 │   │   ├─> templates
 │   │   │   ├── footer.tsx
 │   │   │   └── nav.tsx
 │   │   ├─> utils
 │   │   │   ├── clients.tsx
 │   │   │   ├── getTokenFromSession.ts
 │   │   │   └── handleUnauthorizedAccess.ts
 │   │   └── vite-env.d.ts
 │   ├── tsconfig.app.json
 │   ├── tsconfig.json
 │   ├── tsconfig.node.json
 │   └── vite.config.ts
 ├── package-lock.json
 ├── package.json
 └─> packages
     ├── jest.config.js
     ├── package-lock.json
     ├── package.json
     ├─> src
     │   ├─> dtos
     │   │   ├── cat.dto.ts
     │   │   ├── cf.dto.ts
     │   │   ├── cp.dto.ts
     │   │   ├── cr.dto.ts
     │   │   ├── db.dto.ts
     │   │   ├── index.ts
     │   │   ├── partner.dto.ts
     │   │   ├── tcf.dto.ts
     │   │   ├── tcp.dto.ts
     │   │   ├── tcr.dto.ts
     │   │   ├── token.dto.ts
     │   │   ├── tx.dto.ts
     │   │   ├── user.dto.ts
     │   │   └─> utils
     │   │       ├── enums.ts
     │   │       └── index.ts
     │   ├── index.ts
     │   ├─> utils
     │   │   ├── floatToPtBrMoney.ts
     │   │   ├── index.ts
     │   │   └── strToPtBrMoney.ts
     │   └─> validators
     │       ├── GeneralValidator.ts
     │       ├── index.ts
     │       ├─> utils
     │       │   ├── dateSchema.ts
     │       │   ├── index.ts
     │       │   └── statusBoolSchema.ts
     │       └─> zodSchemas
     │           ├─> create
     │           ├── index.ts
     │           ├─> query
     │           └─> update
     ├─> tests
     │   ├── createValidators.test.ts
     │   ├── dateSchema.test.ts
     │   ├── generalValidator.test.ts
     │   └── queryValidator.test.ts
     └── tsconfig.json
```

### Descrição das Pastas Principais:

#### 🔧 **Backend** (`/backend`)
- **Controllers**: Gerenciam as requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Entities**: Modelos do banco de dados (TypeORM)
- **Routes**: Definições das rotas da API
- **Config**: Configurações do banco e aplicação
- **Utils**: Funções utilitárias e helpers

#### 🎨 **Frontend** (`/frontend`)
- **Components**: Componentes React reutilizáveis
- **Pages**: Páginas da aplicação
- **Services**: Comunicação com a API
- **Store**: Gerenciamento de estado (Zustand)
- **Hooks**: Custom hooks React
- **Types**: Definições de tipos TypeScript

#### 📦 **Packages** (`/packages`)
- **DTOs**: Objetos de transferência de dados compartilhados
- **Validators**: Schemas de validação Zod
- **Utils**: Utilitários compartilhados entre frontend e backend
- **Build**: Código compilado para distribuição

### Características da Arquitetura:

1. **Monorepo**: Código compartilhado no pacote `packages`
2. **TypeScript**: Tipagem forte em todo o projeto
3. **Modular**: Separação clara de responsabilidades
4. **Escalável**: Estrutura que permite crescimento
5. **Testável**: Diretórios dedicados para testes
6. **Documentada**: APIs documentadas com Swagger

## 10. Licença

Este projeto é **open source** e está licenciado sob a **Licença MIT**.

### MIT License

```
MIT License

Copyright (c) 2024 Sys-Finan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 11. Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Suporte

Se você encontrar algum problema ou tiver dúvidas sobre o projeto:

- Entre em contato através do email: **[diogenes.dornelles@gmail.com]**

### Agradecimentos

Agradecemos, desde já, a todos os contribuidores que ajudaram a tornar este projeto possível! 

---
