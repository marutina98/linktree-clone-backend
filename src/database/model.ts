import IPool from '../interfaces/pool.interface';

class Model {

  protected pool: IPool;

  constructor(pool: IPool) {
    this.pool = pool;
  }

}

module.exports = Model;