import {
  CreateTaskRequestInterface,
  TaskByIdRequestInterface,
  UpdateTaskRequestInterface,
  GetTasksRequestInterface,
} from '../../interfaces/api/taskInterfaces';
import {
  RepositoryInterface,
} from '../../interfaces/persistence/repository.interface';
import {
  TaskInterface,
} from '../../interfaces/persistence/task.model.interface';

let _repository: RepositoryInterface;

/**
 * The list of TaskInterface related methods to be
 * exposed by the API
 * @class TaskController
 */
export class TaskController {
  /**
   * Initialize the TaskInterface controller
   * @param  {RepositoryInterface} repository: The repository to be used
   */
  constructor(repository: RepositoryInterface) {
    _repository = repository;
  }

  /**
   * Creates a TaskInterface in the specified repository
   * @param  {ICreateTaskRequest} request: Request with
   * TaskInterface payload data
   * @return {Boom | TaskInterface} A server error or the TaskInterface created
   */
  async createTask(request: CreateTaskRequestInterface) {
    const payload = request.payload;
    const taskToBeCreated: TaskInterface = {
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
    };

    try {
      const createdTask = await _repository.createNewTask(taskToBeCreated);
      return createdTask;
    } catch (error) {
      return error;
    }
  }

  /**
   * Gets the data of the TaskInterface id requested from the repository
   * @param  {ITaskByIdRequest} request: Request with an id param
   * @return {Boom | TaskInterface}A server error or the TaskInterface requested
   */
  async getTaskById(request: TaskByIdRequestInterface) {
    try {
      const id = request.params.id;

      const TaskInterface = await _repository.getTask(id);
      return TaskInterface;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Get all the tasks from the repository
   * @param  {GetTasksRequestInterface} request: Request potentially with
   * filter queries
   * @return {Boom | TaskInterface[]} A server error or the list of tasks
   */
  async getTasks(request: GetTasksRequestInterface) {
    try {
      const tasks = await _repository.getTasks(request.query);
      return tasks;
    } catch (error) {
      return error;
    }
  }

  /**
   * Update a TaskInterface
   * @param  {IUpdateTaskRequest} request: Request with the TaskInterface id
   * and the data to update
   * @return {Boom | TaskInterface} a server error or the updated TaskInterface
   */
  async updateTask(request: UpdateTaskRequestInterface) {
    const payload = request.payload;
    const taskId = request.params.id;
    try {
      const TaskInterface = await _repository.updateTask(taskId, payload);
      return TaskInterface;
    } catch (error) {
      return error;
    }
  }

  /**
   * Mark a TaskInterface as executed in the repository
   * @param  {ITaskByIdRequest} request: Request with the TaskInterface id
   * @return {Boom | TaskInterface} a server error or the executed TaskInterface
   */
  async executeTask(request: TaskByIdRequestInterface) {
    try {
      const id = request.params.id;
      const updatedTask = await _repository.updateTask(id, {
        executed_on: new Date(),
      });
      return updatedTask;
    } catch (error) {
      return error;
    }
  }

  /**
   * Delete a TaskInterface from the repository
   * @param  {ITaskByIdRequest} request: Request with the TaskInterface id
   * @return {Boom | TaskInterface} a server error or the deleted TaskInterface
   */
  async deleteTask(request: TaskByIdRequestInterface) {
    const taskId = request.params.id;
    try {
      await _repository.deleteTask(taskId);
      return {
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
