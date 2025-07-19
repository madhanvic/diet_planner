import { Request } from 'express';
import { IUser } from './user';

export interface ProtectedRequest extends Request {
  user?: IUser;
}