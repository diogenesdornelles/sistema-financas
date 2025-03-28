# sistema-financas

O sistema terá como objetivo gerenciar o fluxo de caixa, permitindo registrar entradas e saídas, controlar contas financeiras, gerenciar obrigações (contas a pagar) e recebíveis (contas a receber) e relacionar essas movimentações com os parceiros (fornecedores e clientes) e suas categorias correspondentes. 

O foco inicial é oferecer operações CRUD (criação, leitura, atualização e exclusão) para cada entidade, com possibilidade de expandir funcionalidades.

## Entidades e Modelagem

- Contas Financeiras: Permitir diferentes tipos (conta corrente, poupança, cartões, etc.), controle de saldo e histórico de movimentações.

- Contas a Pagar e a Receber: Registro detalhado com informações de tipo, valor e vencimento, possibilitando alertas e acompanhamento de obrigações e direitos.

- Fornecedores e Clientes: Associação por CPF/CNPJ para facilitar a gestão dos parceiros comerciais.

- Transações: Registro de entradas e saídas com data, valor, descrição e categorização, permitindo análises futuras.

- Categorias: Essenciais para a caracterização das transações e para a geração de relatórios gerenciais.

## Stack Tecnológica

### Frontend:

- [Vite com React e TypeScript](https://vite.dev/guide/): Garante performance e uma experiência de desenvolvimento moderna e escalável.

- [Formik e Yup](https://formik.org/docs/guides/validation): Facilita a criação e validação dos formulários, melhorando a experiência do usuário e a integridade dos dados.

- Estilização: A escolha entre CSS Modules, [Bootstrap](https://getbootstrap.com/) ou [Tailwind](https://tailwindcss.com/) oferece flexibilidade e rapidez na implementação de interfaces.

- [Zustand](https://zustand-demo.pmnd.rs/): Ótima opção para gerenciamento de estado de forma leve e simples.

- [Axios](https://axios-http.com/docs/intro): Facilita a comunicação com a API, garantindo uma integração robusta entre front e back.

- Biblioteca de visualização de dados temporais: Importante para a criação de dashboards e relatórios que auxiliem na análise do fluxo de caixa.

### Backend:

- [NodeJS com Express e TypeScript](https://nodejs.org/en): Proporciona um ambiente robusto, seguro e de fácil manutenção.

- ORM ([TypeORM](https://typeorm.io/) ou [Prisma](https://www.prisma.io/)): Auxilia na modelagem e interação com o PostgreSQL, tornando as operações CRUD mais eficientes e seguras.

- [PostgreSQL](https://www.postgresql.org/): Excelente escolha para um banco de dados relacional robusto, adequado para operações financeiras.

- [Zod](https://zod.dev/): Garante a validação dos dados no backend, protegendo o sistema contra inconsistências e entradas maliciosas.

## Expansões Futuras

A modularidade do sistema permite a inclusão de funcionalidades adicionais, como:

- Relatórios e Dashboards: Análises visuais do fluxo de caixa e gráficos que auxiliem na tomada de decisão.

- Alertas e Notificações: Lembretes para contas a pagar ou receber, evitando atrasos e multas.

- Controle de Acesso e Auditoria: Implementação de autenticação, autorização e logs para monitorar as atividades do sistema.

