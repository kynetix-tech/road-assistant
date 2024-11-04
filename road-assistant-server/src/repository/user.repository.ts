import { UserEntity } from '@/entity/user.entity';
import { UserModel } from '@/model/user.model';
import { Injectable } from '@nestjs/common';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserRepository {
  private queryBuilder: SelectQueryBuilder<UserEntity>;

  constructor(private manager: EntityManager) {
    this.queryBuilder = this.manager
      .getRepository(UserEntity)
      .createQueryBuilder('user');
  }

  public static toUserModel(userEntity?: UserEntity): UserModel {
    return new UserModel(
      userEntity.id,
      userEntity.email,
      userEntity.firstName,
      userEntity.lastName,
      userEntity.gender,
    );
  }

  public async getByAuth0Id(auth0Id: string): Promise<UserModel> {
    const userEntity = await this.queryBuilder
      .where('auth0_id = :auth0Id', { auth0Id })
      .getOne();

    if (userEntity) return UserRepository.toUserModel(userEntity);
  }

  public async register(user: UserModel): Promise<string> {
    const { raw } = await this.queryBuilder
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
}
