/* eslint-disable camelcase */

import {Model} from 'sequelize';

/**
 * The Task model implementation for Postgres
 * @class PostgresTask
 */
export class PostgresTask extends Model {
  id?: number;
  title!: string;
  description!: string;
  due_date!: Date;
  executed_on?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
