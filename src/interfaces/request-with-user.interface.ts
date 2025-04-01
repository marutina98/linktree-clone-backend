
// Interfaces & Types

import { User } from '@prisma/client';
import { Request } from 'express';

export default interface IRequestWithUser extends Request {
  user?: User
}