import { ApplicationError } from '@/common/application.error';
import { RouteReportRequest } from '@/dto/request.dto';
import { CommentModel } from '@/model/comment.model';
import { RouteModel } from '@/model/route.model';
import { CommentRepository } from '@/repository/comment.repository';
import { RouteRepository } from '@/repository/route.repository';
import { UserRepository } from '@/repository/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly routeRepository: RouteRepository,
  ) {}

  public async addRouteReport(
    routeRequest: RouteReportRequest,
    auth0Id: string,
  ) {
    const existingUser = await this.userRepository.getByAuth0Id(auth0Id);
    if (!existingUser)
      throw new UserNotFoundAtAppDb(
        'User does not exist at appication db, please register',
      );

    const routeModel = new RouteModel(
      'route-report',
      routeRequest.startPoint,
      routeRequest.endPoint,
      routeRequest.recognizedSigns,
      auth0Id,
    );

    const routeId = await this.routeRepository.createRoute(routeModel);

		if (routeRequest.comments && routeRequest.comments.length > 0) {
			const commentModels = routeRequest.comments.map((comment) => new CommentModel(
				comment.text, routeId, auth0Id, comment.coordinates
			));

			await this.commentRepository.createComments(commentModels);
		}

    return routeId;
  }

	public async getAllRoutesForUser(auth0Id: string): Promise<Array<RouteModel>> {
		const existingUser = await this.userRepository.getByAuth0Id(auth0Id);
    if (!existingUser)
      throw new UserNotFoundAtAppDb(
        'User does not exist at appication db, please register',
      );

		const routes = await this.routeRepository.getAllRoutesWithCommentsByUserId(auth0Id);

		return routes;
	}
}

export class UserNotFoundAtAppDb extends ApplicationError {}
