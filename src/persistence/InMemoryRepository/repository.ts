import {
  RepositoryInterface,
} from '../../application/interfaces/persistence/repository.interface';
import {Task} from '../models/task.model';
import {notFound} from 'boom';
import {GetTasksQuery} from '../../application/interfaces/api/taskInterfaces';

/**
 * The implementation of the im memory repository
 * @class InMemoryRepository
 */
export class InMemoryRepository implements RepositoryInterface {
  tasks: Task[];
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
   * @param  {Partial<Task>} newTask: The task details to be created
   * @return {Promise<Task>} The created task
   */
  createNewTask(newTask: Task): Promise<Task> {
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
    return new Promise((resolve, reject) => {
      const existingTask = this.tasks.find((task) => task.id === id);
      if (!existingTask) {
        reject(notFound('The task does not exist'));
      }
      resolve(existingTask);
    });
  }

  /**
   * Returns the entire tasks array
   * @param  {GetTasksQuery} query: the query to filter tasks by
   * @return {Promise<Task[]>} The entire tasks array
   */
  getTasks(query: GetTasksQuery): Promise<Task[]> {
    return new Promise((resolve) => {
      /*
          nonAutoFilterProps are those where
          have to apply a special filter on it.
          The idea is that you'd have a long list of default
          "automatic props, where the filter would be basically the same,
          and a bunch of non-automatic props where the filter implementations
          would be different for each"
      */
      const nonAutoFilterProps = ['page', 'itemCount', 'executed', 'expired'];

      // The list of automatic filters
      const autoFilters: GetTasksQuery = {};

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
   * @param  {Partial<Task>} dataToUpdate: The data to update
   * @return {Promise<Task>} The updated task
   */
  updateTask(id: number, dataToUpdate: Partial<Task>): Promise<Task> {
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
   * @param  {Array<Task>} tasks the tasks to paginate
   * @return {Array<Task>} the appropriate page of tasks only
   */
  private paginate(page: number, taskCount: number, tasks: Array<Task>)
  : Array<Task> {
    const indexToStartFrom = page * taskCount;
    const indexToEndAt = indexToStartFrom + taskCount;
    tasks = tasks.slice(indexToStartFrom, indexToEndAt);
    return tasks;
  }

  /**
   * This method filters the tasks by their execution status
   * Will only run if query.executed is defined
   * @param  {Task[]} tasks
   * @param  {GetTasksQuery} query
   * @return {Array<Task>} tfinal filtered list of tasks
   */
  private queryByExecuted(tasks: Array<Task>, query: GetTasksQuery)
  : Array<Task> {
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
   * @param  {Task[]} tasks
   * @param  {GetTasksQuery} query
   * @return {Array<Task>} tfinal filtered list of tasks
   */
  private queryByExpired(tasks: Array<Task>, query: GetTasksQuery)
  : Array<Task> {
    if (query.expired === undefined) {
      return tasks;
    }

    const now = new Date();

    tasks = tasks.filter((task) => {
      return query.expired ? task.due_date < now : task.due_date >= now;
    });
    return tasks;
  }
}
