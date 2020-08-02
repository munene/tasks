/* eslint-disable camelcase */
import {RequestOrig} from '@hapi/hapi';

export interface CreateTaskRequestInterface extends RequestOrig {
  payload: {
    title: string,
    description: string,
    due_date: Date,
  };
}

export interface TaskByIdRequestInterface extends RequestOrig {
  params: {
    id: number;
  };
}

export interface UpdateTaskRequestInterface extends RequestOrig {
  payload: {
    title?: string,
    description?: string,
    due_date?: Date,
    executed_on?: Date
  };
  params: {
    id: number;
  };
}

export interface DeleteTaskRequest extends RequestOrig {
  params: {
    id: number;
  };
}
