
import IPool from '../interfaces/pool.interface';

class LinksMigration {

  private pool: IPool;

  constructor(pool: IPool) {
    this.pool = pool;
  }

  public async createTable() {

    const query = `
      CREATE TABLE links (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255),
        icon VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    const [result] = await this.pool.query(query);
    return result;

  }

  public async dropTable() {

    const query = 'DROP TABLE links;';
    const [result] = await this.pool.query(query);
    return result;

  }

}

module.exports = LinksMigration;