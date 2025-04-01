
import bcrypt from 'bcrypt';

class BcryptService {

  hashPassword(password: string, saltRounds: number = 10) {
    return bcrypt.hash(password, saltRounds);
  }

  comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

}

export const bcryptService = new BcryptService();