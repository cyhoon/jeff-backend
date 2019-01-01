import * as Router from 'koa-router';
import { workController } from '../controller';

const workRouter: Router = new Router();

workRouter.get('/history/month/:month', workController.getWorkHistoryByMonth);

export default workRouter;
