import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import IError from '../interfaces/error.interface';

export default class LinkController {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getLinks(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const links = await this.prisma.link.findMany();

      if (!links) {
        const error = new Error(`No links were found.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(links);

    } catch (error) {
      console.error(error);
    }

  }

  async getLink(request: Request, response: Response, next: Function): Promise<void> {
    
  }
  
}