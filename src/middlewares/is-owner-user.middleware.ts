import { Response } from 'express';
import IRequestWithUser from '../interfaces/request-with-user.interface';
import IError from '../interfaces/error.interface';

// If the authenticated user is the user with the same id
// is the owner and can continue

export default async function isOwnerUser(request: IRequestWithUser, response: Response, next: Function) {

  try {

    const user = request.user;
    const id = request.params.id;
    
    if (!id) {
      const error = new Error('User is not owner.') as IError;
      error.status = 401;
      throw error;
    }

    if (!user) {
      const error = new Error('User is not authenticated.') as IError;
      error.status = 401;
      throw error;
    }

    const idInt = parseInt(id);

    if (idInt === user.id) next();

  } catch (error: unknown) {
    console.error(error);
  }

}