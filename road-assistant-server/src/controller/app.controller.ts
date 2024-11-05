import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Get('public')
  getPublic(): string {
    return 'public';
  }

  @Get('private')
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard('jwt'))
  getPrivate(): string {
    return 'private';
  }
}
