import { Request } from 'express';

export interface UserJwtInfo {
  auth0Id: string;
}
export interface RequestWithAuth extends Request {
  user: UserJwtInfo;
}
