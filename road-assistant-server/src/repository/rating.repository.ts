import { RatingEntity } from '@/entity/rating.entity';
import { RatingModel } from '@/model/rating.model';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RatingRepository {
  private repository: Repository<RatingEntity>;

  constructor(private manager: EntityManager) {
    this.repository = this.manager.getRepository(RatingEntity);
  }

  public static toRatingModel(ratingEntity?: RatingEntity): RatingModel {
    return new RatingModel(
      ratingEntity.recognizedSigns,
      ratingEntity.addedComments,
      ratingEntity.userId,
      ratingEntity.id,
    );
  }

  public getByUserId(userId: string): Promise<RatingModel> {
    const ratingEntity = this.repository
      .createQueryBuilder('rating')
      .where('rating.user_id = :userId', { userId })
      .getOne();

    return ratingEntity;
  }

  public async createNewRatingRecord(rating: RatingModel): Promise<string> {
    const { raw } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(RatingEntity)
      .values({
        accuracy: 1,
        recognizedSigns: rating.recognizedSigns,
        addedComments: rating.addedComments,
        userId: rating.userId,
      })
      .returning(['id'])
      .execute();

    return raw[0].id;
  }
}
