import {compose} from '@hapi/glue';
import {manifest, options} from '../src/application/server';
import {
  registerRoutes,
} from '../src/application/configurations/server/routes.config';
import {
  RepositoryInterface,
} from '../src/application/interfaces/persistence/repository.interface';

export const setUpServer = async (repository: RepositoryInterface) => {
  const server = await compose(manifest, options);

  // Register the API routes
  await registerRoutes(server, repository);
  return server;
};
