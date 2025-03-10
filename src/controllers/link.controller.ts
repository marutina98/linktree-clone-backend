import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import IError from '../interfaces/error.interface';
import ILink from '../interfaces/link.interface';

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

    } catch (error: unknown) {
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

    } catch (error: unknown) {
      console.error(error);
    }

  }

  async createLink(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.body.id);

      const data = request.body as ILink;
      data.order = await this.getCorrectOrder(id);

      const link = this.prisma.link.create({ data });

      if (!link) {
        const error = new Error(`The Link could not be created.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(link);

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // @todo: updateLink
  // @todo: deleteLink

  public async moveLinkUp(response: Response, request: Request, next: Function) {

    try {

      const id = parseInt(request.params.id);

      const linkToMoveUp = await this.prisma.link.findUnique({

        where: {
          id
        }

      });

      // If the link does not exists, throw error.
      // If the order of the link is already 1, it cannot be moved up.
      
      if (!linkToMoveUp) {
        const error = new Error(`The Link could not be found.`) as IError;
        error.status = 500;
        next(error);
      }

      if (linkToMoveUp!.order <= 1) {
        const error = new Error(`The Link could not be moved up.`) as IError;
        error.status = 500;
        next(error);
      }

      // If the link to move up exists, we get the link to
      // move down (the link above it) and update its order also

      // To find it, we need the userId and the currentOrder

      const userId = linkToMoveUp!.userId;
      const currentOrder = linkToMoveUp!.order;

      const linkToMoveDown = await this.prisma.link.findFirst({
        where: {
          userId,
          order: currentOrder - 1
        }
      });

      if (!linkToMoveDown) {
        const error = new Error(`The Link Above it does not exist.`) as IError;
        error.status = 500;
        next(error);
      }

      // We update the orders with a batch query

      const result = await this.prisma.$transaction([

        this.prisma.link.update({

          where: {
            id: linkToMoveUp!.id,
          },

          data: {
            order: currentOrder - 1,
          }

        }),

        this.prisma.link.update({

          where: {
            id: linkToMoveDown!.id,
          },

          data: {
            order: currentOrder,
          }

        }),

      ]);

      response.status(200).json(result);

    } catch (error: unknown) {
      console.error(error);
    }

  }

  public async moveLinkDown(response: Response, request: Request, next: Function) {

    try {

      const id = parseInt(request.params.id);

      const linkToMoveDown = await this.prisma.link.findUnique({

        where: {
          id
        }

      });

      // If the link does not exists, throw error.
      // If the order of the link is already the max, it cannot be moved down.
      
      if (!linkToMoveDown) {
        const error = new Error(`The Link could not be found.`) as IError;
        error.status = 500;
        next(error);
      }

      const userId = linkToMoveDown!.userId;
      const maxOrder = await this.getMaxOrder(linkToMoveDown!.userId);

      if (linkToMoveDown!.order === maxOrder) {
        const error = new Error(`The Link could not be moved down.`) as IError;
        error.status = 500;
        next(error);
      }

      // If the link to move down exists, we get the link to
      // move up (the link under it) and update its order also

      // To find it, we need the userId and the currentOrder
      
      const currentOrder = linkToMoveDown!.order;

      const linkToMoveUp = await this.prisma.link.findFirst({
        where: {
          userId,
          order: currentOrder + 1
        }
      });

      if (!linkToMoveUp) {
        const error = new Error(`The Link Under it does not exist.`) as IError;
        error.status = 500;
        next(error);
      }

      // We update the orders with a batch query

      const result = await this.prisma.$transaction([

        this.prisma.link.update({

          where: {
            id: linkToMoveUp!.id,
          },

          data: {
            order: currentOrder + 1,
          }

        }),

        this.prisma.link.update({

          where: {
            id: linkToMoveDown!.id,
          },

          data: {
            order: currentOrder,
          }

        }),

      ]);

      response.status(200).json(result);

    } catch (error: unknown) {
      console.error(error);
    }

  }

  private async getCorrectOrder(userId: number): Promise<number> {
    const maxOrder = await this.getMaxOrder(userId);
    return maxOrder + 1;
  }

  private async getMaxOrder(userId: number): Promise<number> {

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

    return maxOrderLink ? maxOrderLink.order : 0;

  }
  
}