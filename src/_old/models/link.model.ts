import ICreateLinkRequest from '../interfaces/create-link-request.interfaces';
import IPool from '../interfaces/pool.interfaces';

const Model = require('./../database/model');

class LinkModel extends Model {
 
  constructor(pool: IPool) {
    super(pool);
  }

  public async getLinks() {
    const query = 'SELECT * FROM links;';
    const [result] = await this.pool.query(query);
    return result;
  }

  public async getLinkById(id: number) {
    const query = 'SELECT * FROM links WHERE id = ?;';
    const [result] = await this.pool.query(query, [id]);
    return result;
  }

  public async getLinksByUserId(userId: number) {
    const query = 'SELECT * FROM links WHERE user_id = ?;';
    const [result] = await this.pool.query(query, [userId]);
    return result;
  }

  public async createLink(userId: number, data: ICreateLinkRequest) {

  }

  public async updateLink(userId: number, data: ICreateLinkRequest) {

  }

  public async deleteLink(id: number) {

    try {

      const linkExists = await this.checkIfLinkExists(id);

      if (linkExists) {
        const query = 'SELECT * FROM links WHERE user_id = ?;';
        const [result] = await this.pool.query(query, [id]);
        return true;
      }

      throw new Error('Link does not exists.');

    } catch (error: unknown) {
      console.error(error);
    }
    
  }

  public async checkIfLinkExists(id: number) {
    const query = 'SELECT EXISTS (SELECT * FROM links WHERE id = ?) AS linkExists;';
    const [result] = await this.pool.query(query, [id]);
    if (result.length > 0) return Boolean(result[0].linkExists);
    throw new Error('Could not verify if links exists or not.');
  }

}