require('dotenv').config();

const {
  PORT,
} = process.env;

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as BodyParser from 'koa-bodyparser';
import * as Cors from 'kcors';

import rootRouter from './router';
import database from './database';

const app = new Koa();
const router = new Router();

router.use('/api', rootRouter.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(Cors());
app.use(BodyParser());

database();

export default app.listen(PORT);
