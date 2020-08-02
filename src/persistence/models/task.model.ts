/* eslint-disable camelcase */

/**
 * A type representing a task
 * @type Task
 */
export type Task = {
  id?: number,
  title: string,
  description: string,
  due_date: Date,
  executed_on?: Date,
  creation_date?: Date,
}
