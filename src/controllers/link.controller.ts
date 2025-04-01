import { Request, Response } from 'express';
import { prisma } from '../services/prisma.service';

interface ILinkUpdate {
  id: number,
  order: number
}

// Interfaces & Types

import IToken from '../interfaces/token.interface';
import IError from '../interfaces/error.interface';
import ILinkUpdateRequest from '../interfaces/link-update-request.interface';

import { verify } from 'jsonwebtoken';

import { Link } from '@prisma/client';

export default class LinkController {

  async getLinks(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const links = await prisma.link.findMany();

      if (!links) {
        const error = new Error(`No links were found.`) as IError;
        error.status = 500;
        return next(error);
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
        return next(error);
      }

      response.status(200).json(link);

    } catch (error: unknown) {
      console.error(error);
    }

  }

  async createLink(request: Request, response: Response, next: Function): Promise<void> {

    try {

      // Get userId from authenticated user

      const tokenHeader = request.headers.authorization;
            
      if (!tokenHeader) {
        const error = new Error('User is not authenticated.') as IError;
        error.status = 500;
        return next(error);
      }

      const token = tokenHeader?.split(' ')[1] as string;
      const decodedToken = verify(token, 'JWT_SECRET') as IToken;
      
      if (!decodedToken) {
        const error = new Error('Token could not be decoded.') as IError;
        error.status = 500;
        return next(error);
      }

      const email = decodedToken.email;

      if (!email) {
        const error = new Error('Email could not be found in token.') as IError;
        error.status = 500;
        return next(error);
      }

      const user = await prisma.user.findUniqueOrThrow({

        where: {
          email
        },

        omit: {
          password: true,
        }

      });

      const userId = user.id;

      const data = request.body as Omit<Link, 'id'>;

      data.userId = userId;
      data.order = await this.getCorrectOrder(userId);

      const link = await prisma.link.create({ data });

      if (!link) {
        const error = new Error(`The Link could not be created.`) as IError;
        error.status = 500;
        return next(error);
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
        return next(error);
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

  // Move the Link up and the Link above down.

  public async moveLinkUp(request: Request, response: Response, next: Function) {

    try {
      
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        const error = new Error('The received id is not a number.') as IError;
        error.status = 400;
        return next(error);
      }

      // Find Unique or Throw Error

      const link = await prisma.link.findUniqueOrThrow({
        where: {
          id
        }
      });

      const currentOrder = link!.order;

      // If the link is already at the highest position
      // throw an error

      if (currentOrder <= 1) {
        const error = new Error(`Link with ${id} id could not be moved down.`) as IError;
        error.status = 400;
        return next(error);
      }

      // Get userId from link
      // Find above link or throw error

      const userId = link!.userId;
      const aboveLink = await prisma.link.findFirstOrThrow({
        where: {
          userId,
          order: currentOrder - 1
        }
      });

      const newLinkOrder: [ILinkUpdate, ILinkUpdate] = [

        {
          id: link.id,
          order: aboveLink.order,
        },

        {
          id: aboveLink.id,
          order: currentOrder
        }

      ];

      const result = await this.updateLinkOrder(newLinkOrder);

      response.status(200).json(result);

    } catch(error: unknown) {
      console.error(error);
    }

  }

  // Move the Link down and the under link up.

  public async moveLinkDown(request: Request, response: Response, next: Function) {

    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        const error = new Error('The received id is not a number.') as IError;
        error.status = 400;
        return next(error);
      }

      // Find Unique or Throw Error

      const link = await prisma.link.findUniqueOrThrow({
        where: {
          id
        }
      });

      const currentOrder = link!.order;

      // Get userId from Link
      // Use userId to get the possible maxOrder
      // If the maxOrderReceived is 0, maxOrder is 1 otherwise is maxOrderReceived

      const userId = link!.userId;
      const maxOrderReceived = await this.getMaxOrder(userId);
      const maxOrder = maxOrderReceived === 0 ? 1 : maxOrderReceived;

      // If the link is already at the highest position
      // throw an error

      if (currentOrder >= maxOrder) {
        const error = new Error(`Link with ${id} id could not be moved down.`) as IError;
        error.status = 400;
        return next(error);
      }

      // Find under link or throw error

      const underLink = await prisma.link.findFirstOrThrow({
        where: {
          userId,
          order: currentOrder + 1
        }
      });

      const newLinkOrder: [ILinkUpdate, ILinkUpdate] = [

        {
          id: link.id,
          order: underLink.order,
        },

        {
          id: underLink.id,
          order: currentOrder
        }

      ];
      
      const result = await this.updateLinkOrder(newLinkOrder);

      response.status(200).json(result); 

    } catch(error: unknown) {
      console.error(error);
    }

  }

  public async updateLinkOrder(links: [ILinkUpdate, ILinkUpdate]) {
    return prisma.$transaction([
      prisma.link.update({
        where: {
          id: links[0].id,
        },
        data: {
          order: links[0].order,
        }
      }),

      prisma.link.update({
        where: {
          id: links[1].id,
        },
        data: {
          order: links[1].order,
        }
      })
    ]);

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