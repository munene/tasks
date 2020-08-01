import { manifest, options } from "./interfaces/server";
import * as Hapi from 'hapi';
import { registerRoutes, initDatabase } from './lib/initializeServices';
import { IRepository } from "./interfaces/persistence/repository.interface";

require('dotenv').config();
const glue = require('glue');

const startServer = async () => {
  try {
    const server: Hapi.Server = await glue.compose(manifest, options);

    // Register routes
    const repository: IRepository = 
    await registerRoutes(server);

    await server.start();

    // try {
    //   await sequelize.authenticate();
    //   await initDatabase();
    // } catch (dbErr) {
    //   console.error(`Unable to connect to the database ${dbErr}`);
    //   process.exit(1);
    // }

    console.log(`Hapi server running at ${server.info.uri}`);
  } catch (err) {
    console.error(`Server could not start \n ${err}`);
    process.exit(1);
  }
};