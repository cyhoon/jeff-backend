import { Repository, getManager } from 'typeorm';
import { workHistoryEntity } from '../entity';

interface WorkHistoryRepositoryInterface extends Repository<workHistoryEntity> {
  getWorkHistoryByMonth?: (month: string, nextMonth: string) => Promise<workHistoryEntity[]>;
  getWorkHistoryByDay?: (day: string, nextDay: string) => Promise<workHistoryEntity[]>;
};

const workHistoryRepository = (): WorkHistoryRepositoryInterface => {
  const repository: WorkHistoryRepositoryInterface = getManager().getRepository(workHistoryEntity);

  repository.getWorkHistoryByMonth = async (month: string, nextMonth: string): Promise<workHistoryEntity[]> => {
    return repository.createQueryBuilder('workHistory')
      .where('workHistory.historyTime >= :month && workHistory.historyTime < :nextMonth && workHistory.workType = :workType')
      .setParameter('month', month)
      .setParameter('nextMonth', nextMonth)
      .setParameter('workType', 'ING')
      .getMany();
  };

  repository.getWorkHistoryByDay = async (day: string, nextDay: string): Promise<workHistoryEntity[]> => {
    return repository.createQueryBuilder('workHistory')
      .where('workHistory.historyTime >= :day && workHistory.historyTime < :nextDay')
      .setParameter('day', day)
      .setParameter('nextDay', nextDay)
      .getMany();
  };

  return repository;
};

export default workHistoryRepository;
