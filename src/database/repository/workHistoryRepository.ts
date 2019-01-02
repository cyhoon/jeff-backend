import { Repository, getManager } from 'typeorm';
import { workHistoryEntity } from '../entity';

interface WorkHistoryRepositoryInterface extends Repository<workHistoryEntity> {
  getWorkHistoryByMonth?: (month: string, nextMonth: string) => Promise<workHistoryEntity[]>;
};

const workHistoryRepository = (): WorkHistoryRepositoryInterface => {
  const repository: WorkHistoryRepositoryInterface = getManager().getRepository(workHistoryEntity);

  repository.getWorkHistoryByMonth = async (month: string, nextMonth: string): Promise<workHistoryEntity[]> => {
    return repository.createQueryBuilder('workHistory')
      .where('workHistory.historyTime >= :month && workHistory.historyTime < :nextMonth')
      .setParameter('month', month)
      .setParameter('nextMonth', nextMonth)
      .getMany();
  };

  return repository;
};

export default workHistoryRepository;
