import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

// Services

import { prisma } from './../services/prisma.service';
import { bcryptService } from '../services/bcrypt.service';

// Interfaces & Types

import IError from '../interfaces/error.interface';
import IUserCreateRequest from '../interfaces/user-create-request.interface';

import { User } from '@prisma/client';
import IOptionalPassword from '../interfaces/optional-password.interface';

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

      const token = this.generateJsonWebToken(user);
      const userWithToken = {
        ...user,
        token
      }

      response.status(201).json(userWithToken);

    } catch (error) {
      console.error(error);
    }

  }

  async login(request: Request, response: Response, next: Function): Promise<void> {

    try {

      // Find the user using the received email
      // I include the profile and the links

      const user = await prisma.user.findUnique({

        where: {
          email: request.body.email,
        },
        
        include: {
          profile: true,
          links: true
        }

      });

      if (!user) {
        const error = new Error(`User could not be found.`) as IError;
        error.status = 409;
        next(error);
      }

      const hashedPassword = user!.password;
      const receivedPassword = request.body.password;
      const isPasswordCorrect = await bcryptService.comparePasswords(receivedPassword, hashedPassword);

      // If the password is wrong
      // throw an error, otherwise continue

      if (!isPasswordCorrect) {
        const error = new Error('Password is not correct') as IError;
        error.status = 401;
        next(error);
      }

      // Delete the password from the received User
      // Generate token and return it

      delete (user as IOptionalPassword)!.password;

      const token = this.generateJsonWebToken(user as User);
      const userWithToken = {
        ...user,
        token
      }

      response.status(200).json(userWithToken);
      
    } catch (error: unknown) {
      console.error(error);
    }

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