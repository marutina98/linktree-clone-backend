import IPool from '../interfaces/pool.interface';

class Model {

  protected pool: IPool;

  constructor(pool: IPool) {
    this.pool = pool;
  }

}

export default Model;