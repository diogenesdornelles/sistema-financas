import * as dotenv from 'dotenv';
dotenv.config();

import App from './app.js';
import appRoutes from './appRoutes.js';
export default class Server {
  private app: App;
  constructor() {
    this.app = new App(appRoutes);
    this.app.listen();
  }
}

new Server();
