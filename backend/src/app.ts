import express, { Express } from "express";

import morgan from "morgan";

import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";

import { DataSource } from "typeorm";
import { AppDataSource } from "./config/typeorm.db.config.js";
import { runAllSeeds } from "./seeds/runAllSeeds.js";
import { RouteConfigType } from "./types/routeConfig.type.js";

dotenv.config();

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.HOST || "";

class App {
  public app: Express;

  public routesConfig: RouteConfigType[];

  public appDataSource: DataSource | null;

  constructor(routes: RouteConfigType[]) {
    this.app = express();
    this.routesConfig = routes;
    this.appDataSource = null;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  /**
   * Inicializa os middlewares da aplicação.
   */
  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(corsOptions));
    this.app.options("*", cors(corsOptions));
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
    this.app.use(morgan("dev"));
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
  private async initializeDBConn(): Promise<DataSource> {
    try {
      console.log("Inicializando conexão com o banco de dados...");
      const appDataSource = await AppDataSource.initialize();
      console.log("Conexão com o banco estabelecida");

      console.log("Executando migrations...");
      const executedMigrations = await appDataSource.runMigrations();

      if (executedMigrations.length > 0) {
        console.log(`${executedMigrations.length} migration(s) executada(s):`);
        executedMigrations.forEach((migration) => {
          console.log(`  - ${migration.name}`);
        });
      } else {
        console.log("Nenhuma migration pendente");
      }

      await this.verifyDatabaseStructure(appDataSource);

      console.log("Executando seeds...");
      await runAllSeeds();
      console.log("Seeds executados com sucesso");

      console.log("Inicialização do banco concluída!");
      return appDataSource;
    } catch (error) {
      console.error("Erro na inicialização do banco:", error);
      throw error;
    }
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
      console.warn("Não foi possível verificar estrutura:", error);
    }
  }

  /**
   * Inicia o servidor e escuta na porta especificada.
   */
  public async listen(): Promise<void> {
    this.appDataSource = await this.initializeDBConn();
    this.app.listen(PORT, () => {
      console.log(`Host: ${HOST}. Escutando na porta ${PORT}`);
    });
  }
}

export default App;
