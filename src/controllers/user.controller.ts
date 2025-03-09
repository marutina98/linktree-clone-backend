
import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';

// Interfaces

import IError from '../interfaces/error.interface';
import IUserUpdateRequest from '../interfaces/user-update-request.interface';
import IUserCreateRequest from '../interfaces/user-create-request.interface';

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

      const password = (request.body as IUserCreateRequest).password;
      const hashedPassword = await this.hashPassword(password);

      const user = await this.prisma.user.create({
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
        include: { profile: true, links: true }
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

  async updateUser(request: Request, response: Response, next: Function): Promise<void> {

    try {

      // const id = request.body.id;

      // const password = (request.body as IUserUpdateRequest).password;
      // const hashedPassword = await this.hashPassword(password);

      const id = request.body.id;

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
                        await this.hashPassword(_value as string) : _value;

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

      const user = await this.prisma.user.update({
        where: { id },
        data: userDataObject,
        include: { profile: true, links: true }
      });

      if (!user) {
        const error = new Error(`User could not be created.`) as IError;
        error.status = 409;
        next(error);
      }

      response.status(202).json(user);

    } catch (error) {
      console.error(error);
    }

  }

  async deleteUser(request: Request, response: Response, next: Function): Promise<void> {

  }

  async hashPassword(password: string, saltRounds: number = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

}