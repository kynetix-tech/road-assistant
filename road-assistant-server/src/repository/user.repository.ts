import { UserEntity } from '@/entity/user.entity';
import { UserModel } from '@/model/user.model';
import { RatingRepository } from '@/repository/rating.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  private repository: Repository<UserEntity>;

  constructor(private manager: EntityManager) {
    this.repository = this.manager.getRepository(UserEntity);
  }

  public static toUserModel(userEntity?: UserEntity): UserModel {
    return new UserModel(
      userEntity.id,
      userEntity.email,
      userEntity.firstName,
      userEntity.lastName,
      userEntity.gender,
      RatingRepository.toRatingModel(userEntity.rating),
    );
  }

  public async getByAuth0Id(auth0Id: string): Promise<UserModel> {
    const userEntity = await this.repository
      .createQueryBuilder('user')
      .where('user.auth0_id = :auth0Id', { auth0Id })
      .leftJoinAndSelect('user.rating', 'rating')
      .getOne();

    if (userEntity) return UserRepository.toUserModel(userEntity);
  }

  public async register(user: UserModel): Promise<string> {
    const { raw } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      })
      .returning(['id'])
      .execute();

    return raw[0].auth0_id;
  }

  public async update(user: UserModel): Promise<string> {
    this.repository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      })
      .where('auth0_id = :auth0Id', { auth0Id: user.id })
      .execute();

    return user.id;
  }
}
