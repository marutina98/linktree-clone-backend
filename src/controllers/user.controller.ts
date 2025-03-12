
import { Request, Response } from 'express';

// Services

import { prisma } from '../services/prisma.service';

import { bcryptService } from '../services/bcrypt.service';

// Interfaces

import IError from '../interfaces/error.interface';

// Controller

export default class UserController {

  async getUsers(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const users = await prisma.user.findMany({

        include: {
          profile: true,
          links: true
        },

        omit: {
          password: true,
        }

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

      const user = await prisma.user.findUnique({

        where: {
          id
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
        const error = new Error(`User with id ${id} was not found.`) as IError;
        error.status = 500;
        next(error);
      }

      response.status(200).json(user);

    } catch (error) {
      console.error(error);
    }

  }

  async updateUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);

      const userDataArr: [string, string|object][] = [];
      const profileDataArr: [string, string][] = [];

      const userFields = ['email', 'password'];
      const profileFields = ['name', 'biography', 'picture'];

      // I want to update both the user and the profile
      // I want to update only the received values

      // I push the wanted values in the array
      // I will convert the array into an object

      for (let [key, _value] of Object.entries(request.body)) {

        if (userFields.includes(key)) {

          // If the received value is a password
          // hash the password

          const value = key === 'password' ?
                        await bcryptService.hashPassword(_value as string) : _value;

          userDataArr.push([key, value as string]);

        }

        if (profileFields.includes(key)) {
          profileDataArr.push([key, _value as string]);
        }

      }

      if (profileDataArr.length > 0) {

        const profileDataObject = {
          update: Object.fromEntries(profileDataArr)
        }

        userDataArr.push(['profile', profileDataObject]);
      }

      const userDataObject = Object.fromEntries(userDataArr);

      const user = await prisma.user.update({

        where: {
          id
        },

        data: userDataObject,

        include: {
          profile: true,
          links: true
        },

        omit: {
          password: true,
        }

      });

      if (!user) {
        const error = new Error(`User could not be update.`) as IError;
        error.status = 409;
        next(error);
      }

      response.status(202).json(user);

    } catch (error) {
      console.error(error);
    }

  }

  async deleteUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

      const id = parseInt(request.params.id);
      
      await prisma.user.delete({
        where: {
          id
        }
      });

      response.status(200).json({
        message: `User with id ${id} was deleted`,
        status: 200
      });

    } catch (error) {
      console.error(error);
    }

  }

}