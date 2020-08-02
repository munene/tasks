"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = require("./controller");
var validation_1 = require("./validation");
exports.register = function (server, repository) {
    var taskController = new controller_1.TaskController(repository);
    server.route({
        method: 'GET',
        path: '/task/{id}',
        options: {
            handler: taskController.getTaskById,
            description: 'Get task by id',
            validate: {
                params: validation_1.requestByIdValidator,
            },
        },
    });
    server.route({
        method: 'GET',
        path: '/task/all',
        options: {
            handler: taskController.getAllTasks,
            description: 'Get all tasks',
        },
    });
    server.route({
        method: 'POST',
        path: '/task',
        options: {
            handler: taskController.createTask,
            description: 'Create task',
            validate: {
                payload: validation_1.createTaskValidator,
            },
        },
    });
    server.route({
        method: 'PUT',
        path: '/task/{id}',
        options: {
            handler: taskController.updateTask,
            description: 'Update task',
            validate: {
                payload: validation_1.updateTaskValidator,
                params: validation_1.requestByIdValidator,
            },
        },
    });
    server.route({
        method: 'POST',
        path: '/task/{id}/execute',
        options: {
            handler: taskController.executeTask,
            description: 'Mark a task as executed',
            validate: {
                params: validation_1.requestByIdValidator,
            },
        },
    });
    server.route({
        method: 'DELETE',
        path: '/task/{id}',
        options: {
            handler: taskController.deleteTask,
            description: 'Delete task',
            validate: {
                params: validation_1.requestByIdValidator,
            },
        },
    });
};
