import { ApplicationError } from '@/common/application.error';
import { UserRegisterRequest } from '@/dto/request.dto';
import { RatingModel } from '@/model/rating.model';
import { UserModel } from '@/model/user.model';
import { RatingRepository } from '@/repository/rating.repository';
import { UserRepository } from '@/repository/user.repository';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ratingRepository: RatingRepository,
  ) {}

  public async upsertUser(
    user: UserRegisterRequest,
    auth0Id: string,
  ): Promise<UserModel> {
    const existingUser = await this.userRepository.getByAuth0Id(auth0Id);

    const userModel = new UserModel(
      auth0Id,
      user.email,
      user.firstName,
      user.lastName,
      user.gender,
    );

    let id: string;
    if (existingUser) {
      id = await this.userRepository.update(userModel);
    } else {
      id = await this.userRepository.register(userModel);
      const ratingModel = new RatingModel(0, 0, auth0Id);
      await this.ratingRepository.createNewRatingRecord(ratingModel);
    }

    const newUser = await this.userRepository.getByAuth0Id(id);
    return newUser;
  }

  public async getById(userId: string): Promise<UserModel> {
    const user = await this.userRepository.getByAuth0Id(userId);

    if (!user) {
      throw new UserNotExistsError(
        `User with id: ${userId} not exists in server db`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}

export class UserNotExistsError extends ApplicationError {}
