import {TaskController} from './controller';
import {
  RepositoryInterface,
} from '../../interfaces/persistence/repository.interface';
import {
  createTaskValidator,
  requestByIdValidator,
  updateTaskValidator,
} from './validation';
import {Server} from '@hapi/hapi';

export const register = (server: Server, repository: RepositoryInterface) => {
  const taskController = new TaskController(repository);

  server.route({
    method: 'GET',
    path: '/task/{id}',
    options: {
      handler: taskController.getTaskById,
      description: 'Get task by id',
      validate: {
        params: requestByIdValidator,
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/task/all',
    options: {
      handler: taskController.getAllTasks,
      description: 'Get all tasks',
    },
  });

  server.route({
    method: 'POST',
    path: '/task',
    options: {
      handler: taskController.createTask,
      description: 'Create task',
      validate: {
        payload: createTaskValidator,
      },
    },
  });

  server.route({
    method: 'PUT',
    path: '/task/{id}',
    options: {
      handler: taskController.updateTask,
      description: 'Update task',
      validate: {
        payload: updateTaskValidator,
        params: requestByIdValidator,
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/task/{id}/execute',
    options: {
      handler: taskController.executeTask,
      description: 'Mark a task as executed',
      validate: {
        params: requestByIdValidator,
      },
    },
  });

  server.route({
    method: 'DELETE',
    path: '/task/{id}',
    options: {
      handler: taskController.deleteTask,
      description: 'Delete task',
      validate: {
        params: requestByIdValidator,
      },
    },
  });
};
