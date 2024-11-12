import { RequestWithAuth } from '@/common/interfaces/auth-request.iterface';
import { RouteReportRequest } from '@/dto/request.dto';
import { RouteReportResponse } from '@/dto/responce.dto';
import { RouteFormatter } from '@/formatter/route.formatter';
import { RouteService } from '@/service/route.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Route')
@ApiBearerAuth('authorization')
@UseGuards(AuthGuard('jwt'))
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService, private readonly routeFormatter: RouteFormatter) {}

  @Post('route-report')
  @HttpCode(HttpStatus.CREATED)
  public async addNewReport(
    @Body() body: RouteReportRequest,
    @Req() { user }: RequestWithAuth,
  ): Promise<number> {
    const { auth0Id } = user;
    const newRouteReport = await this.routeService.addRouteReport(
      body,
      auth0Id,
    );

    return newRouteReport;
  }

  @Get('routes')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: RouteReportResponse, isArray: true })
  public async getRoutesForUser(
    @Req() { user }: RequestWithAuth,
  ) :Promise<Array<RouteReportResponse>> {
    const { auth0Id } = user;
    const routes = await this.routeService.getAllRoutesForUser(auth0Id);

    return this.routeFormatter.toRoutesResponce(routes);
  }
}
