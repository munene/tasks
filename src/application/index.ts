import {manifest, options} from './server';
import {
  RepositoryInterface,
} from './interfaces/persistence/repository.interface';
import {registerRoutes} from './configurations/server/routes.config';
import {initializeRepository} from './configurations/server/repository.config';
import {compose} from '@hapi/glue';

require('dotenv').config();

const startServer = async () => {
  try {
    const server = await compose(manifest, options);

    // Initialize the database repository
    const repository: RepositoryInterface = await initializeRepository();

    // Register the API routes
    await registerRoutes(server, repository);

    await server.start();

    console.log(`Hapi server running at ${server.info.uri}`);
  } catch (err) {
    console.error(`Server could not start \n ${err}`);
    process.exit(1);
  }
};

startServer();
