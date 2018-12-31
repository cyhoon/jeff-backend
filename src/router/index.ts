import * as Router from 'koa-router';
import { Context } from 'koa';

const rootRouter: Router = new Router();

rootRouter.get('/test', (ctx: Context): void => {
  ctx.body = 'success';
});

export default rootRouter;
