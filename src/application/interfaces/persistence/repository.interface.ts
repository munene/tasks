import {Task} from '../../../persistence/models/task.model';

export interface RepositoryInterface {
  createNewTask(newTask: Partial<Task>): Promise<Task>;
  getTask(id: number): Promise<Task>;
  getAllTasks(): Promise<Task[]>
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
}
