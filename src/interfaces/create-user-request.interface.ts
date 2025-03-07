import ICreateProfileRequest from './create-profile-request.interface';

export default interface ICreateUserRequest extends ICreateProfileRequest {
  email: string,
  password: string,
}