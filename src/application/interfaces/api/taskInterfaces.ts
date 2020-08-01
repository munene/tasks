import * as Hapi from 'hapi';

export interface ICreateTaskRequest extends Hapi.RequestOrig {
  payload: {
    title: string,
    description: string,
    due_date: Date,
  };
}

export interface ITaskByIdRequest extends Hapi.RequestOrig {
  params: {
    id: number;
  };
}

export interface IUpdateTaskRequest extends Hapi.RequestOrig {
  payload: {

  };
  params: {
    id: number;
  };
}

export interface IDeleteTaskRequest extends Hapi.RequestOrig {
  params: {
    id: number;
  };
}