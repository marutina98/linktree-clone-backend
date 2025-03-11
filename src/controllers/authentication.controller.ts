import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

// Services

import { prisma } from './../services/prisma.service';
import { bcryptService } from '../services/bcrypt.service';

// Interfaces & Types

import IError from '../interfaces/error.interface';
import IUserCreateRequest from '../interfaces/user-create-request.interface';

import { User } from '@prisma/client';

export default class AuthenticationController {

  // I register the user and hash their password
  // before sending it to the database

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

      const userWithToken = {
        ...user,
        token: this.generateJsonWebToken(user),
      }

      response.status(201).json(userWithToken);

    } catch (error) {
      console.error(error);
    }

  }

  async login(request: Request, response: Response, next: Function): Promise<void> {

  }

  async logout(request: Request, response: Response, next: Function): Promise<void> {

  }

  // Generate JsonWebToken for newly registered/logged in user.
  // I omit password because it's not needed.

  generateJsonWebToken(user: Omit<User, 'password'>) {
    return sign({
      email: user.email
    }, 'JWT_SECRET');
  }

}