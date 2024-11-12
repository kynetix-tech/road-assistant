import { Coordinates, SignItem } from '@/dto/request.dto';
import { Gender } from '@/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RatingResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  recognizedSigns: number;

  @ApiProperty()
  addedComments: number;

  @ApiProperty()
  userId: string;
}

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: Gender;

  @ApiProperty()
  rating: RatingResponse;
}

export class CommentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  text: string;

  @ApiProperty()
  routeId: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  coordinates: Coordinates;
}

export class RouteReportResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  startPoint: Coordinates;

  @ApiProperty()
  endPoint: Coordinates;

  @ApiProperty({ isArray: true, type: SignItem })
  recognizedSigns: Array<SignItem>;

  @ApiProperty()
  userId: string;

  @ApiProperty({ isArray: true, type: CommentResponse })
  comments: Array<CommentResponse>;
}
