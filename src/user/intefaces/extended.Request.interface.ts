import { IUser } from './user.inteface';

export interface IRequestExtended extends Request {
  user: IUser;
}
