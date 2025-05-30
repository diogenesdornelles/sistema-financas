# sistema-financas

O sistema terá como objetivo gerenciar o fluxo de caixa, permitindo registrar entradas e saídas, controlar contas financeiras, gerenciar obrigações (contas a pagar) e recebíveis (contas a receber) e relacionar essas movimentações com os parceiros (fornecedores e clientes) e suas categorias correspondentes.

O foco inicial é oferecer operações CRUD (criação, leitura, atualização e exclusão) para cada entidade, com possibilidade de expandir funcionalidades.

## Entidades e Modelagem

1. **Usuário**

   - _id (uuid) (pk) (default uuid)_: Identificador único do usuário. Required: response.
   - _name (varchar(30))_: Nome. Required: create e response. Optional: update.
   - _surname (varchar(60))_: Sobrenome. Required: create e response. Optional: update.
   - _cpf (varchar(11)) (unique)_: Armazena o CPF com validações. Required: create e response, Optional: update.
   - _pwd (varchar(128))_: Senha do usuário, que deve ser armazenada de forma criptografada. Required: create. Optional: update. Response: não.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

2. **Conta Financeiras (CF)**

   - _id (uuid) (pk) (default uuid)_: Identificador único da conta. Required: response.
   - _number (varchar(10))_: Identificador da conta na instituição bancária. Required: response create. Optional: update.
   - _ag (nullable) (varchar(10))_: Agência bancária. Required: response. Optional: update e create.
   - _bank varchar(30) (nullable)_: Banco. Required: response. Optional: update e create.
   - _initialBalance (decimal(15,2)) (default 0.0)_: Valor inicial da conta, com precisão para operações financeiras. Optional: create e update. Required: response.
   - _currentBalance (decimal(15,2)) (default 0.0)_: Valor atual da conta, com precisão para operações financeiras. Optional: create e update. Required: response.
   - _type (TipoCF) (fk)_: Indica o tipo de conta (ex.: conta corrente, poupança, cartão de crédito, cartão de débito, etc). Uma CF tem um tipo dentre muitos (1:N). Required: response e create. Optional: update.
   - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
   - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
   - _status enum(pendente, paga, cancelada) (default=pendente)_:: Indica se está pendente, paga ou cancelada. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

3. **Tipo de Conta Financeira (TipoCF)**

   - _id (uuid) (pk) (default uuid)_: Identificador único do tipo de conta. Required: response.
   - _name (varchar) (unique)_: Nome do tipo (ex.: Conta Corrente, Poupança). Required: create e response. Optional: update.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

4. **Conta a Pagar (CP)**

   - _id (uuid) (pk) (default uuid)_: Identificador único da obrigação. Required: response.
   - _value (decimal(15,2))_: Valor da conta a pagar. Required: create e response. Optional: update.
   - _type (TipoCP) (fk)_: Define a forma de pagamento ou a origem da obrigação (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CP tem um tipo dentre muitos (1:N). Required: create e response. Optional: update.
   - _supplier (Parceiro) (fk)_: A quem é devido o título. Uma conta a pagar possui um único fornecedor, dentre muitos (1:N). Required: create e response. Optional: update.
   - _due (Date)_: data de vencimento da obrigação. Required: create e response. Optional: update.
   - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Optional: create e update. Required: response.
   - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
   - _status enum(pendente, paga, cancelada) (default=pendente)_: Indica se está pago, pendente ou cancelado. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

5. **Tipo de Conta a Pagar (TipoCP)**

   - _id (uuid) (pk) (default uuid)_: Identificador do tipo. Required: response.
   - _name (varchar) (unique)_: Nome do tipo (ex.: Nota Fiscal, Cheque). Required: create e response. Optional: update.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

6. **Conta a Receber (CR)**

   - _id (uuid) (pk) (default uuid)_: Identificador único do recebível. Required: response.
   - _value (decimal(15,2))_: Valor a ser recebido. Required: create e response. Optional: update.
   - _type (TipoCR) (fk)_: Define a forma de recebimento ou a origem (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CR tem um tipo dentre muitos (1:N). Required: create e response. Optional: update.
   - _customer (Parceiro) (fk)_: De quem se deve receber. Uma conta a receber possui um único cliente, dentre muitos (1:N). Required: create e response. Optional: update.
   - _due (Date)_: data de vencimento do direito. Required: create e response. Optional: update.
   - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Required: response. Optional: update.
   - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
   - _status enum(pendente, paga, cancelada) (default=pendente)_: Indica se está pago, pendente ou cancelado. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

7. **Tipo de Conta a Receber (TipoCR)**

   - _id (uuid) (pk) (default uuid)_: Identificador do tipo. Required: response.
   - _name (varchar) (unique)_: Nome do tipo. Required: create e response. Optional: update.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

8. **Parceiro**

   - _id (uuid) (pk) (default uuid)_: Identificador único do parceiro. Required: response.
   - _name (varchar(100)) (unique)_: Nome ou razão social. Required: create e response. Optional: update.
   - _type (enum: PF, PJ)_: Indica se o parceiro é pessoa física (PF) ou jurídica (PJ). Required: create e response. Optional.
   - _cod (varchar(20)) (unique)_: Código identificador para integrações ou referência interna. É o CPF ou CNPJ. Required: create e response. Optional: update.
   - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Required: response. Optional: update.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

9. **Transação (Atualizar o saldo de CF)**

   - _id (uuid) (pk) (default uuid)_: Identificador único da transação. Required: response.
   - _value (decimal(15,2))_: Valor da transação. Required: create e response. Optional: update.
   - _type (enum: E, S)_: Indica se a transação é uma entrada (E) ou uma saída (S). Required: create e response. Optional: update.
   - _cf (CF) (fk)_: Uma Conta Financeira pode ter muitas Transações (relação 1:N). Required: create e response. Optional: update.
   - _description (text) (nullable)_: Descrição detalhada da transação. Required: response. Optional: create e update.
   - _tdate (Datetime) (nullable)_: data em que foi transacionado. Required: response. Optional: create update.
   - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Update: optional.
   - _category (Categoria) (fk)_: Referência à categoria associada à transação. Possui uma única categoria, dentre muitas (1:N). Required: create e response. Optional: update.
   - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
   - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
   - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
   - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

10. **Categoria**
    - _id (uuid) (pk) (default uuid)_: Identificador único da categoria. Required: response.
    - _name (varchar(100)) (unique)_: Nome da categoria. Required: response.
    - _description (text) (nullable)_: Descrição adicional da categoria, se necessário. Required: response. Optional: create e update.
    - _user (Usuario) (fk)_: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - _status boolean (default=true)_: Indica se está ativo ou inativo. Optional: update. Required: response.
    - _obs (text) (nullable)_: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
    - _createdAt (DateTime) (default now)_: Data e hora em que o registro foi criado. Required: response.
    - _updatedAt (DateTime) (default now)_: Data e hora da última atualização do registro. Required: response.

## Stack Tecnológica

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
- [Nodemon](https://nodemon.io/): Facilita o desenvolvimento, reiniciando automaticamente o servidor sempre que há alterações no código.
- [Jest](https://jestjs.io/): Framework de testes para garantir a qualidade e a confiabilidade do código, essencial em aplicações críticas como esta.

## Expansões Futuras

A modularidade do sistema permite a inclusão de funcionalidades adicionais, como:

- Relatórios e Dashboards: Análises visuais do fluxo de caixa e gráficos que auxiliem na tomada de decisão;
- Alertas e Notificações: Lembretes para contas a pagar ou receber, evitando atrasos e multas;
- Controle de Acesso e Auditoria: Implementação de autenticação, autorização e logs para monitorar as atividades do sistema;
- Incluir forma de pagamento para qualificar de forma mais acurada as transações;

## Core das RNs

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

### Instruções

- Setar as variáveis de ambiente em `.env` (backend) e `.env.local` (frontend);

- No frontend:

```plaitext
VITE_API_URL=http://127.0.0.1:3000/
```

- No backend:

```plaintext
HOST=127.0.0.1
DB_HOST=127.0.0.1
POSTGRES_DATABASE=financas
POSTGRES_USER=postgres
DB_PORT=5432
POSTGRES_PASSWORD=sua senha
APP_PORT=3000
SUPER_CPF=senha do super usuário
SUPER_PWD=senha do super usuário
SECRET_KEY=secret key do JWT
EXPIRES_IN=tempo de expiração do token ("1d", por exemplo)
```

- criar a database `financas` no PostgreSQL;

- Instalar as dependências do backend e frontend:

```bash
cd ./backend
npm install
```

```bash
cd ./frontend
npm install
```

1.Tem que entrar em packages e gerar a build `npm i ; npm run build`;
2. entrar em backend e em frontend e em cada um `npm i ; npm i ../packages`
3. Iniciar dev: `npm run dev`;
4. Em ./frontend: `npm run dev`;
