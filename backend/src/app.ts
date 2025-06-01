import express from 'express';

import morgan from 'morgan';

import cors from 'cors';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';
import { AppDataSource } from './config/typeorm.db.config.js';
import { runAllSeeds } from './seeds/runAllSeeds.js';
import { RouteConfigType } from './types/routeConfig.type.js';

dotenv.config();

import swaggerDocument from '../swagger.json' with { type: 'json' };
import { sequelize } from './config/sequelize.db.config.js';
import { Sequelize } from 'sequelize';

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.HOST || '';

class App {
  public app: express.Application;

  public routesConfig: RouteConfigType[];

  public appDataSource: DataSource | null;
  public appSequelize: Sequelize | null;

  constructor(routes: RouteConfigType[]) {
    this.app = express();
    this.routesConfig = routes;
    this.appDataSource = null;
    this.appSequelize = null;
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
  }

  /**
   * Inicializa os middlewares da aplicação.
   */
  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(corsOptions));
    this.app.options('*', cors(corsOptions));
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
    this.app.use(morgan('dev'));
  }

  /**
   * Configura o Swagger UI
   */
  private initializeSwagger(): void {
    const swaggerOptions = {
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
      },
    };

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, swaggerOptions),
    );

    this.app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocument);
    });

    console.log(
      'Swagger UI disponível em: http://localhost:' + PORT + '/api-docs',
    );
  }

  /**
   * Configura as rotas definidas nas configurações.
   */
  private initializeRoutes(): void {
    this.routesConfig.forEach((config) => {
      this.app.use(config.basePath, config.baseRouter.router);
    });
  }

  /**
   * Inicializa a conexão com o banco de dados e executa migrations/seeds.
   */
  private async initializeDBConnections(): Promise<{
    typeormDataSource: DataSource | null;
    sequelizeInstance: Sequelize | null;
  }> {
    let typeormDataSource: DataSource | null = null;
    let sequelizeInstance: Sequelize | null = null;

    // Inicializar TypeORM com migrations e seeds
    try {
      console.log('Inicializando conexão com o banco de dados (TypeORM)...');
      typeormDataSource = await AppDataSource.initialize();
      console.log('Conexão com o banco (TypeORM) estabelecida.');

      console.log('Executando migrations (TypeORM)...');
      const executedMigrations = await typeormDataSource.runMigrations();
      if (executedMigrations.length > 0) {
        console.log(
          `${executedMigrations.length} migration(s) (TypeORM) executada(s):`,
        );
        executedMigrations.forEach((migration) =>
          console.log(`  - ${migration.name}`),
        );
      } else {
        console.log('Nenhuma migration (TypeORM) pendente.');
      }
      await this.verifyDatabaseStructure(typeormDataSource);
      console.log('Executando seeds (TypeORM)...');
      await runAllSeeds();
      console.log('Seeds (TypeORM) executados com sucesso.');
      console.log('Inicialização do banco (TypeORM) concluída!');
    } catch (error) {
      console.error('Erro na inicialização do banco (TypeORM):', error);
    }

    // Inicializar Sequelize
    try {
      console.log('Inicializando conexão com o banco de dados (Sequelize)...');
      await sequelize.authenticate();
      console.log('Conexão com o banco (Sequelize) estabelecida com sucesso.');
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('Modelos Sequelize sincronizados com { alter: true }.');
      } else {
        console.log(
          'Sincronização de modelos Sequelize desabilitada em produção (use migrações).',
        );
      }
      sequelizeInstance = sequelize;
      console.log('Inicialização do Sequelize concluída!');
    } catch (error) {
      console.error('Erro na inicialização do Sequelize:', error);
    }

    return { typeormDataSource, sequelizeInstance };
  }

  /**
   * Verifica se a estrutura básica do banco está correta
   */
  private async verifyDatabaseStructure(dataSource: DataSource): Promise<void> {
    try {
      const userCount = await dataSource.query(
        'SELECT COUNT(*) as count FROM "user"',
      );
      console.log(`Usuários cadastrados: ${userCount[0].count}`);

      const migrationsCount = await dataSource.query(
        'SELECT COUNT(*) as count FROM "migrations"',
      );
      console.log(`Migrations executadas: ${migrationsCount[0].count}`);
    } catch (error) {
      console.warn('Não foi possível verificar estrutura:', error);
    }
  }

  /**
   * Inicia o servidor e escuta na porta especificada.
   */
  public async listen(): Promise<void> {
    const { typeormDataSource, sequelizeInstance } =
      await this.initializeDBConnections();
    this.appDataSource = typeormDataSource;
    this.appSequelize = sequelizeInstance;

    if (!this.appSequelize && !this.appDataSource) {
      console.error(
        'FALHA CRÍTICA: Nenhuma conexão com banco de dados (TypeORM ou Sequelize) pôde ser estabelecida.',
      );
      process.exit(1);
    } else {
      if (!this.appSequelize)
        console.warn('Atenção: Conexão com Sequelize falhou.');
      if (!this.appDataSource)
        console.warn('Atenção: Conexão com TypeORM falhou.');
    }

    this.app.listen(PORT, () => {
      console.log(`Host: ${HOST}. Escutando na porta ${PORT}`);
    });
  }
}

export default App;
