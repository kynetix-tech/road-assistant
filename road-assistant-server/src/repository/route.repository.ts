import { RouteEntity } from '@/entity/route.entity';
import { RouteModel } from '@/model/route.model';
import { CommentRepository } from '@/repository/comment.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RouteRepository {
  private repository: Repository<RouteEntity>;

  constructor(private manager: EntityManager) {
    this.repository = this.manager.getRepository(RouteEntity);
  }

  public static toRouteModel(routeEntity: RouteEntity): RouteModel {
    return new RouteModel(
      routeEntity.text,
      routeEntity.startPoint,
      routeEntity.endPoint,
      routeEntity.recognizedSigns,
      routeEntity.userId,
      routeEntity.id,
      routeEntity.createdAt,
      routeEntity.comments.map(CommentRepository.toCommentModel),
    );
  }

  public async createRoute(routeModel: RouteModel): Promise<number> {
    const { raw } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(RouteEntity)
      .values({
        text: routeModel.text,
        startPoint: routeModel.startPoint,
        endPoint: routeModel.endPoint,
        recognizedSigns: routeModel.recognizedSigns,
        userId: routeModel.userId,
      })
      .execute();

    return raw[0].id;
  }

  public async getAllRoutesWithCommentsByUserId(
    userId: string,
  ): Promise<Array<RouteModel>> {
    const routeEntities = await this.repository
      .createQueryBuilder('route')
      .where('route.user_id = :userId', { userId })
      .leftJoinAndSelect('route.comments', 'comments')
      .getMany();

    return routeEntities.map(RouteRepository.toRouteModel);
  }
}
