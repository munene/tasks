import { IRepository } from "../../application/interfaces/persistence/repository.interface";
import { Task } from "../models/task.model";

export class InMemoryRepository implements IRepository {
  createNewTask(): Promise<Task> {
    throw new Error("Method not implemented.");
  }
  getTask(id: number): Promise<Task> {
    throw new Error("Method not implemented.");
  }
  getAllTasks(): Promise<Task[]> {
    throw new Error("Method not implemented.");
  }
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task> {
    throw new Error("Method not implemented.");
  }
  deleteTask(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
