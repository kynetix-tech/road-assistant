import { Gender } from '../entity/user.entity';

export class UserModel {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: Gender,
  ) {}
}
