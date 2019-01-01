import { Context } from 'koa';
import * as moment from 'moment';
import { workValidation } from '../lib/validation';
import * as repository from '../database/repository';

const { workHistoryValidation } = workValidation;

const getWorkHistoryByMonth = async (ctx: Context) => {
  try {
    interface RequestSchema {
      month: string;
    };

    const isValid = workHistoryValidation(ctx.params);
    if (isValid.error) {
      ctx.status = 400;
      ctx.body = {
        name: 'WRONG_SCHEMA',
        description: '요청 파라미터 에러',
      };
      return;
    }

    const { month }: RequestSchema = ctx.params;
    const nextMonth = moment(month).add(1, 'M').format('YYYY-MM');

    const workHistoryRepository = repository.workHistoryRepository();
    const workHistories = await workHistoryRepository.getWorkHistoryByMonth(month, nextMonth);

    const workHistoriesTime = [];

    workHistories.map((workHistory) => {
      const workDate = moment(workHistory.historyTime).format('YYYY-MM-DD');

      const findIndex = workHistoriesTime.findIndex((workHistoryTime) => workHistoryTime.workDate === workDate);

      // workHistoriesTime 배열에 데이터가 존재한다면
      if (findIndex !== -1) {
        // workHistoriesTime에 기록된 날짜중에 데이터가 있다면 카운터를 증가시킨다.
        workHistoriesTime[findIndex].workTime += 1;
        return;
      }

      // 요소를 찾지 못했다면 새롭게 배열을 추가한다.
      workHistoriesTime.push({ workDate, workTime: 0 });
    });

    ctx.status = 200;
    ctx.body = {
      status: 'SUCCESS',
      message: 'work history log 데이터 조회 성공',
      data: {
        workHistories: workHistoriesTime,
      },
    };
  } catch (error) {
    console.error('error message: ', error.message);
    ctx.status = 500;
    ctx.body = {
      status: 'SERVER_ERROR',
      message: '서버 에러',
    };
  }
};

export {
  getWorkHistoryByMonth,
};
