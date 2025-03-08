import ICreateProfileRequest from './profile.interfaces';

export default interface ICreateUserRequest extends ICreateProfileRequest {
  email: string,
  password: string,
}