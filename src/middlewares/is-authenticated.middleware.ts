
// Interfaces & Types

import { Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestWithUser from '../interfaces/request-with-user.interface';

// Check if the user is authenticated
// by verifying that the token is present
// and valid

export default function isAuthenticated(request: IRequestWithUser, response: Response, next: Function) {
  
  const authorizationHeader = request.headers.authorization ?? null;

  if (!authorizationHeader) {
    const error = (new Error('User is not authenticated')) as IError;
    error.status = 403;
    next(error);
  }

  const token = authorizationHeader?.split(' ');

  if (!token) {
    const error = (new Error('Token is not present.')) as IError;
    error.status = 403;
    next(error);
  }

  try {



  } catch (error: unknown) {
    request.user = undefined;
    console.error(error);
  }

}