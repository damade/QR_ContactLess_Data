import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from 'src/core/utils/utils.module';
import { JwtStrategy } from './jwt.strategy';
import { ApiKeyStrategy } from './apikey.strategy';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [
    UtilsModule,
    LoggerModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
  }),
],
  providers: [AuthService, LocalStrategy, JwtStrategy, ApiKeyStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
