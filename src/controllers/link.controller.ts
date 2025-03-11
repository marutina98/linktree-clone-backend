import { Request, Response } from 'express';
import { prisma } from '../services/prisma.service';

// Interfaces & Types

import IError from '../interfaces/error.interface';
import ILinkUpdateRequest from '../interfaces/link-update-request.interface';

import { Link } from '@prisma/client';

export default class LinkController {

  async getLinks(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const links = await prisma.link.findMany();

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

      const link = await prisma.link.findUnique({
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

      const data = request.body as Link;
      data.order = await this.getCorrectOrder(id);

      const link = prisma.link.create({ data });

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

  public async updateLink(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);
      const data: ILinkUpdateRequest = request.body;

      const link = await prisma.link.update({

        where: {
          id
        },

        data

      });

      if (!link) {
        const error = new Error(`Link could not be updated.`) as IError;
        error.status = 409;
        next(error);
      }

      response.status(202).json(link);

    } catch (error: unknown) {
      console.error(error);
    }

  }

  public async deleteLink(request: Request, response: Response, next: Function): Promise<void> {
    
    try {

      const id = parseInt(request.params.id);
      const deleteLink = await prisma.link.delete({
        where: {
          id
        }
      });

      response.status(200).json(deleteLink);

    } catch (error) {
      console.error(error);
    }
    
  }

  public async moveLinkUp(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);

      const linkToMoveUp = await prisma.link.findUnique({

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

      const linkToMoveDown = await prisma.link.findFirst({
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

      const result = await prisma.$transaction([

        prisma.link.update({

          where: {
            id: linkToMoveUp!.id,
          },

          data: {
            order: currentOrder - 1,
          }

        }),

        prisma.link.update({

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

  public async moveLinkDown(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);

      const linkToMoveDown = await prisma.link.findUnique({

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

      const linkToMoveUp = await prisma.link.findFirst({
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

      const result = await prisma.$transaction([

        prisma.link.update({

          where: {
            id: linkToMoveUp!.id,
          },

          data: {
            order: currentOrder + 1,
          }

        }),

        prisma.link.update({

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

    const maxOrderLink = await prisma.link.findFirst({

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