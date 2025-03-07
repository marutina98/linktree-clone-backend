import IPool from '../interfaces/pool.interface';

import Model from '../database/model';

import ICreateProfileRequest from '../interfaces/create-profile-request.interface';

export default class Profile extends Model {

  constructor(pool: IPool) {
    super(pool);
  }

  public async getAll() {
    const query = 'SELECT * FROM profiles;'
    const [result] = await this.pool.query(query);
    return result;
  }

  public async getById(id: number) {
    const query = 'SELECT * FROM profiles WHERE id = ?;';
    const [result] = await this.pool.query(query, [id]);
    return result;
  }

  public async getByUserId(userId: number) {
    const query = 'SELECT * FROM profiles WHERE user_id = ?;';
    const [result] = await this.pool.query(query, [userId]);
    return result;
  }

  public async createProfile(userId: number, data: ICreateProfileRequest) {
    
    const query = 'INSERT INTO profiles (user_id, name) VALUES (?, ?);';
    const values = [userId, data.name];

    const [result] = await this.pool.query(query, values);

    console.log(result);

    const profileId = result.insertId;
    const profile = await this.getById(profileId);

    return profile;

  }

  public async updateProfile(userId: number, data: ICreateProfileRequest) {

    // @todo: update profile    

  }

  public async deleteProfile(userId: number) {

    // @todo: delete profile

  }

}