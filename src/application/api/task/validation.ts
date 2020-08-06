import Joi from '@hapi/joi';

// These are the required initial fields of a task
export const createTaskValidator = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  due_date: Joi.date().required(),
});

// You may update any one of these fields
export const updateTaskValidator = Joi.object().keys({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  due_date: Joi.date().optional(),
  executed_on: Joi.date().optional(),
});

export const requestByIdValidator = Joi.object().keys({
  id: Joi.number().required(),
});

export const getTasksQueryValidator = Joi.object().keys({
  page: Joi.number().optional().default(0),
  itemCount: Joi.number().optional().default(10),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  executed: Joi.boolean().optional(),
  expired: Joi.boolean().optional(),
});
