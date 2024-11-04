import { RequestWithAuth } from '@/common/interfaces/auth-request.iterface';
import { UserRegisterRequest } from '@/dto/request.dto';
import { UserResponse } from '@/dto/responce.dto';
import { UserFormatter } from '@/formatter/user.formatter';
import { UserService } from '@/service/user.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userFormatter: UserFormatter,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponse })
  public async register(
    @Body() body: UserRegisterRequest,
    @Req() { user }: RequestWithAuth,
  ): Promise<UserResponse> {
    const { auth0Id } = user;
    const newUser = await this.userService.upsertUser(body, auth0Id);

    return this.userFormatter.toUserResponse(newUser);
  }
}
