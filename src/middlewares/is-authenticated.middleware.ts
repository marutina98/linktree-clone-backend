
// Interfaces & Types

import { Response } from 'express';
import IError from '../interfaces/error.interface';
import IRequestWithUser from '../interfaces/request-with-user.interface';
import { verify } from 'jsonwebtoken';
import IEmail from '../interfaces/email.interface';
import { prisma } from '../services/prisma.service';

// Check if the user is authenticated
// by verifying that the token is present
// and valid by decoding it and verifying
// that an user with the provided email exists

export default async function isAuthenticated(request: IRequestWithUser, response: Response, next: Function) {
  
  const authorizationHeader = request.headers.authorization ?? null;

  if (!authorizationHeader) {
    const error = (new Error('User is not authenticated')) as IError;
    error.status = 403;
  }

  const token = authorizationHeader?.split(' ')[1];

  if (!token) {
    const error = (new Error('Token is not present.')) as IError;
    error.status = 403;
  }

  try {

    if (token) {

      const decodedToken = verify(token, 'JWT_SECRET') as IEmail;
    
      const user = await prisma.user.findUnique({
        where: {
          email: decodedToken.email
        }
      });
  
      request.user = user ?? undefined;

      next();

    }    

  } catch (error: unknown) {

    const status = (error as IError).status || 500;
    const message = (error as IError).message;

    response.status(status).json({
      message: `ERROR: ${message}`,
      status: status
    });

    console.error(error);
  }

}