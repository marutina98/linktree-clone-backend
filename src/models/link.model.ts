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

  public async createLink() {

  }

  public async updateLink() {

  }

  public async deleteLink() {

  }

}