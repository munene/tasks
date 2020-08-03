import {Task} from '../../../persistence/models/task.model';
import {GetTasksQuery} from '../api/taskInterfaces';

export interface RepositoryInterface {
  createNewTask(newTask: Partial<Task>): Promise<Task>;
  getTask(id: number): Promise<Task>;
  getTasks(query: GetTasksQuery): Promise<Task[]>
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
}
