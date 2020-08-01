import {
  IRepository,
} from '../../application/interfaces/persistence/repository.interface';
import {Task} from '../models/task.model';

/**
 * The implementation of the im memory repository
 * @class InMemoryRepository
 */
export class InMemoryRepository implements IRepository {
  tasks: Task[];
  latestId: number = 0;

  /**
   * Initiate the in memory repository
   * with an empty tasks list
   */
  constructor() {
    this.tasks = [];
  };

  /**
   * Create and save the task in the tasks array
   * @param  {Partial<Task>} newTask: The task details to be created
   * @return {Promise<Task>} The created task
   */
  createNewTask(newTask: Partial<Task>): Promise<Task> {
    return new Promise((resolve) => {
      const task: Task = {
        id: ++this.latestId,
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due_date,
        creation_date: new Date(),
      };
      this.tasks.push(task);
      resolve(task);
    });
  }

  /**
   * Query and return the task array for one task by it's id
   * @param  {number} id: The id of the requested task
   * @return {Promise<Task>} The requested task
   */
  getTask(id: number): Promise<Task> {
    return new Promise((resolve) => {
      const existingTask = this.tasks.find((task) => task.id === id);
      resolve(existingTask);
    });
  }

  /**
   * Returns the entire tasks array
   * @return {Promise<Task[]>} The entire tasks array
   */
  getAllTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      resolve(this.tasks);
    });
  }

  /**
   * Update a task with the specified id, with the specified data
   * @param  {number} id: The id of the task to update
   * @param  {Partial<Task>} dataToUpdate: The data to update
   * @return {Promise<Task>} The updated task
   */
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task> {
    return new Promise((resolve) => {
      const existingTask = this.tasks.find((task) => task.id === id);

      /* Iterate through the data's properties,
         each of which is a key value tuple with two objects,
         index 0 being the key and index 1 being the value
      */
      for (const property of Object.entries(dataToUpdate)) {
        const key = property[0];
        const value = property[1];
        existingTask[key] = value;
      }
      resolve(existingTask);
    });
  }

  /**
   * Delete the task with the specified id
   * @param  {number} id
   * @return {Promise<boolean>} Whether or not the task was successfully deleted
   */
  deleteTask(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.tasks = this.tasks.filter((task) => task.id === id);
      resolve(true);
    });
  }
}
