import { UserRegisterRequest } from '@/dto/request.dto';
import { UserModel } from '@/model/user.model';
import { UserRepository } from '@/repository/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async upsertUser(
    user: UserRegisterRequest,
    auth0Id: string,
  ): Promise<UserModel> {
    const existingUser = await this.userRepository.getByAuth0Id(auth0Id);
    if (existingUser) {
      return existingUser;
    }

    const userModel = new UserModel(
      auth0Id,
      user.email,
      user.firstName,
      user.lastName,
      user.gender,
    );

    const id = await this.userRepository.register(userModel);
    return await this.userRepository.getByAuth0Id(id);
  }
}
