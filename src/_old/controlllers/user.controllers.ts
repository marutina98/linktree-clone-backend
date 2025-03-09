import { Request, Response } from 'express';

import IError from '../interfaces/error.interfaces';

const pool = require('./../database/connection');

const UserModel = require('./../models/user.model');
const userModel = new UserModel(pool);

const getUsers = async (request: Request, response: Response) => {

  try {

    const users = await userModel.getAll();

    if (!users) return response.status(200).json([]);

    return response.status(200).json(users);

  } catch (error: unknown) {
    console.error(error);
  }

}

const getUser = async (request: Request, response: Response, next: Function) => {

  const id = parseInt(request.params.id);
  const user = await userModel.getById(id);

  if (!user) {
    const error = (new Error(`User with id ${id} not found.`)) as IError;
    error.status = 404;
    return next(error);
  }

  return response.status(200).json(user);

}

const createUser = async (request: Request, response: Response, next: Function) => {

}

const updateUser = async (request: Request, response: Response, next: Function) => {

}

const deleteUser = async (request: Request, response: Response, next: Function) => {

}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}