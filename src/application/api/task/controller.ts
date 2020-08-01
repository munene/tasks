import {
  ICreateTaskRequest,
  ITaskByIdRequest,
  IUpdateTaskRequest,
} from '../../interfaces/api/taskInterfaces';
import {IRepository} from '../../interfaces/persistence/repository.interface';
import {Task} from '../../../persistence/models/task.model';

/**
 * The list of task related methods to be
 * exposed by the API
 * @class TaskController
 */
export class TaskController {
  repository: IRepository;

  /**
   * Initialize the task controller
   * @param  {IRepository} repository: The repository to be used
   */
  constructor(repository: IRepository) {
    this.repository = repository;
  }

  /**
   * Creates a task in the specified repository
   * @param  {ICreateTaskRequest} request: Request with Task payload data
   * @return {Boom | Task} A server error or the task created
   */
  async createTask(request: ICreateTaskRequest) {
    const payload = request.payload;
    const taskToBeCreated: Task = {
      title: payload.title,
      description: payload.description,
      due_date: payload.dueDate,
    };

    try {
      const createdTask = await this.repository.createNewTask(taskToBeCreated);
      return createdTask;
    } catch (error) {
      return error;
    }
  }

  /**
   * Gets the data of the task id requested from the repository
   * @param  {ITaskByIdRequest} request: Request with an id param
   * @return {Boom | Task} A server error or the task requested
   */
  async getTaskById(request: ITaskByIdRequest) {
    try {
      const id = request.params.id;

      const task = await this.repository.getTask(id);
      return task;
    } catch (error) {
      return error;
    }
  }

  /**
   * Get all the tasks from the repository
   * @return {Boom | Task[]} A server error or the list of tasks
   */
  async getAllTasks() {
    try {
      const tasks = await this.repository.getAllTasks();
      return tasks;
    } catch (error) {
      return error;
    }
  }

  /**
   * Update a task
   * @param  {IUpdateTaskRequest} request: Request with the task id
   * and the data to update
   * @return {Boom | Task} a server error or the updated task
   */
  async updateTask(request: IUpdateTaskRequest) {
    const payload = request.payload;
    const taskId = request.params.id;
    try {
      const task = await this.repository.updateTask(taskId, payload);
      return task;
    } catch (error) {
      return error;
      // return Boom.internal(error.message);
    }
  }

  /**
   * Mark a task as executed in the repository
   * @param  {ITaskByIdRequest} request: Request with the task id
   * @return {Boom | Task} a server error or the executed task
   */
  async executeTask(request: ITaskByIdRequest) {
    try {
      const id = request.params.id;
      const updatedTask = await this.repository.updateTask(id, {
        executed_on: new Date(),
      });
      return updatedTask;
    } catch (error) {
      return error;
    }
  }

  /**
   * Delete a task from the repository
   * @param  {ITaskByIdRequest} request: Request with the task id
   * @return {Boom | Task} a server error or the deleted task
   */
  async deleteTask(request: ITaskByIdRequest) {
    const taskId = request.params.id;
    try {
      await this.repository.deleteTask(taskId);
      return {
        message: 'Task deleted successfully',
      };

      // TODO: return Boom.badData('We could not delete the task');
    } catch (error) {
      return error;
    }
  }
}
