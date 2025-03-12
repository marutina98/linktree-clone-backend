import { Response } from 'express';
import IRequestWithUser from '../interfaces/request-with-user.interface';
import IError from '../interfaces/error.interface';
import { prisma } from '../services/prisma.service';

// If the authenticated user and the resource's user id is the same,
// the user is the owner and can continue

export default async function isOwnerLink(request: IRequestWithUser, response: Response, next: Function) {

  try {

    const user = request.user;
    const id = request.params.id;
    
    if (!id) {
      const error = new Error('Link id is missing.') as IError;
      error.status = 500;
      throw error;
    }

    if (!user) {
      const error = new Error('User is not authenticated.') as IError;
      error.status = 401;
      throw error;
    }

    const idInt = parseInt(id);

    const link = await prisma.link.findUnique({
      where: {
        id: idInt
      }
    });

    if (!link) {
      const error = new Error('Link was not found.') as IError;
      error.status = 404;
      throw error;
    }

    const isOwner = user.id === link.userId;

    if (!isOwner) {
      const error = new Error('Authenticated User is not Owner.') as IError;
      error.status = 401;
      throw error;
    }

    next();

  } catch (error: unknown) {
    console.error(error);
  }

}