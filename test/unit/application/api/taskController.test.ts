import {
  InMemoryRepository,
} from '../../../../src/persistence/InMemoryRepository/repository';
import {TaskController} from '../../../../src/application/api/task/controller';
import {
  CreateTaskRequestInterface,
  TaskByIdRequestInterface,
  UpdateTaskRequestInterface,
} from '../../../../src/application/interfaces/api/taskInterfaces';
import {Task} from '../../../../src/persistence/models/task.model';

describe('task controller', async () => {
  let repository: InMemoryRepository;
  let controller: TaskController;

  beforeEach(() => {
    repository = new InMemoryRepository();
    // server = await setUpServer();
    controller = new TaskController(repository);
  });

  it('creates new task and returns it back', async () => {
    const request: CreateTaskRequestInterface = {
      payload: {
        title: 'Test task',
        description: 'This is a test task',
        due_date: new Date(),
      },
      params: {},
      query: {},
    };

    const response = await controller.createTask(request);
    expect(response.title).toBeTruthy();
    expect(response.title).toEqual('Test task');
  });

  it('queries for a task by id and successfully get it', async () => {
    const taskToAdd: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const request: TaskByIdRequestInterface = {
      payload: {},
      params: {id: 1},
      query: {},
    };

    const response = await controller.getTaskById(request);
    expect(response.title).toBeTruthy();
    expect(response.title).toEqual('Test task');
  });

  it('queries for a task by id and returns a 404 not found error', async () => {
    const request: TaskByIdRequestInterface = {
      payload: {},
      params: {id: 1},
      query: {},
    };

    const response = await controller.getTaskById(request);
    expect(response.output.statusCode).toEqual(404);
    expect(response.message).toEqual('The task does not exist');
  });

  it('queries for all tasks', async () => {
    const taskDetails: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: Task = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);
    const response = await controller.getAllTasks();
    expect(response.length).toEqual(2);
  });

  it('successfully updates an activity', async () => {
    const taskToAdd: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const now = new Date();

    const request: UpdateTaskRequestInterface = {
      payload: {
        description: 'New description',
        executed_on: now,
      },
      params: {id: 1},
      query: {},
    };

    await controller.updateTask(request);
    const updatedTask = await repository.getTask(1);
    expect(updatedTask.description).toEqual('New description');
    expect(updatedTask.executed_on).toEqual(now);
  });

  it('returns a 404 when trying to update a task that does not exist',
      async () => {
        const request: UpdateTaskRequestInterface = {
          payload: {
            description: 'New description',
            executed_on: new Date(),
          },
          params: {id: 1},
          query: {},
        };

        const response = await controller.updateTask(request);
        expect(response.output.statusCode).toEqual(404);
        expect(response.message).toEqual('The task does not exist');
      });

  it('marks a task as executed', async () => {
    const taskToAdd: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const request: TaskByIdRequestInterface = {
      payload: {},
      params: {id: 1},
      query: {},
    };

    const response = await controller.executeTask(request);
    expect(response.executed_on).toBeTruthy();
  });

  it('returns a 404 when trying to execute a task that does not exist',
      async () => {
        const request: TaskByIdRequestInterface = {
          payload: {},
          params: {id: 1},
          query: {},
        };

        const response = await controller.executeTask(request);
        expect(response.output.statusCode).toEqual(404);
        expect(response.message).toEqual('The task does not exist');
      });

  it('deletes a task successfully', async () => {
    const taskToAdd: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const request: TaskByIdRequestInterface = {
      payload: {},
      params: {id: 1},
      query: {},
    };

    const response = await controller.deleteTask(request);
    expect(response.message).toEqual('Task deleted successfully');
  });

  it('returns a 404 when you try to delete a non-existent task', async () => {
    const request: TaskByIdRequestInterface = {
      payload: {},
      params: {id: 1},
      query: {},
    };

    const response = await controller.deleteTask(request);
    expect(response.output.statusCode).toEqual(404);
    expect(response.message).toEqual('The task does not exist');
  });
});
