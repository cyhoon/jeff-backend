import { Context } from 'koa';
import * as moment from 'moment';
import { workValidation } from '../lib/validation';
import * as repository from '../database/repository';
import { workHistoryEntity } from '../database/entity';

const {
  workHistoryByMonthValidation,
  workHistoryByDayValidation,
  workHistoryValidation,
} = workValidation;

const getWorkHistoryByMonth = async (ctx: Context) => {
  try {
    interface RequestSchema {
      month: string;
    };

    const isValid = workHistoryByMonthValidation(ctx.params);
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
      workHistoriesTime.push({ workDate, workTime: 1 });
    });

    ctx.status = 200;
    ctx.body = {
      name: 'SUCCESS',
      message: 'work history log 데이터 조회 성공',
      data: {
        workHistories: workHistoriesTime,
      },
    };
  } catch (error) {
    console.error('error message: ', error.message);
    ctx.status = 500;
    ctx.body = {
      name: 'SERVER_ERROR',
      message: '서버 에러',
    };
  }
};

const getWorkHistoryByDay = async (ctx: Context) => {
  try {
    interface RequestSchema {
      month: string;
      day: string;
    };

    const isValid = workHistoryByDayValidation(ctx.params);
    if (isValid.error) {
      ctx.status = 400;
      ctx.body = {
        name: 'WRONG_SCHEMA',
        description: '요청 파라미터 에러',
      };
      return;
    }

    const { month, day }: RequestSchema = ctx.params;

    const nowDay = moment(`${month}-${day}`).format('YYYY-MM-DD');
    const nextDay = moment(`${month}-${day}`).add(1, 'd').format('YYYY-MM-DD');

    const workHistoryRepository = repository.workHistoryRepository();
    const workHistories = await workHistoryRepository.getWorkHistoryByDay(nowDay, nextDay);

    const workDetailHistories = [];

    for(let i=0; i<=23; i++) {
      const targetHour = moment().set({ hour: i }).format('HH');

      const isWork = workHistories.filter(workHistory => {
        const hour = moment(workHistory.historyTime).add(-1, 'hour').format('HH');
        if (targetHour === hour) {
          return workHistory;
        }
      });

      if (isWork.length >= 1 && isWork[0].workType === 'ING') {
        workDetailHistories.push({ time: targetHour, isWork: true });
      } else {
        workDetailHistories.push({ time: targetHour, isWork: false }); 
      }
    }

    const allWorkTime = workHistories.filter((workHistory) => workHistory.workType === 'ING').length;

    ctx.status = 200;
    ctx.body = {
      name: 'SUCCESS',
      message: 'work history detail log 데이터 조회 성공',
      data: {
        // workHistories,
        allWorkTime,
        workDetailHistories,
      },
    };
  } catch (error) {
    console.log('Server error: ', error.message);
    ctx.status = 500;
    ctx.body = {
      name: 'SERVER_ERROR',
      message: '서버 에러',
    };
  }
};

const saveWorkHistory = async (ctx: Context) => {
  try {
    interface RequestSchema {
      workType: string;
    };
    
    const isValid = workHistoryValidation(ctx.request.body);
    if (isValid.error) {
      ctx.status = 400;
      ctx.body = {
        name: 'WRONG_SCHEMA',
        description: '요청 파라미터 에러',
      };
      return;
    }

    const { workType }: RequestSchema = ctx.request.body;

    const workHistoryRepository = repository.workHistoryRepository();

    const workHistory = new workHistoryEntity();

    workHistory.userId = 'jeffchoi';
    workHistory.workType = workType;
  
    await workHistoryRepository.save(workHistory);

    ctx.status = 200;
    ctx.body = {
      name: 'SUCCESS',
      message: '성공',
    }
  } catch (error) {
    console.error('error message: ', error.message);
    ctx.status = 500;
    ctx.body = {
      name: 'SERVER_ERROR',
      message: '서버 에러',
    };
  }
};

export {
  getWorkHistoryByMonth,
  getWorkHistoryByDay,
  saveWorkHistory,
};
