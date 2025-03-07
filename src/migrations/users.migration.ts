
import IPool from '../interfaces/pool.interface';

class UserMigration {

  private pool: IPool;

  constructor(pool: IPool) {
    this.pool = pool;
  }

  public async createTable() {

    const query = `
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL UNIQUE
      );
    `;

    const [result] = await this.pool.query(query);
    return result;

  }

  public async dropTable() {

    const query = 'DROP TABLE users;';
    const [result] = await this.pool.query(query);
    return result;

  }

}

module.exports = UserMigration;