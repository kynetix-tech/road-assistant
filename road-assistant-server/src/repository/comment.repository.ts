import { CommentEntity } from '@/entity/comment.entity';
import { CommentModel } from '@/model/comment.model';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CommentRepository {
  private repository: Repository<CommentEntity>;

  constructor(private manager: EntityManager) {
    this.repository = this.manager.getRepository(CommentEntity);
  }

  public static toCommentModel(commentEntity: CommentEntity): CommentModel {
    return new CommentModel(
      commentEntity.text,
      commentEntity.routeId,
      commentEntity.userId,
      commentEntity.coordinates,
      commentEntity.id,
      commentEntity.createdAt,
    );
  }

  public async createComments(
    commentModels: Array<CommentModel>,
  ): Promise<string> {
    const { raw } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values(
        commentModels.map((commentModel) => ({
          text: commentModel.text,
          routeId: commentModel.routeId,
          userId: commentModel.userId,
          coordinates: commentModel.coordinates,
        })),
      )
      .execute();

    return raw[0].id;
  }
}
