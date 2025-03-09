import IPool from '../interfaces/pool.interfaces';
import IProfile from '../interfaces/profile.interfaces';

const Model = require('./../database/model');

class Profile extends Model {

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

  public async createProfile(userId: number, data: IProfile) {
    
    const query = 'INSERT INTO profiles (user_id, name) VALUES (?, ?);';
    const values = [userId, data.name];

    const [result] = await this.pool.query(query, values);

    const profileId = result.insertId;
    const profile = await this.getById(profileId);

    return profile;

  }

  public async updateProfile(userId: number, data: IProfile) {

    try {

      const profileExists = await this.checkIfProfileExists(userId);

      if (profileExists) {

        const query = [
          'UPDATE profiles',
          'SET name = ?, bio = ?',
          'WHERE user_id = ?'
        ];

        const values: (string|Buffer)[] = [data.name, data.bio];

        if (data.picture) {
          const picture = Buffer.from(data.picture, 'base64');
          values.push(picture);
          query[1] += ', picture = ?';
        }

        const [result] = await this.pool.query(query, values);
        

      }

    } catch (error: unknown) {
      console.error(error);
    }

  }

  public async deleteProfile(userId: number) {

    try {

      const profileExists = await this.checkIfProfileExists(userId);

      if (profileExists) {
        const query = 'DELETE FROM profiles WHERE user_id = ?;';
        const [result] = await this.pool.query(query, [userId]);
        return true;
      }

      throw new Error('Profile does not exists.');

    } catch (error: unknown) {
      console.error(error);
    }

  }

  public async checkIfProfileExists(userId: number) {

    const query = 'SELECT EXISTS (SELECT * FROM profiles WHERE user_id = ?) AS profileExists;';
    const [result] = await this.pool.query(query, [userId]);

    if (result.length > 0) return Boolean(result[0].profileExists);
    throw new Error('Could not verify if profile exists or not.');

  }

}

module.exports = Profile;