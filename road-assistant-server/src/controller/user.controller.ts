import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor() {}

  @Get()
  getToken(): string {
    return '';
  }
}
