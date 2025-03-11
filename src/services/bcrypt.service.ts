
import bcrypt from 'bcrypt';

class BcryptService {

  async hashPassword(password: string, saltRounds: number = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

}

export const bcryptService = new BcryptService();