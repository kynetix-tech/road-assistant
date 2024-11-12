import { AuthModule } from '@/auth/auth.module';
import { configuration } from '@/config/configuration';
import { DatabaseConfig } from '@/config/interface';
import { AppController } from '@/controller/app.controller';
import { RouteModule } from '@/module/route.module';
import { UserModule } from '@/module/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<DatabaseConfig>('db'),
    }),
    AuthModule,
    UserModule,
    RouteModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
