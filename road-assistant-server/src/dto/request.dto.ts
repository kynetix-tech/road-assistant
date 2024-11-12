import { Gender } from '@/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: Gender;
}

export class Coordinates {
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}

export class SignItem {
  @ApiProperty()
  coordinates: Coordinates;

  @ApiProperty()
  signClass: string;
}

export class CommentRequest {
  @ApiProperty()
  text: string;

  @ApiProperty()
  coordinates: Coordinates;
}

export class RouteReportRequest {
  @ApiProperty()
  startPoint: Coordinates;

  @ApiProperty()
  endPoint: Coordinates;

  @ApiProperty({ isArray: true, type: SignItem })
  recognizedSigns: Array<SignItem>;

  @ApiProperty({ isArray: true, type: CommentRequest })
  comments: Array<CommentRequest>;
}
