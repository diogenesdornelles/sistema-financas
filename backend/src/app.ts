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
import { AppDataSource } from "./config/db";
import { seedSuperUser } from "./config/seedSuperUser";
import { DataSource } from "typeorm";

dotenv.config();

// CORS configuration options
const corsOptions: cors.CorsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

// Set server port and host using environment variables or default values.
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.HOST || "";

/**
 * App class encapsulates the Express application.
 * It configures middlewares, routes, and provides a method to start the server.
 */
class App {
  // The Express application instance.
  public app: Express;
  // Array of route configurations.
  public routesConfig: RouteConfigType[];

  public appDataSource: DataSource | null

  /**
   * Creates an instance of App.
   * @param {RouteConfigType[]} routes - Array of route configurations.
   */
  constructor(routes: RouteConfigType[]) {
    this.app = express();
    this.routesConfig = routes;
    this.appDataSource = null
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  /**
   * Initializes all middlewares used by the application.
   */
  private initializeMiddlewares(): void {
    // Middleware to parse incoming JSON requests.
    this.app.use(express.json());
    // Middleware to parse URL-encoded data.
    this.app.use(express.urlencoded({ extended: true }));
    // Enable CORS with the defined options.
    this.app.use(cors(corsOptions));
    // Handle pre-flight CORS requests.
    this.app.options("*", cors(corsOptions));
    // Secure the app by setting various HTTP headers using Helmet.
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
    // Use Morgan to log HTTP requests in a developer-friendly format.
    this.app.use(morgan("dev"));
    // Setup API documentation route.
    // Accessible via: https://localhost:3000/api-docs/ or http://localhost:3000/api-docs/
    // this.app.use("api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  /**
   * Initializes all routes defined in the route configuration.
   */
  private initializeRoutes(): void {
    this.routesConfig.forEach((config) => {
      this.app.use(config.basePath, config.baseRouter.router);
    });
  }

  private async initilizeDBConn(): Promise<DataSource> {
    const appDataSource = AppDataSource.initialize()
      appDataSource.then(async () => {
        console.log("Initilizing database conn...");
        await seedSuperUser();
      })
      .catch((error) => console.log(error));
    return appDataSource
  }

  /**
   * Starts the server and listens on the specified port using the given protocol.
   *
   * The server listens on the port specified by the `PORT` constant and logs the host and port information.
   */
  public async listen(): Promise<void> {
    this.appDataSource = await this.initilizeDBConn()
    this.app.listen(PORT, () => {
      console.log(`Host: ${HOST}. Listening on port ${PORT}`);
    });
  }
}

export default App;
