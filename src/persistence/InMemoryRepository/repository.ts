import {
  RepositoryInterface,
} from '../../application/interfaces/persistence/repository.interface';
import {notFound} from 'boom';
import {GetTasksQuery} from '../../application/interfaces/api/taskInterfaces';
import {InMemoryTask} from './task.model';

/**
 * The implementation of the im memory repository
 * @class InMemoryRepository
 */
export class InMemoryRepository implements RepositoryInterface {
  tasks: InMemoryTask[];
  latestId: number;

  /**
   * Initiate the in memory repository
   * with an empty tasks list
   */
  constructor() {
    this.tasks = [];
    this.latestId = 0;
  }

  /**
   * Create and save the task in the tasks array
   * @param  {Partial<InMemoryTask>} newTask: The task details to be created
   * @return {Promise<InMemoryTask>} The created task
   */
  createNewTask(newTask: InMemoryTask): Promise<InMemoryTask> {
    return new Promise((resolve) => {
      const task: InMemoryTask = {
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
   * Query the task array for one task by it's id
   * @param  {number} id: The id of the requested task
   * @return {Promise<InMemoryTask>} The requested task
   */
  getTask(id: number): Promise<InMemoryTask> {
    return new Promise((resolve, reject) => {
      const existingTask = this.tasks.find((task) => task.id === id);
      if (!existingTask) {
        reject(notFound('The task does not exist'));
      }
      resolve(existingTask);
    });
  }

  /**
   * Returns a list of tasks
   * @param  {GetTasksQuery} query: the query to filter tasks by
   * @return {Promise<InMemoryTask[]>} The entire tasks array
   */
  getTasks(query: GetTasksQuery): Promise<InMemoryTask[]> {
    return new Promise((resolve) => {
      // The list of automatic filters
      const autoFilters = this.generateAutoFilters(query);

      // Apply automatic filter
      let tasks = this.tasks.filter((task) => {
        for (const filter of Object.entries(autoFilters)) {
          // @ts-ignore
          if (task[filter[0]] !== filter[1]) {
            return false;
          }
        }
        return true;
      });

      // Will only run if query.expired is defined
      tasks = this.queryByExpired(tasks, query);

      // Will only run if query.executed is defined
      tasks = this.queryByExecuted(tasks, query);

      // Implement page count and page number
      tasks = this.paginate(query.page!, query.itemCount!, tasks);
      resolve(tasks);
    });
  }

  /**
   * Update a task with the specified id, with the specified data
   * @param  {number} id: The id of the task to update
   * @param  {Partial<InMemoryTask>} dataToUpdate: The data to update
   * @return {Promise<InMemoryTask>} The updated task
   */
  updateTask(id: number, dataToUpdate: Partial<InMemoryTask>)
  : Promise<InMemoryTask> {
    return new Promise((resolve, reject) => {
      let existingTask = this.tasks.find((task) => task.id === id);

      if (!existingTask) {
        reject(notFound('The task does not exist'));
      }

      /* Iterate through the data's properties,
         each of which is a key value tuple with two objects,
         index 0 being the key and index 1 being the value
      */
      existingTask = Object.assign(existingTask, dataToUpdate);
      resolve(existingTask);
    });
  }

  /**
   * Delete the task with the specified id
   * @param  {number} id
   * @return {Promise<boolean>} Whether or not the task was successfully deleted
   */
  deleteTask(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const existingTask = this.tasks.find((task) => task.id === id);

      if (!existingTask) {
        reject(notFound('The task does not exist'));
      }

      this.tasks = this.tasks.filter((task) => task.id !== id);
      resolve(true);
    });
  }

  /**
   * This function takes a list of tasks and returns
   * only the page of tasks required
   * @param  {number} page the page number to paginate to
   * @param  {number} taskCount the number of tasks to return
   * @param  {Array<InMemoryTask>} tasks the tasks to paginate
   * @return {Array<InMemoryTask>} the appropriate page of tasks only
   */
  private paginate(page: number, taskCount: number, tasks: Array<InMemoryTask>)
  : Array<InMemoryTask> {
    const indexToStartFrom = page * taskCount;
    const indexToEndAt = indexToStartFrom + taskCount;
    tasks = tasks.slice(indexToStartFrom, indexToEndAt);
    return tasks;
  }

  /**
   * This method filters the tasks by their execution status
   * Will only run if query.executed is defined
   * @param  {InMemoryTask[]} tasks
   * @param  {GetTasksQuery} query
   * @return {Array<InMemoryTask>} tfinal filtered list of tasks
   */
  private queryByExecuted(tasks: Array<InMemoryTask>, query: GetTasksQuery)
  : Array<InMemoryTask> {
    if (query.executed === undefined) {
      return tasks;
    }

    tasks = tasks.filter((task) => {
      return query.executed ? task.executed_on : !task.executed_on;
    });

    return tasks;
  }

  /**
   * This method filters the tasks by their expiry status
   * Will only run if query.expired is defined
   * @param  {InMemoryTask[]} tasks
   * @param  {GetTasksQuery} query
   * @return {Array<InMemoryTask>} tfinal filtered list of tasks
   */
  private queryByExpired(tasks: Array<InMemoryTask>, query: GetTasksQuery)
  : Array<InMemoryTask> {
    if (query.expired === undefined) {
      return tasks;
    }

    const now = new Date();

    tasks = tasks.filter((task) => {
      return query.expired ? task.due_date < now : task.due_date >= now;
    });
    return tasks;
  }

  /**
   * This method generates a list of automatic filters
     nonAutoFilterProps are those where have to apply a special filter on it.
     The idea is that you'd have a long list of default
     "automatic props", where the filter would be basically the same,
     and a bunch of non-automatic props where the filter implementations
     would be different for each
   * @param  {GetTasksQuery} query
     @return {GetTasksQuery} the automatic props
   */
  private generateAutoFilters(query: GetTasksQuery): GetTasksQuery {
    // The list of automatic filters
    const autoFilters: GetTasksQuery = {};

    // The ones to leave out of the automatic filters
    const nonAutoFilterProps = ['page', 'itemCount', 'executed', 'expired'];

    // Generate all automatic filters from the query
    for (const queryProperty of Object.entries(query)) {
      /*
        queryProperty is a tuple where index 0 = the propery name
        and index 1 is the value of the property
      */
      const propertyName = queryProperty[0];
      if (!nonAutoFilterProps.includes(propertyName)) {
        // @ts-ignore
        autoFilters[propertyName] = queryProperty[1];
      }
    }

    return autoFilters;
  }
}
