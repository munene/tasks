# Tasks API

An API to manage tasks.

## Installation

Clone this repo

`git clone https://github.com/munene/tasks.git`

Install the required packages.

`yarn install`

## Getting Started

### Environment Variables

Create a file `.env` and set all credentials there.

Using the file `.env.example` as a template, you can `cp .env.example .env`

### Starting the Server

Install the required packages.

`yarn install`

Once you have all the credentials set up, you can start the service locally by running `yarn start`

### Running Tests

You can run tests using `yarn test`. This will also run linting according to rules in `.eslintrc`.

## `/healthz`

### Check server health

Checks if server is up & responding to requests

#### URL: `/healthz`

#### Method: `GET`

#### Success Response(s):

- **Code:** 200 <br />
  **Content:** `OK`

## `/task`

### Create a new task

#### URL: `/task`

Creates a new task and stores it in a repository

#### Method: `POST`

#### Headers:

`Content-Type: application/json`

#### Payload Params:

```javascript
{
  /* The task's title */
  title: 'Test Title',

  /* The task's title */
  description: 'This is a description',

  /* The task's due date */
  due_date: "2020-08-07T20:42:12.664Z"
}
```

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  {
    "id": 1,
    "title": "Test Title",
    "description": "This is a description",
    "due_date": "2020-08-07T20:42:12.664Z",
    "executed_on": null,
    "createdAt": "2020-08-06T09:07:41.563Z",
    "updatedAt": "2020-08-06T09:07:41.563Z",
    "deletedAt": null
  }
  ```

#### Error Responses:

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```

### Get a task's details

#### URL: `/task/{id}`

#### Method: `GET`

#### Headers:

`Content-Type: application/json`

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  {
    "id": 1,
    "title": "Test Title",
    "description": "This is a description",
    "due_date": "2020-08-07T20:42:12.664Z",
    "executed_on": null,
    "createdAt": "2020-08-06T09:07:41.563Z",
    "updatedAt": "2020-08-06T09:07:41.563Z",
    "deletedAt": null
  }
  ```

#### Error Responses:

- **Code:** 404 NOT FOUND <br />
  **Content:**

  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "The task does not exist"
  }
  ```

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```

### Get a list of tasks

#### URL: `/task/{id}`

#### Method: `GET`

#### Headers:

`Content-Type: application/json`

#### Query Params (All Optional):

```
The tasks title
title: 'Test Title'

The tasks description
description: 'This is a description'

Return only the executed or unexecuted tasks
executed: true|false

Return only the expired or unexpired tasks
expired: true|false

The page number to return (default is the first page)
page: true|false

The number of tasks to return (default is 10)
itemCount: true|false
```

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  [
    {
      "id": 1,
      "title": "Test Title",
      "description": "This is a description",
      "due_date": "2020-08-07T20:42:12.664Z",
      "executed_on": null,
      "createdAt": "2020-08-06T09:07:41.563Z",
      "updatedAt": "2020-08-06T09:07:41.563Z",
      "deletedAt": null
    }
  ]
  ```

#### Error Responses:

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```

### Update a task

#### URL: `/task/{id}`

Creates a new task and stores it in a repository

#### Method: `PUT`

#### Headers:

`Content-Type: application/json`

#### Payload Params:

**All Optional**

```javascript
{
  /* The task's title */
  title: 'Test Title',

  /* The task's title */
  description: 'This is a description',

  /* The task's due date */
  due_date: "2020-08-07T20:42:12.664Z",

  /* When the task was executed */
  executed_on: "2020-08-07T20:42:12.664Z"
}
```

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  {
    "id": 1,
    "title": "Test Title",
    "description": "This is a description",
    "due_date": "2020-08-07T20:42:12.664Z",
    "executed_on": null,
    "createdAt": "2020-08-06T09:07:41.563Z",
    "updatedAt": "2020-08-06T09:07:41.563Z",
    "deletedAt": null
  }
  ```

#### Error Responses:

- **Code:** 404 NOT FOUND <br />
  **Content:**

  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "The task does not exist"
  }
  ```

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```

#### URL: `/task`

Creates a new task and stores it in a repository

#### Method: `POST`

#### Headers:

`Content-Type: application/json`

#### Payload Params:

```javascript
{
  /* The task's title */
  title: 'Test Title',

  /* The task's title */
  description: 'This is a description',

  /* The task's due date */
  due_date: "2020-08-07T20:42:12.664Z"
}
```

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  {
    "id": 1,
    "title": "Test Title",
    "description": "This is a description",
    "due_date": "2020-08-07T20:42:12.664Z",
    "executed_on": null,
    "createdAt": "2020-08-06T09:07:41.563Z",
    "updatedAt": "2020-08-06T09:07:41.563Z",
    "deletedAt": null
  }
  ```

#### Error Responses:

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```

### Delete a task

#### URL: `/task/{id}`

#### Method: `DELETE`

#### Headers:

`Content-Type: application/json`

#### Success Response(s):

- **Code:** 200 <br />
  **Content:**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

#### Error Responses:

- **Code:** 500 INTERNAL <br />
  **Content:**
  ```json
  {
    "statusCode": 500,
    "error": "Internal",
    "message": "Internal Server Error"
  }
  ```
