import IProfile from './profile.interfaces';

export default interface IUser {
  id: number,
  email: string,
  password: string,
  profile?: IProfile
}