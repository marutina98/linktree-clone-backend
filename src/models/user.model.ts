import IPool from '../interfaces/pool.interface';
import IUser from '../interfaces/user.interface';
import ICreateUserRequest from '../interfaces/create-user-request.interface';

import Model from '../database/model';
import Profile from './profile.model';

const bcrypt = require('bcrypt');

class User extends Model {

  private profile: Profile;

  constructor(pool: IPool) {
    super(pool);
    this.profile = new Profile(pool);
  }

  // @db: get all
  // add profile if wanted

  public async getAll(getProfile: boolean = false) {
    
    try {

      const query = 'SELECT * FROM users;';
      const [users] = await this.pool.query(query);

      if (getProfile) {
        for (let index in users) {
          return await this.addProfileToUser(users[index]);
        }
      }

      return users;

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // @db: get one by id
  // add profile if wanted

  public async getById(id: number, getProfile: boolean = false) {
    
    try {
      const query = 'SELECT * FROM users WHERE id = ?;';
      const [user] = (await this.pool.query(query, [id]))[0];

      if (getProfile) return this.addProfileToUser(user);

      return user;

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // @db: create user and profile

  public async createUser(data: ICreateUserRequest) {

    try {

      // Hash Password

      const password = await this.hashPassword(data.password);

      const query = 'INSERT INTO users (email, password) VALUES (?, ?);';
      const values = [data.email, password];

      const [userCreationResult] = await this.pool.query(query, values);
      
      // Get User

      const user = (await this.getById(userCreationResult.insertId))[0];

      // Create Profile

      const profile = await this.profile.createProfile(user.id, data);

      return { user, profile }

    } catch (error: unknown) {
      console.log(error);
    }

  }

  // @db: update user

  public async updateUser(userId: number) {

    // Check that user exists

  }

  // @db: delete user

  public async deleteUser(id: number) {

    try {

      const userExists = await this.checkIfUserExists(id);

      if (userExists) {

        // Delete Links

        // @todo: Link Model

        // Delete Profile

        // @todo: Profile Model

        // Delete User

        const query = 'DELETE FROM users WHERE id = ?;';
        const [result] = await this.pool.query(query, [id]);

        return result;

      }

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // @db: check if the user exists

  public async checkIfUserExists(userId: number) {

    const query = 'SELECT EXISTS (SELECT * FROM users WHERE id = ?) AS userExists;';
    const [result] = await this.pool.query(query, [userId]);

    if (result.length > 0) return Boolean(result[0].userExists);
    throw new Error('Could not verify if user exists or not.');

  }

  // encrypt and compare password

  public async hashPassword(password: string, saltRounds: number = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  public async comparePassword(userId: number, password: string) {
    const user = await this.getById(userId);
    return bcrypt.compare(password, user.password);
  }

  // add profile to user

  public async addProfileToUser(user: IUser) {
    const profile = await this.profile.getByUserId(user.id);
    user.profile = profile[0];
    return user;
  }

}

module.exports = User;