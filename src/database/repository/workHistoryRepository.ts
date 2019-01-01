import { Repository, getManager } from 'typeorm';
import { workHistory } from '../entity';

interface WorkHistoryRepositoryInterface extends Repository<workHistory> {
  getWorkHistoryByMonth?: (month: string, nextMonth: string) => Promise<workHistory[]>;
};

const workHistoryRepository = (): WorkHistoryRepositoryInterface => {
  const repository: WorkHistoryRepositoryInterface = getManager().getRepository(workHistory);

  repository.getWorkHistoryByMonth = async (month: string, nextMonth: string): Promise<workHistory[]> => {
    return repository.createQueryBuilder('workHistory')
      .where('workHistory.historyTime >= :month && workHistory.historyTime < :nextMonth')
      .setParameter('month', month)
      .setParameter('nextMonth', nextMonth)
      .getMany();
  };

  return repository;
};

export default workHistoryRepository;
