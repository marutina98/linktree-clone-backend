
import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Interfaces

import IError from '../interfaces/error.interface';

// Controller

export default class UserController {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getUsers(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const users = await this.prisma.user.findMany({
        include: { profile: true, links: true }
      });

      if (!users) {
        const error = new Error(`No Users were found.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(users);

    } catch (error) {
      console.error(error);
    }

  }

  async getUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);

      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { profile: true, links: true }
      });

      if (!user) {
        const error = new Error(`User with id ${id} was not found.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(user);

    } catch (error) {
      console.error(error);
    }

  }

  async createUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

    } catch (error) {
      console.error(error);
    }

  }

}