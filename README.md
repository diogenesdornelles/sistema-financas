# sistema-financas

O sistema terá como objetivo gerenciar o fluxo de caixa, permitindo registrar entradas e saídas, controlar contas financeiras, gerenciar obrigações (contas a pagar) e recebíveis (contas a receber) e relacionar essas movimentações com os parceiros (fornecedores e clientes) e suas categorias correspondentes.

O foco inicial é oferecer operações CRUD (criação, leitura, atualização e exclusão) para cada entidade, com possibilidade de expandir funcionalidades.

## Entidades e Modelagem

1. **Usuário**
   - *id (uuid) (pk) (default uuid)*: Identificador único do usuário. Required: response.
   - *name (varchar(30))*: Nome. Required: create e response. Optional: update.
   - *surname (varchar(60))*: Sobrenome. Required: create e response. Optional: update.
   - *cpf (varchar(11)) (unique)*: Armazena o CPF com validações. Required: create e response, Optional: update.
   - *pwd (varchar(128))*: Senha do usuário, que deve ser armazenada de forma criptografada. Required: create. Optional: update. Response: não.
   - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
   - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
   - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

2. **Conta Financeiras (CF)**
    - *id (uuid) (pk) (default uuid)*: Identificador único da conta. Required: response.
    - *number (varchar(10))*: Identificador da conta na instituição bancária. Required: response create. Optional: update.
    - *ag (nullable) (varchar(10))*: Agência bancária. Required: response. Optional: update e create.
    - *bank varchar(30) (nullable)*: Banco. Required: response. Optional: update e create.
    - *initialBalance (decimal(15,2)) (default 0.0)*: Valor inicial da conta, com precisão para operações financeiras. Optional: create e update. Required: response.
    - *currentBalance (decimal(15,2)) (default 0.0)*: Valor atual da conta, com precisão para operações financeiras. Optional: create e update. Required: response.
    - *type (TipoCF) (fk)*: Indica o tipo de conta (ex.: conta corrente, poupança, cartão de crédito, cartão de débito, etc). Uma CF tem um tipo dentre muitos (1:N). Required: response e create. Optional: update.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
    - *status enum(pendente, paga, cancelada) (default=pendente)*:: Indica se está pendente, paga ou cancelada. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

3. **Tipo de Conta Financeira (TipoCF)**
    - *id (uuid) (pk) (default uuid)*: Identificador único do tipo de conta. Required: response.
    - *name (varchar) (unique)*: Nome do tipo (ex.: Conta Corrente, Poupança). Required: create e response. Optional: update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

4. **Conta a Pagar (CP)**
    - *id (uuid) (pk) (default uuid)*: Identificador único da obrigação. Required: response.
    - *value (decimal(15,2))*: Valor da conta a pagar. Required: create e response. Optional: update.
    - *type (TipoCP) (fk)*: Define a forma de pagamento ou a origem da obrigação (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CP tem um tipo dentre muitos (1:N). Required: create e response. Optional: update.
    - *supplier (Parceiro) (fk)*: A quem é devido o título. Uma conta a pagar possui um único fornecedor, dentre muitos (1:N). Required: create e response. Optional: update.
    - *due (Date)*: data de vencimento da obrigação. Required: create e response. Optional: update.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Optional: create e update. Required: response.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - *status enum(pendente, paga, cancelada) (default=pendente)*: Indica se está pago, pendente ou cancelado. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

5. **Tipo de Conta a Pagar (TipoCP)**
    - *id (uuid) (pk) (default uuid)*: Identificador do tipo. Required: response.
    - *name (varchar) (unique)*: Nome do tipo (ex.: Nota Fiscal, Cheque). Required: create e response. Optional: update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

6. **Conta a Receber (CR)**
    - *id (uuid) (pk) (default uuid)*: Identificador único do recebível. Required: response.
    - *value (decimal(15,2))*: Valor a ser recebido. Required: create e response. Optional: update.
    - *type (TipoCR) (fk)*: Define a forma de recebimento ou a origem (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CR tem um tipo dentre muitos (1:N). Required: create e response. Optional: update.
    - *customer (Parceiro) (fk)*: De quem se deve receber. Uma conta a receber possui um único cliente, dentre muitos (1:N). Required: create e response. Optional: update.
    - *due (Date)*: data de vencimento do direito. Required: create e response. Optional: update.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Required: response. Optional: update.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - *status enum(pendente, paga, cancelada) (default=pendente)*: Indica se está pago, pendente ou cancelado. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

7. **Tipo de Conta a Receber (TipoCR)**
    - *id (uuid) (pk) (default uuid)*: Identificador do tipo. Required: response.
    - *name (varchar) (unique)*: Nome do tipo. Required: create e response. Optional: update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

8. **Parceiro**
    - *id (uuid) (pk) (default uuid)*: Identificador único do parceiro. Required: response.
    - *name (varchar(100)) (unique)*: Nome ou razão social. Required: create e response. Optional: update.
    - *type (enum: PF, PJ)*: Indica se o parceiro é pessoa física (PF) ou jurídica (PJ). Required: create e response. Optional.
    - *cod (varchar(20)) (unique)*: Código identificador para integrações ou referência interna. É o CPF ou CNPJ. Required: create e response. Optional: update.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Required: response. Optional: update.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

9. **Transação (Atualizar o saldo de CF)**
    - *id (uuid) (pk) (default uuid)*: Identificador único da transação. Required: response.
    - *value (decimal(15,2))*: Valor da transação. Required: create e response. Optional: update.
    - *type (enum: E, S)*: Indica se a transação é uma entrada (E) ou uma saída (S). Required: create e response. Optional: update.
    - *cf (CF) (fk)*: Uma Conta Financeira pode ter muitas Transações (relação 1:N). Required: create e response. Optional: update.
    - *description (text) (nullable)*: Descrição detalhada da transação. Required: response. Optional: create e update.
    - *tdate (Datetime) (nullable)*: data em que foi transacionado. Required: response. Optional: create update.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Update: optional.
    - *category (Categoria) (fk)*: Referência à categoria associada à transação. Possui uma única categoria, dentre muitas (1:N). Required: create e response. Optional: update.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

10. **Categoria**
    - *id (uuid) (pk) (default uuid)*: Identificador único da categoria. Required: response.
    - *name (varchar(100)) (unique)*: Nome da categoria. Required: response.
    - *description (text) (nullable)*: Descrição adicional da categoria, se necessário. Required: response. Optional: create e update.
    - *user (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N). Required: create e response. Optional: update.
    - *status boolean (default=true)*: Indica se está ativo ou inativo. Optional: update. Required: response.
    - *obs (text) (nullable)*: Campo opcional para anotações ou comentários. Required: response. Optional: create e update.
    - *createdAt (DateTime) (default now)*: Data e hora em que o registro foi criado. Required: response.
    - *updatedAt (DateTime) (default now)*: Data e hora da última atualização do registro. Required: response.

## Stack Tecnológica

### Frontend

- [Vite com React e TypeScript](https://vite.dev/guide/): Garante performance e uma experiência de desenvolvimento moderna e escalável.

- [React Hook Forms(RHF)](https://react-hook-form.com/) integrado ao [Zod](https://zod.dev/): Facilita a criação e validação dos formulários, melhorando a experiência do usuário e a integridade dos dados.

- Estilização: A escolha é Material UI [MUI](https://mui.com/), pois oferece flexibilidade e rapidez na implementação de interfaces voltadas a aplicações empresariais.

- [Zustand](https://zustand-demo.pmnd.rs/): Gerenciamento de estado de forma leve e simples.

- [Axios](https://axios-http.com/docs/intro): Facilita a comunicação com a API, garantindo uma integração robusta entre front e back.

- [Tanstack Query ou React Query](https://tanstack.com/query/latest): Um poderoso meio de tratar requisições e o estado de aplicações React.

- Biblioteca de visualização de dados temporais, como [React-chart-2](https://react-chartjs-2.js.org/): Importante para a criação de dashboards e relatórios que auxiliem na análise do fluxo de caixa.

### Backend

- [NodeJS com Express e TypeScript](https://nodejs.org/en): Proporciona um ambiente robusto, seguro e de fácil manutenção.

- ORM [TypeORM](https://typeorm.io/): Auxilia na modelagem e interação com o PostgreSQL, tornando as operações CRUD mais eficientes e seguras.

- [PostgreSQL](https://www.postgresql.org/): Excelente escolha para um banco de dados relacional robusto, adequado para operações financeiras.

- [Zod](https://zod.dev/): Garante a validação dos dados no backend, protegendo o sistema contra inconsistências e entradas maliciosas.

### Gestão de ambiente (monorepo)

- [TurboRepo](https://turbo.build/): Utilizado para buildar o sistema

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

1) Rodar db postgres, em ./backend, `sudo docker-compose up -d --build`;
2) Iniciar dev: `npm run dev`;
3) Em ./frontend: `npm run dev`;
4) Remover container `sudo docker compose -f docker-compose.yml down --remove-orphans`
5) 
