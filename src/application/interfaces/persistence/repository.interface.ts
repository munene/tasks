import {GetTasksQuery} from '../api/taskInterfaces';
import {TaskInterface} from './task.model.interface';

export interface RepositoryInterface {
  createNewTask(newTask: Partial<TaskInterface>): Promise<TaskInterface>;
  getTask(id: number): Promise<TaskInterface>;
  getTasks(query: GetTasksQuery): Promise<TaskInterface[]>
  updateTask(id: number, dataToUpdate: Partial<TaskInterface>)
    : Promise<TaskInterface>;
  deleteTask(id: number): Promise<boolean>;
}
