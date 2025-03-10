import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import IError from '../interfaces/error.interface';

export default class LinkController {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
}