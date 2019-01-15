import * as Router from 'koa-router';
import { workController } from '../controller';

const workRouter: Router = new Router();

workRouter.post('/history', workController.saveWorkHistory);
workRouter.get('/history/month/:month', workController.getWorkHistoryByMonth);
workRouter.get('/history/month/:month/:day', workController.getWorkHistoryByDay);

export default workRouter;
