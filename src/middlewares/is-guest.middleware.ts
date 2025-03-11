
// Interfaces & Types

import { Request, Response } from 'express';

// Check if a user is a guest by verifying that the
// authorizationHeader is absent.

export default async function isGuest(request: Request, response: Response, next: Function) {
  
  const authorizationHeader = request.headers.authorization ?? null;
  return !authorizationHeader ? true : false;

}