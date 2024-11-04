import { UserController } from '@/controller/user.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
