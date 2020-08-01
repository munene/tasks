import Hapi from 'hapi';
import { ICreateTaskRequest, ITaskByIdRequest, IUpdateTaskRequest } from "../../interfaces/api/taskInterfaces";
import { IRepository } from '../../interfaces/persistence/repository.interface';
import Boom from 'boom';
import { Task } from '../../../persistence/models/task.model';

export class TaskController {
  repository: IRepository;

  constructor(repository: IRepository) {
    this.repository = repository;
  }
  async createTask(request: ICreateTaskRequest, h: Hapi.ResponseToolkit) {
    const payload = request.payload;
    const taskToBeCreated: Task = {
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
      creation_date: new Date(),
    }

    try {
      const createdTask = await this.repository.createNewTask(taskToBeCreated);
      return createdTask;
    } catch (error) {
      return error;
    }
  }

  async getTaskById(request: ITaskByIdRequest, h: Hapi.ResponseToolkit) {
    try {
      const id = request.params.id;

      const task = await this.repository.getTask(id);
      return task;
    } catch (error) {
      return error;
    }
  }

  async getAllTasks(request: Hapi.RequestOrig, h: Hapi.ResponseToolkit) {
    try {
      const tasks = await this.repository.getAllTasks();
      return tasks;
    } catch (error) {
      return error;
    }
  }

  async updateTask(request: IUpdateTaskRequest, h: Hapi.ResponseToolkit) {
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

  async executeTask(request: ITaskByIdRequest, h: Hapi.ResponseToolkit) {
    try {
      const id = request.params.id;
      const task = await this.repository.getTask(id);
      const updatedTask = await this.repository.updateTask(id, { executed_on: new Date() });
      return updatedTask;
    } catch (error) {
      return error;
    }
  }

  async deleteTask(request: ITaskByIdRequest, h: Hapi.ResponseToolkit) {
    const taskId = request.params.id;
    try {
      const isSuccessful = await this.repository.deleteTask(taskId);
      return {
        message: 'Task deleted successfully',
      };

      // TODO: return Boom.badData('We could not delete the task');
    } catch (error) {
      return error;
    }
  }
}