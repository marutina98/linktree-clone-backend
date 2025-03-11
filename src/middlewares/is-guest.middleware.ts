
// Imports

import { verify } from 'jsonwebtoken';

// Interfaces & Types

import { Request, Response } from 'express';
import IEmail from './../interfaces/email.interface';
import IError from '../interfaces/error.interface';

// Check if a user is a guest by verifying that the
// authorizationHeader and the token are both absent.
// If the token is present, checks that it's valid,
// if valid, the user is not a guest.

export default async function isGuest(request: Request, response: Response, next: Function) {
  
  const authorizationHeader = request.headers.authorization ?? null;
 
  if (!authorizationHeader) return next();

  const token = authorizationHeader.split(' ')[1];

  if (!token) return next();

  try {

      verify(token, 'JWT_SECRET') as IEmail;

      // Throw an error if the token is valid
      
      const error = new Error('User is not a guest.') as IError;
      error.status = 401;
      throw error;

    } catch (error: unknown) {
      return next();
    }

}