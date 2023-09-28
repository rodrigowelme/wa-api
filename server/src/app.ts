import express, { Router } from 'express';
import cors from 'cors';
import { logger } from './shared';
import routes from './routes';
export default class {
  private port = 3000;
  private app: express.Application;

  constructor() {
    this.app = express();
    this.appCors();
    this.appListen();
    this.appRoutes();
  }

  appCors() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  appRoutes() {
    this.app.use('/', routes);
  }

  appListen() {
    this.app.listen(this.port, () => {
      logger.info(`Servidor iniciado na porta ${this.port}.`);
    });
  }
}
