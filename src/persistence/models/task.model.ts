/* eslint-disable camelcase */

/**
 * A class representing a task
 * @class  Task
 */
export class Task {
  id?: number;
  title: string;
  description: string;
  due_date: Date;
  executed_on?: Date;
  creation_date?: Date;
}
