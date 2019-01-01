import * as Router from 'koa-router';
import { Context } from 'koa';
import workRouter from './workRouter';

const rootRouter: Router = new Router();

rootRouter.use('/work', workRouter.routes());
rootRouter.get('/test', (ctx: Context): void => {
  ctx.body = 'success';
});

export default rootRouter;
