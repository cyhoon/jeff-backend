const {
  PORT,
} = process.env;

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import * as Cors from 'kcors';
import Logger from './lib/logger';
import * as KoaLogger from 'koa-pino-logger';

import rootRouter from './router';
import database from './database';

class Server {
  app:Koa = null;
  router:Router = null;

  constructor() {
    this.app = new Koa();
    this.router = new Router();

    this.setMiddleware();
    this.setRoutes();
  }

  setMiddleware(): void {
    this.app.use(Cors());
    this.app.use(BodyParser());
    this.app.use(KoaLogger({ prettyPrint: true }));
  }

  setRoutes(): void {
    this.router.use('/api', rootRouter.routes());
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async connectDatabase(): Promise<void> {
    try {
      Logger.info('Try connect database');
      await database();
      Logger.info('Success connection database');
    } catch (error) {
      Logger.error('Fail connection database');
      Logger.error(`Error Message: ${error.message}`);
      throw new Error(error);
    }
  }

  listen(): void {
    this.app.listen(PORT);
    Logger.info(`Jeff-Backend application is up and running on port ${PORT}`);
  }

  async start(): Promise<void> {
    await this.connectDatabase();
    this.listen();
  }
}

export default Server;
