import ICreateProfileRequest from './profile.interface';

export default interface ICreateUserRequest extends ICreateProfileRequest {
  email: string,
  password: string,
}