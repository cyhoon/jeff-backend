const {
  PORT,
} = process.env;

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import * as Cors from 'kcors';

import rootRouter from './router';
import database from './database';

class Server {
  app:Koa = null;
  router:Router = null;

  constructor() {
    this.app = new Koa();
    this.router = new Router();

    this.setRoutes();
    this.setMiddleware();
  }

  setRoutes(): void {
    this.router.use('/api', rootRouter.routes());
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  setMiddleware(): void {
    this.app.use(Cors());
    this.app.use(BodyParser());
  }

  async connectDatabase(): Promise<void> {
    try {
      console.info('Try connect database');
      await database();
      console.info('Success connection database');
    } catch (error) {
      console.error('Fail connection database');
      console.error(`Error Message: ${error.message}`);
      throw new Error(error);
    }
  }

  listen(): void {
    this.app.listen(PORT);

    console.info(`Jeff-Backend application is up and running on port ${PORT}`);
  }

  async start(): Promise<void> {
    await this.connectDatabase();
    this.listen();
  }
}

export default Server;
