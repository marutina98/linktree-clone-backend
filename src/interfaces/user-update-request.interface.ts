export default interface IUserCreateRequest {
  id: number,
  email?: string,
  password?: string,
  name?: string,
  biography?: string,
  picture?: string,
}