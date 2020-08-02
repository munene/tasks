import {RequestOrig} from '@hapi/hapi';

export interface CreateTaskRequestInterface extends RequestOrig {
  payload: {
    title: string,
    description: string,
    dueDate: Date,
  };
}

export interface TaskByIdRequestInterface extends RequestOrig {
  params: {
    id: number;
  };
}

export interface UpdateTaskRequestInterface extends RequestOrig {
  payload: {

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
