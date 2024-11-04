import { Injectable } from '@nestjs/common';
import { UserResponse } from '../dto/responce.dto';
import { UserModel } from '../model/user.model';

@Injectable()
export class UserFormatter {
  public toUserResponse(user: UserModel): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
    };
  }
}
