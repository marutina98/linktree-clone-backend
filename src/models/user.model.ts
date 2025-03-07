import IPool from '../interfaces/pool.interface';
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

  public async getAll() {
    
    try {

      const query = 'SELECT * FROM users;';
      const [rows] = await this.pool.query(query);
      return rows;

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // @db: get one by id

  public async getById(id: number) {
    
    try {
      const query = 'SELECT * FROM users WHERE id = ?;';
      const [rows] = await this.pool.query(query, [id]);
      return rows;
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

      return {
        user,
        profile
      }

    } catch (error: unknown) {
      console.log(error);
    }

  }

  // @db: update user

  public async updateUser() {

  }

  // @db: delete user

  public async deleteUser(id: number) {

    // Delete All Links
    // Delete Profile
    // Delete User

  }

  // @ encrypt and compare password

  public async hashPassword(password: string, saltRounds: number = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  public async comparePassword(userId: number, password: string) {
    const user = await this.getById(userId);
    return bcrypt.compare(password, user.password);
  }

}

module.exports = User;