import IProfile from './profile.interface';

export default interface IUser {
  id: number,
  email: string,
  password: string,
  profile?: IProfile
}