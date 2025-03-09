import { Request, Response } from 'express';

import IError from '../interfaces/error.interfaces';

const pool = require('./../database/connection');

const ProfileModel = require('./../models/profile.model');
const profileModel = new ProfileModel(pool);

const updateProfile = async (request: Request, response: Response, next: Function) => {
  
  try {

    const data = request.body;
    const userId = request.params.userId;

    // Validate Received Data

    if (!data.name) {
      const error = (new Error('Name not provided.')) as IError;
      error.status = 404;
      return next(error);
    }

    if (!data.bio) {
      const error = (new Error('Biography not provided.')) as IError;
      error.status = 404;
      return next(error);
    }

    const profile = await profileModel.updateProfile(userId, data);

    return response.status(200).json(profile);

  } catch(error: unknown) {
    console.error(error);
  }

}

module.exports = {
  updateProfile,
}