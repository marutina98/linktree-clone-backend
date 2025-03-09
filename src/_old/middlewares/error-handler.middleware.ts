import { Request, Response } from 'express';

import IError from '../interfaces/error.interfaces';

const errorHandler = (error: IError, request: Request, response: Response, next: Function) => {
  const status = error.status || 500;
  response.status(status).json({ message: `ERROR: ${error.message}` });
}

module.exports = errorHandler;