import { Task } from "../../../persistence/models/task.model";

export interface IRepository {
  createNewTask(): Promise<Task>;
  getTask(id: number): Promise<Task>;
  getAllTasks(): Promise<Task[]>
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
}