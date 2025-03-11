import { Request, Response } from 'express';

// Services

import { prisma } from './../services/prisma.service';
import { bcryptService } from '../services/bcrypt.service';

// Interfaces & Types

import IError from '../interfaces/error.interface';
import IUserCreateRequest from '../interfaces/user-create-request.interface';

import { User } from '@prisma/client';

export default class AuthenticationController {

  async registerUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const password = (request.body as IUserCreateRequest).password;
      const hashedPassword = await bcryptService.hashPassword(password);

      const user = await prisma.user.create({

        data: {

          email: request.body.email,
          password: hashedPassword,

          profile: {

            create: {

              name: request.body.name,
              biography: '',
              picture: '',

            }

          }

        },
        
        include: {
          profile: true,
          links: true
        },

        omit: {
          password: true,
        }

      });

      if (!user) {
        const error = new Error(`User could not be created.`) as IError;
        error.status = 409;
        next(error);
      }

      response.status(201).json(user);

    } catch (error) {
      console.error(error);
    }

  }

  async login(request: Request, response: Response, next: Function): Promise<void> {

  }

  async logout(request: Request, response: Response, next: Function): Promise<void> {

  }

}