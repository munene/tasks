import {
  RepositoryInterface,
} from '../../application/interfaces/persistence/repository.interface';
import {GetTasksQuery} from '../../application/interfaces/api/taskInterfaces';
import {DataTypes, Op, Sequelize} from 'sequelize';
import Boom from '@hapi/boom';
import {PostgresTask} from './task.model';
import {getSequelize} from './config';

/**
 * The implementation of the postgres-based repository
 * @class PostgresRepository
 */
export class PostgresRepository implements RepositoryInterface {
  /**
   * Initialize the postgres database
   * with an empty tasks list
   */
  constructor() {
  }

  /**
   * Make a connection to the database
   */
  async connectDatabase() {
    let sequelize: Sequelize;
    try {
      sequelize = getSequelize();
      await sequelize.authenticate();
      this.initTaskTable(sequelize);
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  /**
   * Initialize and build the PostgresTask table
   * @param  {Sequelize} sequelize
   */
  private async initTaskTable(sequelize: Sequelize) {
    PostgresTask.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          title: {
            type: new DataTypes.STRING(),
            allowNull: false,
          },
          description: {
            type: new DataTypes.STRING(),
            allowNull: false,
          },
          due_date: {
            type: new DataTypes.DATE(),
            allowNull: false,
          },
          executed_on: {
            type: new DataTypes.DATE(),
            allowNull: true,
          },
        },
        {
          sequelize,
          paranoid: true,
          tableName: 'tasks',
        },
    );

    await PostgresTask.sync();
  }

  /**
   * Create and save the task in PostgresTask table
   * @param  {Partial<PostgresTask>} newTask: The task details to be created
   * @return {Promise<PostgresTask>} The created task
   */
  async createNewTask(newTask: Partial<PostgresTask>): Promise<PostgresTask> {
    try {
      const createdTask = await PostgresTask.create({
        title: newTask.title!,
        description: newTask.description!,
        due_date: newTask.due_date!,
      });

      return createdTask;
    } catch (error) {
      throw Boom.internal('We encountered an error');
    }
  }

  /**
   * Query the task table for one task by it's id
   * @param  {number} id: The id of the requested task
   * @return {Promise<PostgresTask>} The requested task
   */
  async getTask(id: number): Promise<PostgresTask> {
    try {
      const task = await PostgresTask.findByPk(id);

      if (!task) {
        throw Boom.notFound('The task does not exist');
      }

      return task;
    } catch (error) {
      throw Boom.internal('We encountered an error');
    }
  }

  /**
   * Returns a list of tasks
   * @param  {GetTasksQuery} query: the query to filter tasks by
   * @return {Promise<PostgresTask[]>} The entire tasks array
   */
  async getTasks(query: GetTasksQuery): Promise<PostgresTask[]> {
    // The list of automatic filters
    let filters = this.generateAutoFilters(query);

    // Add into consideration the executed virtual prop
    filters = this.addQueryByExecuted(query, filters);

    // Add into consideration the expired virtual prop
    filters = this.addQueryByExpired(query, filters);

    try {
      const tasks = await PostgresTask.findAll({
        where: filters,
        offset: query.page! * query.itemCount!,
        limit: query.itemCount!,
      });

      return tasks;
    } catch (error) {
      throw Boom.internal('We encountered an error');
    }
  }

  /**
   * Update a task with the specified id, with the specified data
   * @param  {number} id: The id of the task to update
   * @param  {Partial<PostgresTask>} dataToUpdate: The data to update
   * @return {Promise<PostgresTask>} The updated task
   */
  async updateTask(id: number, dataToUpdate: Partial<PostgresTask>)
  : Promise<PostgresTask> {
    try {
      const task = await PostgresTask.findByPk(id);

      if (!task) {
        throw Boom.notFound('The task does not exist');
      }

      const updatedTask = task.update(dataToUpdate);

      return updatedTask;
    } catch (error) {
      throw Boom.internal('We encountered an error');
    }
  }

  /**
   * Delete the task with the specified id
   * @param  {number} id
   * @return {Promise<boolean>} Whether or not the task was successfully deleted
   */
  async deleteTask(id: number): Promise<boolean> {
    try {
      await PostgresTask.destroy({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      throw Boom.internal('We encountered an error');
    }
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
  private generateAutoFilters(query: GetTasksQuery): any {
    // The ones to leave out of the automatic filters
    const nonAutoFilterProps = ['page', 'itemCount', 'executed', 'expired'];

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

    return autoFilters;
  }

  /**
   * This method filters the tasks by their execution status
   * Will only run if query.executed is defined
   * @param  {GetTasksQuery} query the query from the api call
   * @param  {any} activeFilter the query to be sent to the ORM
   * @return {any} activeQuery and (possibly) an any executed based filter
   */
  private addQueryByExecuted(query: GetTasksQuery, activeFilter: any): any {
    if (query.executed === undefined) {
      return activeFilter;
    }

    /* Add a not equal to null filter if executed = true
       otherwise check for null
    */
    activeFilter.executed_on = query.executed ? {[Op.ne]: null} : null;
    return activeFilter;
  }

  /**
   * This method filters the tasks by their expiry status
   * Will only run if query.expired is defined
   * @param  {GetTasksQuery} query the query from the api call
   * @param  {GetTasksQuery} activeFilter the query to be sent to the ORM
   * @return {any} activeQuery and (possibly) an expired based filter
   */
  private addQueryByExpired(query: GetTasksQuery, activeFilter: any)
  : any {
    if (query.expired === undefined) {
      return activeFilter;
    }

    const now = new Date();

    activeFilter.due_date = query.expired ? {[Op.lt]: now} : {[Op.gte]: now};
    return activeFilter;
  }
}
