import {RepositoryInterface} from '../../interfaces/persistence/repository.interface';
import {
  InMemoryRepository,
} from '../../../persistence/InMemoryRepository/repository';

/**
 * Initialize and return the repository to be used.
 * Call this when starting the server
 * @return {Promise<RepositoryInterface>}: The actual repository that we
 * will inject everywhere else
 */
export const initializeRepository = async (): Promise<RepositoryInterface> => {
  return new Promise((resolve) => {
    const repository = new InMemoryRepository();
    resolve(repository);
  });
};
