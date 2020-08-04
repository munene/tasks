/* eslint-disable camelcase */

import {
  TaskInterface,
} from '../../application/interfaces/persistence/task.model.interface';

/**
 * A class representing a task
 * @class Task
 */
export class InMemoryTask implements TaskInterface {
  id?: number;
  title!: string;
  description!: string;
  due_date!: Date;
  executed_on?: Date;
  creation_date?: Date;
}
