import {
  InMemoryRepository,
} from '../../../../src/persistence/InMemoryRepository/repository';
import {Server} from '@hapi/hapi';
import {setUpServer} from '../../../factory';
import {
  TaskInterface,
} from
  '../../../../src/application/interfaces/persistence/task.model.interface';

describe('API Routes', () => {
  let repository: InMemoryRepository;
  let server: Server;

  beforeEach(async () => {
    repository = new InMemoryRepository();
    server = await setUpServer(repository);
  });

  it('/task (POST) creates a task successfully', async () => {
    const request = {
      method: 'POST',
      url: `/task`,
      payload: {
        title: 'Test task',
        description: 'This is a test task',
        due_date: new Date().toISOString(),
      },
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.id).toEqual(1);
    // @ts-ignore
    expect(response.result.title).toEqual('Test task');
    // @ts-ignore
    expect(response.result.description).toEqual('This is a test task');
  });

  it('/task/{id} (GET) queries for a task by id and successfully get it',
      async () => {
        const taskToAdd: TaskInterface = {
          title: 'Test task',
          description: 'This is a test task',
          due_date: new Date(),
        };

        const createdTask =await repository.createNewTask(taskToAdd);

        const request = {
          method: 'GET',
          url: `/task/${createdTask.id}`,
        };

        const response = await server.inject(request);

        expect(response.statusCode).toEqual(200);
        // @ts-ignore
        expect(response.result.id).toEqual(1);
        // @ts-ignore
        expect(response.result.title).toEqual('Test task');
        // @ts-ignore
        expect(response.result.description).toEqual('This is a test task');
      });

  it(`/task/{id} (GET) queries for a task by id
      and returns a 404 not found error`,
  async () => {
    const request = {
      method: 'GET',
      url: `/task/1`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(404);
    // @ts-ignore
    expect(response.result.message).toEqual('The task does not exist');
  });

  it('/task (GET) queries for all tasks', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);

    const request = {
      method: 'GET',
      url: `/task`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(2);
  });

  it('/task (GET) queries for all tasks by title', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);

    const request = {
      method: 'GET',
      url: `/task?title=Test%20task`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(1);
  });

  it('/task (GET) queries for all tasks by description', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);

    const request = {
      method: 'GET',
      url: `/task?description=This%20is%20a%20test%20task`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(1);
  });

  it('/task (GET) queries for all tasks by executed', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);
    await repository.updateTask(1, {executed_on: new Date()});

    const request = {
      method: 'GET',
      url: `/task?executed=true`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(1);
  });

  it('/task (GET) queries for all tasks by not executed', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: new Date(),
    };
    const taskDetails2: TaskInterface = {
      title: 'Test task 3',
      description: 'This is a third test task',
      due_date: new Date(),
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);
    await repository.createNewTask(taskDetails2);
    await repository.updateTask(1, {executed_on: new Date()});

    const request = {
      method: 'GET',
      url: `/task?executed=false`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(2);
  });

  it('/task (GET) queries for all tasks by expired', async () => {
    const yesterday = new Date();
    const tomorrow = new Date();

    // currently yesterday = now. set date one day into the future
    yesterday.setDate(yesterday.getDate() - 1);
    // currently tomorrow = now. set date one day into the future
    tomorrow.setDate(tomorrow.getDate() + 1);

    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: yesterday,
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: tomorrow,
    };
    const taskDetails2: TaskInterface = {
      title: 'Test task 3',
      description: 'This is a third test task',
      due_date: tomorrow,
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);
    await repository.createNewTask(taskDetails2);

    const request = {
      method: 'GET',
      url: `/task?expired=true`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(1);
  });

  it('/task (GET) queries for all tasks by not expired', async () => {
    const yesterday = new Date();
    const tomorrow = new Date();

    // currently yesterday = now. set date one day into the future
    yesterday.setDate(yesterday.getDate() - 1);
    // currently tomorrow = now. set date one day into the future
    tomorrow.setDate(tomorrow.getDate() + 1);

    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: yesterday,
    };
    const taskDetails1: TaskInterface = {
      title: 'Test task 2',
      description: 'This is a second test task',
      due_date: tomorrow,
    };
    const taskDetails2: TaskInterface = {
      title: 'Test task 3',
      description: 'This is a third test task',
      due_date: tomorrow,
    };
    await repository.createNewTask(taskDetails);
    await repository.createNewTask(taskDetails1);
    await repository.createNewTask(taskDetails2);

    const request = {
      method: 'GET',
      url: `/task?expired=false`,
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.length).toEqual(2);
  });

  it('/task (PUT) successfully updates an activity', async () => {
    const taskToAdd: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    const updatedTask = await repository.createNewTask(taskToAdd);

    const request = {
      method: 'PUT',
      url: `/task/${updatedTask.id}`,
      payload: {
        description: 'New description',
      },
    };

    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.description).toEqual('New description');
  });

  it('returns a 404 when trying to update a task that does not exist',
      async () => {
        const request = {
          method: 'PUT',
          url: `/task/1`,
          payload: {
            description: 'New description',
          },
        };
        const response = await server.inject(request);

        expect(response.statusCode).toEqual(404);
        // @ts-ignore
        expect(response.result.message).toEqual('The task does not exist');
      });

  it('marks a task as executed', async () => {
    const taskToAdd: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const request = {
      method: 'POST',
      url: `/task/1/execute`,
    };
    const response = await server.inject(request);

    expect(response.statusCode).toEqual(200);
    // @ts-ignore
    expect(response.result.executed_on).toBeTruthy();
  });

  it('returns a 404 when trying to execute a task that does not exist',
      async () => {
        const request = {
          method: 'POST',
          url: `/task/1/execute`,
        };
        const response = await server.inject(request);

        expect(response.statusCode).toEqual(404);
        // @ts-ignore
        expect(response.result.message).toEqual('The task does not exist');
      });

  it('deletes a task successfully', async () => {
    const taskToAdd: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };

    await repository.createNewTask(taskToAdd);

    const request = {
      method: 'DELETE',
      url: `/task/1`,
    };
    const response = await server.inject(request);

    // @ts-ignore
    expect(response.result.message)
        .toEqual('TaskInterface deleted successfully');
  });

  it('returns a 404 when you try to delete a non-existent task', async () => {
    const request = {
      method: 'DELETE',
      url: `/task/1`,
    };
    const response = await server.inject(request);

    expect(response.statusCode).toEqual(404);

    // @ts-ignore
    expect(response.result.message).toEqual('The task does not exist');
  });
});
