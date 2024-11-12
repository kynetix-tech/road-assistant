import { RouteController } from '@/controller/route.controller';
import { RouteFormatter } from '@/formatter/route.formatter';
import { CommentRepository } from '@/repository/comment.repository';
import { RouteRepository } from '@/repository/route.repository';
import { UserRepository } from '@/repository/user.repository';
import { RouteService } from '@/service/route.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RouteController],
  providers: [
    RouteRepository,
    CommentRepository,
    RouteService,
    UserRepository,
    RouteFormatter,
  ],
})
export class RouteModule {}
