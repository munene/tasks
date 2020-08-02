import * as Hapi from 'hapi';

export interface CreateTaskRequestInterface extends Hapi.RequestOrig {
  payload: {
    title: string,
    description: string,
    dueDate: Date,
  };
}

export interface TaskByIdRequestInterface extends Hapi.RequestOrig {
  params: {
    id: number;
  };
}

export interface UpdateTaskRequestInterface extends Hapi.RequestOrig {
  payload: {

  };
  params: {
    id: number;
  };
}

export interface DeleteTaskRequest extends Hapi.RequestOrig {
  params: {
    id: number;
  };
}
