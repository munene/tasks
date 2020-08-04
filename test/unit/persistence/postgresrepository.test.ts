import {
  TaskInterface,
} from
  '../../../src/application/interfaces/persistence/task.model.interface';
import {
  PostgresRepository,
} from '../../../src/persistence/PostgresRepository/repository';
// import {
//   getSequelize,
// } from '../../../src/persistence/PostgresRepository/config';
import {
  PostgresTask,
} from '../../../src/persistence/PostgresRepository/task.model';

require('dotenv').config();
process.env.NODE_ENV = 'test';

describe('The Postgres Repository', () => {
  let repository: PostgresRepository;

  beforeEach(async () => {
    repository = new PostgresRepository();
    await repository.connectDatabase();
  });

  afterEach(async () => {
    PostgresTask.destroy({
      truncate: true,
    });
  });

  // afterAll(async () => {
  //   const sequelize = getSequelize();
  //   await sequelize.close();
  // });

  it('should add a new task to the list and return the created task',
      async () => {
        const taskDetails: TaskInterface = {
          title: 'Test task',
          description: 'This is a test task',
          due_date: new Date(),
        };
        const createdTask = await repository.createNewTask(taskDetails);

        // Make sure the returned task is what we expect
        expect(createdTask).toBeTruthy();
        expect(createdTask.title).toEqual(taskDetails.title);
        expect(createdTask.description).toEqual(taskDetails.description);
        expect(createdTask.due_date).toEqual(taskDetails.due_date);
        expect(createdTask.id).toBeTruthy();
      });

  it('should return a single task by id', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const createdTask = await repository.createNewTask(taskDetails);
    const existingTask = await repository.getTask(createdTask.id!);
    expect(existingTask.id).toEqual(createdTask.id);
  });

  it('should return all tasks', async () => {
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
    const createdTask = await repository.createNewTask(taskDetails);
    const createdTask1 = await repository.createNewTask(taskDetails1);

    const allTasks = await repository.getTasks({
      itemCount: 10,
      page: 0,
    });
    console.log(allTasks);
    expect(allTasks.length).toEqual(2);
    expect(allTasks[0].title).toEqual(createdTask.title);
    expect(allTasks[1].title).toEqual(createdTask1.title);
    expect(allTasks[0].due_date).toEqual(createdTask.due_date);
    expect(allTasks[1].due_date).toEqual(createdTask1.due_date);
  });

  it('should update a task successfully', async () => {
    const taskDetails: TaskInterface = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const createdTask = await repository.createNewTask(taskDetails);
    const existingTask = await repository.getTask(createdTask.id!);

    const now = new Date();

    const updatedTask = await repository.updateTask(existingTask.id!, {
      executed_on: now,
      title: 'Changed Title',
      description: 'I changed this too',
    });

    expect(updatedTask.title).toEqual('Changed Title');
    expect(updatedTask.description).toEqual('I changed this too');
    expect(updatedTask.executed_on).toEqual(now);
  });

  it('should delete a task successfully', async () => {
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
    const createdTask = await repository.createNewTask(taskDetails);
    const createdTask1 = await repository.createNewTask(taskDetails1);

    const successfullyDeleted =
      await repository.deleteTask(createdTask.id!);

    expect(successfullyDeleted).toEqual(true);

    const remainingTasks = await repository.getTasks({
      itemCount: 10,
      page: 0,
    });
    expect(remainingTasks.length).toEqual(1);
    expect(remainingTasks[0].title).toEqual(createdTask1.title);
    expect(remainingTasks[0].due_date).toEqual(createdTask1.due_date);
  });
});
