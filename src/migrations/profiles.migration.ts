
import IPool from '../interfaces/pool.interface';

class ProfileMigration {

  private pool: IPool;

  constructor(pool: IPool) {
    this.pool = pool;
  }

  public async createTable() {

    const query = `
      CREATE TABLE profiles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name varchar(255) NOT NULL,
        bio TEXT,
        picture BLOB,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

    const [result] = await this.pool.query(query);
    return result;

  }

  public async dropTable() {

    const query = 'DROP TABLE profiles;';
    const [result] = await this.pool.query(query);
    return result;

  }

}

module.exports = ProfileMigration;