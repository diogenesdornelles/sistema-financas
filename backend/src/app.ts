import express, { Express } from "express";
// Importing morgan for HTTP request logging
// @ts-ignore
import morgan from "morgan";
// Importing cors to handle Cross-Origin Resource Sharing (CORS)
// @ts-ignore
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";

// Importing Swagger UI for API documentation
// @ts-ignore
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import swaggerDocument from "./swagger.json";
import { RouteConfigType } from "./types/route-config.type";
import { AppDataSource } from "./config/typeorm.db.config";
import { DataSource } from "typeorm";
import { runAllSeeds } from "./seeds/runAllSeeds";

dotenv.config();

// CORS configuration options
const corsOptions: cors.CorsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

// Seta o endereço do servidor e a porta em que vai rodar a aplicação
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.HOST || "";

/**
 * Classe App.
 *
 * Encapsula a aplicação Express, configurando middlewares, rotas e conexão com o banco de dados.
 * Também fornece um método para iniciar o servidor.
 */
class App {
  // Instância da aplicação Express.
  public app: Express;
  // Configurações de rotas.
  public routesConfig: RouteConfigType[];
  // Conexão com o banco de dados.
  public appDataSource: DataSource | null;

  /**
   * Cria uma instância da classe App.
   * @param {RouteConfigType[]} routes - Configurações de rotas.
   */
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
   * Inicializa a conexão com o banco de dados e cria as tabelas, se necessário.
   */
  private async initilizeDBConn(): Promise<DataSource> {
    try {
      const appDataSource = await AppDataSource.initialize();
      console.log("Conexão com o banco inicializada");

      const pendingMigrations = await appDataSource.showMigrations();
      if (pendingMigrations) {
        console.log("Executando migrations pendentes...");
        await appDataSource.runMigrations();
        console.log("Migrations executadas com sucesso");
      } else {
        console.log("Nenhuma migration pendente");
      }
      await runAllSeeds();
      return appDataSource;
    } catch (error) {
      console.error("Erro na inicialização:", error);
      throw error;
    }
  }

  /**
   * Inicia o servidor e escuta na porta especificada.
   */
  public async listen(): Promise<void> {
    this.appDataSource = await this.initilizeDBConn();
    this.app.listen(PORT, () => {
      console.log(`Host: ${HOST}. Escutando na porta ${PORT}`);
    });
  }
}

export default App;
