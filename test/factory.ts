import {compose} from '@hapi/glue';
import {manifest, options} from '../src/application/server';
import {
  registerRoutes,
} from '../src/application/configurations/server/routes.config';
import {
  InMemoryRepository,
} from '../src/persistence/InMemoryRepository/repository';

export const setUpServer = async () => {
  const server = await compose(manifest, options);

  // Initialize the database repository
  const repository = new InMemoryRepository();

  // Register the API routes
  await registerRoutes(server, repository);
  return server;
};
