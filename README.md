# sistema-financas

O sistema terá como objetivo gerenciar o fluxo de caixa, permitindo registrar entradas e saídas, controlar contas financeiras, gerenciar obrigações (contas a pagar) e recebíveis (contas a receber) e relacionar essas movimentações com os parceiros (fornecedores e clientes) e suas categorias correspondentes.

O foco inicial é oferecer operações CRUD (criação, leitura, atualização e exclusão) para cada entidade, com possibilidade de expandir funcionalidades.

## Entidades e Modelagem

1. **Usuário**
   - *id (uuid) (pk)*: Identificador único do usuário.
   - *nome (varchar(30))*: Nome.
   - *sobrenome (varchar(60))*: Sobrenome.
   - *cpf (varchar(11))*: Armazena o CPF; é importante aplicar validações e formatação adequadas.
   - *senha (varchar(128))*: Senha do usuário, que deve ser armazenada de forma criptografada.
   - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
   - *status boolean*: Indica se está ativo ou inativo.
   - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

2. **Conta Financeiras (CF)**
    - *id (uuid) (pk)*: Identificador único da conta.
    - *saldo (decimal(10,2))*: Valor atual da conta, com precisão para operações financeiras.
    - *tipo (TipoCF) (fk)*: Indica o tipo de conta (ex.: conta corrente, poupança, cartão de crédito, cartão de débito, etc). Uma CF tem um tipo dentre muitos (1:N).
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *status boolean*: Indica se está ativo ou inativo.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

3. **Tipo de Conta Financeira (TipoCF)**
    - *id (uuid) (pk)*: Identificador único do tipo de conta.
    - *nome (varchar)*: Nome do tipo (ex.: Conta Corrente, Poupança).
    - *status boolean*: Indica se está ativo ou inativo.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

4. **Conta a Pagar (CP)**
    - *id (uuid) (pk)*: Identificador único da obrigação.
    - *valor (decimal(10,2))*: Valor da conta a pagar.
    - *tipo (TipoCP) (fk)*: Define a forma de pagamento ou a origem da obrigação (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CP tem um tipo dentre muitos (1:N).
    - *fornecedor (Parceiro)*: A quem é devido o título. Uma conta a pagar possui um único fornecedor, dentre muitos (1:N).
    - *vencimento (Date)*: data de vencimento da obrigação.
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *status enum(pendente, paga, cancelada)*: Indica se está pago, pendente ou cancelado.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

5. **Tipo de Conta a Pagar (TipoCP)**
    - *id (uuid) (pk)*: Identificador do tipo.
    - *nome (varchar)*: Nome do tipo (ex.: Nota Fiscal, Cheque).
    - *status boolean*: Indica se está ativo ou inativo.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

6. **Conta a Receber (CR)**
    - *id (uuid) (pk)*: Identificador único do recebível.
    - *valor (decimal(10,2))*: Valor a ser recebido.
    - *tipo (TipoCR) (fk)*: Define a forma de recebimento ou a origem (ex.: Nota Promissória, Cheque, Nota Fiscal). Uma CR tem um tipo dentre muitos (1:N).
    - *cliente (Parceiro) (fk)*: De quem se deve receber. Uma conta a receber possui um único cliente, dentre muitos (1:N).
    - *vencimento (Date)*: data de vencimento do direito.
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *status enum(pendente, paga, cancelada)*: Indica se está pago, pendente ou cancelado.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

7. **Tipo de Conta a Receber (TipoCR)**
    - *id (uuid) (pk)*: Identificador do tipo.
    - *nome (varchar)*: Nome do tipo.
    - *status boolean*: Indica se está ativo ou inativo.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

8. **Parceiro**
    - *id (uuid) (pk)*: Identificador único do parceiro.
    - *nome (varchar(100))*: Nome ou razão social.
    - *tipo (enum: PF, PJ)*: Indica se o parceiro é pessoa física (PF) ou jurídica (PJ).
    - *codigo (varchar(20))*: Código identificador para integrações ou referência interna. É o CPF ou CNPJ.
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *status boolean*: Indica se está ativo ou inativo.
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

9. **Transação (Atualizar o saldo de CF)**
    - *id (uuid) (pk)*: Identificador único da transação.
    - *valor (decimal(10,2))*: Valor da transação.
    - *tipo (enum: E, S)*: Indica se a transação é uma entrada (E) ou uma saída (S).
    - *contaFinanceira (CF) (fk)*: Uma Conta Financeira pode ter muitas Transações (relação 1:N).
    - *descricao (text)*: Descrição detalhada da transação.
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *categoria (Categoria) (fk)*: Referência à categoria associada à transação. Possui uma única categoria, dentre muitas (1:N).
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *status boolean*: Indica se está ativo ou inativo.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

10. **Categoria**
    - *id (uuid) (pk)*: Identificador único da categoria.
    - *nome (varchar(100))*: Nome da categoria.
    - *descricao (text)*: Descrição adicional da categoria, se necessário.
    - *usuario (Usuario) (fk)*: Tem um único usuário, dentre muitos (1:N).
    - *status boolean*: Indica se está ativo ou inativo.
    - *observacoes (text)*: Campo opcional para anotações ou comentários.
    - *criadoEm (DateTime)*: Data e hora em que o registro foi criado.
    - *atualizadoEm (DateTime)*: Data e hora da última atualização do registro.

## Stack Tecnológica

### Frontend

- [Vite com React e TypeScript](https://vite.dev/guide/): Garante performance e uma experiência de desenvolvimento moderna e escalável.

- [Formik e Yup](https://formik.org/docs/guides/validation): Facilita a criação e validação dos formulários, melhorando a experiência do usuário e a integridade dos dados.

- Estilização: A escolha entre CSS Modules, [Bootstrap](https://getbootstrap.com/) ou [Tailwind](https://tailwindcss.com/) oferece flexibilidade e rapidez na implementação de interfaces.

- [Zustand](https://zustand-demo.pmnd.rs/): Ótima opção para gerenciamento de estado de forma leve e simples.

- [Axios](https://axios-http.com/docs/intro): Facilita a comunicação com a API, garantindo uma integração robusta entre front e back.

- Biblioteca de visualização de dados temporais: Importante para a criação de dashboards e relatórios que auxiliem na análise do fluxo de caixa.

### Backend

- [NodeJS com Express e TypeScript](https://nodejs.org/en): Proporciona um ambiente robusto, seguro e de fácil manutenção.

- ORM ([TypeORM](https://typeorm.io/) ou [Prisma](https://www.prisma.io/)): Auxilia na modelagem e interação com o PostgreSQL, tornando as operações CRUD mais eficientes e seguras.

- [PostgreSQL](https://www.postgresql.org/): Excelente escolha para um banco de dados relacional robusto, adequado para operações financeiras.

- [Zod](https://zod.dev/): Garante a validação dos dados no backend, protegendo o sistema contra inconsistências e entradas maliciosas.

## Expansões Futuras

A modularidade do sistema permite a inclusão de funcionalidades adicionais, como:

- Relatórios e Dashboards: Análises visuais do fluxo de caixa e gráficos que auxiliem na tomada de decisão.

- Alertas e Notificações: Lembretes para contas a pagar ou receber, evitando atrasos e multas.

- Controle de Acesso e Auditoria: Implementação de autenticação, autorização e logs para monitorar as atividades do sistema.
