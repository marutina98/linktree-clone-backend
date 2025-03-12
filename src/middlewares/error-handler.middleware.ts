import { Request, Response } from 'express';

import IError from '../interfaces/error.interface';

export default function errorHandlerMiddleware(error: IError, request: Request, response: Response, next: Function) {
  const status = error.status || 500;
  response.status(status).json({
    message: `ERROR: ${error.message}`,
    status: status
  });
}