import { CommentResponse, RouteReportResponse } from '@/dto/responce.dto';
import { CommentModel } from '@/model/comment.model';
import { RouteModel } from '@/model/route.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteFormatter {
  public toCommentResponse(commentModel: CommentModel): CommentResponse {
    return {
      id: commentModel.id,
      createdAt: commentModel.createdAt,
      text: commentModel.text,
      routeId: commentModel.routeId,
      userId: commentModel.userId,
      coordinates: commentModel.coordinates,
    };
  }

  public toRouteResponce(routeModel: RouteModel): RouteReportResponse {
    return {
      id: routeModel.id,
      createdAt: routeModel.createdAt,
      startPoint: routeModel.startPoint,
      endPoint: routeModel.endPoint,
      recognizedSigns: routeModel.recognizedSigns,
      userId: routeModel.userId,
      comments: routeModel.comments.map(this.toCommentResponse.bind(this)),
    };
  }

	public toRoutesResponce(routeModels: Array<RouteModel>): Array<RouteReportResponse> {
		return routeModels.map(this.toRouteResponce.bind(this))
	}
}
