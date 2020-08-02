import {RepositoryInterface} from '../../interfaces/persistence/repository.interface';
import * as TaskRoutes from '../../api/task/routes';
import { Server } from '@hapi/hapi';
/**
 * Register the API's routesz
 * @param  {Server} server: The already configured server
 * @param  {RepositoryInterface} repository: The reposirory that we will use
 */
export const registerRoutes = async (server: Server,
  repository: RepositoryInterface) => {
  // Register the task routes
  TaskRoutes.register(server, repository);
};
