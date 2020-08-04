import {Sequelize} from 'sequelize';
let sequelize: Sequelize;

export const getSequelize = () => {
  // TODO: proper configs
  let dbName: string;
  let username: string;
  let password: string;
  let host: string;

  if (process.env.NODE_ENV === 'test') {
    // @ts-ignore
    dbName = process.env.CI_DB_NAME;
    // @ts-ignore
    username = process.env.CI_DB_USERNAME;
    // @ts-ignore
    password = process.env.CI_DB_PASSWORD;
    // @ts-ignore
    host = process.env.CI_DB_HOST;
  } else {
    // @ts-ignore
    dbName = process.env.DB_NAME;
    // @ts-ignore
    username = process.env.DB_USERNAME;
    // @ts-ignore
    password = process.env.DB_PASSWORD;
    // @ts-ignore
    host = process.env.DB_HOST;
  }

  if (!sequelize) {
    sequelize = new Sequelize(dbName, username, password, {
      host: host,
      dialect: 'postgres',
      logging: false,
    });
  }

  return sequelize;
};
