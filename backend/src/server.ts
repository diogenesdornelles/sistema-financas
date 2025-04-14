/**
 * @file src/index.ts
 * @description Main entry point for the Express application.
 * It sets up middlewares, routes, and starts the server (HTTP or HTTPS).
 */

// src/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import appRoutes from "./app-routes";
import App from "./app";

/**
 * Receives route settings and makes the app listen, by default https.
 *
 * @export
 * @class Server
 */
export default class Server {
  private app: App;
  /**
   * Creates an instance of Server.
   * @memberof Server
   */
  constructor() {
    this.app = new App(appRoutes);
    this.app.listen();
  }
}

new Server();
