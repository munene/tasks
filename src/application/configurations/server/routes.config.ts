import * as Hapi from 'hapi';
import { IRepository } from '../../interfaces/persistence/repository.interface';
import * as TaskRoutes from '../../api/task/routes';
/**
 * Register the API's routesz
 * @param  {Hapi.Server} server: The already configured server
 * @param  {IRepository} repository: The reposirory that we will use
 */
export const registerRoutes = async (server: Hapi.Server, repository: IRepository) => {
  // Register the task routes
  TaskRoutes.register(server, repository);
}
