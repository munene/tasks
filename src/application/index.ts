import {manifest, options} from './server';
import * as Hapi from 'hapi';
import {IRepository} from './interfaces/persistence/repository.interface';
import {registerRoutes} from './configurations/server/routes.config';
import {initializeRepository} from './configurations/server/repository.config';

require('dotenv').config();
const glue = require('@hapi/glue');

const startServer = async () => {
  try {
    const server: Hapi.Server = await glue.compose(manifest, options);

    // Initialize the database repository
    const repository: IRepository = await initializeRepository();

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
