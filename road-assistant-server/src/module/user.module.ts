import { UserController } from '@/controller/user.controller';
import { UserFormatter } from '@/formatter/user.formatter';
import { RatingRepository } from '@/repository/rating.repository';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/service/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserRepository, UserService, UserFormatter, RatingRepository],
})
export class UserModule {}
