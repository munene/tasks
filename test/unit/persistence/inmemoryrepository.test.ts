import {
  InMemoryRepository,
} from '../../../src/persistence/InMemoryRepository/repository';
import {Task} from '../../../src/persistence/models/task.model';

describe('The In Memory Repository', () => {
  let inMemoryRepository: InMemoryRepository;

  beforeEach(() => {
    inMemoryRepository = new InMemoryRepository();
  });

  it(`should add a new task to the list and return the created task.
      it `,
  async () => {
    const taskDetails: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const createdTask = await inMemoryRepository.createNewTask(taskDetails);

    // Make sure the returned task is what we expect
    expect(createdTask).toBeTruthy();
    expect(createdTask.title).toEqual(taskDetails.title);
    expect(createdTask.description).toEqual(taskDetails.description);
    expect(createdTask.due_date).toEqual(taskDetails.due_date);
    expect(createdTask.id).toBeTruthy();

    // Confirm that the task was saved
    const existingTask = await inMemoryRepository.getTask(createdTask.id!);
    expect(existingTask).toBe(createdTask);
  });

  it('should return a single task by id', async () => {
    const taskDetails: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const createdTask = await inMemoryRepository.createNewTask(taskDetails);
    const existingTask = await inMemoryRepository.getTask(createdTask.id!);
    expect(existingTask.id).toEqual(createdTask.id);
  });

  it('should return all tasks', async () => {
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
    const createdTask = await inMemoryRepository.createNewTask(taskDetails);
    const createdTask1 = await inMemoryRepository.createNewTask(taskDetails1);

    const allTasks = await inMemoryRepository.getAllTasks();
    expect(allTasks.length).toEqual(2);
    expect(allTasks[0]).toBe(createdTask);
    expect(allTasks[1]).toBe(createdTask1);
  });

  it('should update a task successfully', async () => {
    const taskDetails: Task = {
      title: 'Test task',
      description: 'This is a test task',
      due_date: new Date(),
    };
    const createdTask = await inMemoryRepository.createNewTask(taskDetails);
    const existingTask = await inMemoryRepository.getTask(createdTask.id!);

    const now = new Date();

    const updatedTask = await inMemoryRepository.updateTask(existingTask.id!, {
      executed_on: now,
      title: 'Changed Title',
      description: 'I changed this too',
    });

    expect(updatedTask.title).toEqual('Changed Title');
    expect(updatedTask.description).toEqual('I changed this too');
    expect(updatedTask.executed_on).toEqual(now);
  });

  it('should delete a task successfully', async () => {
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
    const createdTask = await inMemoryRepository.createNewTask(taskDetails);
    const createdTask1 = await inMemoryRepository.createNewTask(taskDetails1);

    const successfullyDeleted =
      await inMemoryRepository.deleteTask(createdTask.id!);

    expect(successfullyDeleted).toEqual(true);

    const remainingTasks = await inMemoryRepository.getAllTasks();
    expect(remainingTasks.length).toEqual(1);
    expect(remainingTasks[0]).toEqual(createdTask1);
  });
});
