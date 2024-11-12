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
