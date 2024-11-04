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
