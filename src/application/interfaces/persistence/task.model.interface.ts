/* eslint-disable camelcase */
export interface TaskInterface {
  id?: number,
  title: string,
  description: string,
  due_date: Date,
  executed_on?: Date,
  creation_date?: Date,
}
