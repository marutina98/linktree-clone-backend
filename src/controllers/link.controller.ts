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

    const id = parseInt(request.params.id);

    try {

      const link = await this.prisma.link.findUnique({
        where: {
          id
        }
      });

      if (!link) {
        const error = new Error(`The Link with id ${id} was not found.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(link);

    } catch (error) {
      console.error(error);
    }

  }

  private async getCorrectOrder(userId: number) {

    try {

      // Get the link with the highest order number

      const maxOrderLink = await this.prisma.link.findFirst({

        where: {
          userId: userId,
        },

        orderBy: {
          order: 'desc',
        }

      });

      // If the maxOrderLink exists, I return its order + 1
      // otherwise I return 1.

      const order = maxOrderLink ? maxOrderLink.order++ : 1;

      return order;

    } catch (error) {
      console.error(error);
    }

  }
  
}