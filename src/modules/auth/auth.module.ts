import { Module } from '@nestjs/common';
import { AuthService } from './user/auth.service';
import { AuthController } from './user/auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UtilsModule } from 'src/core/utils/utils.module';
import { JwtStrategy } from './jwt.strategy';
import { ApiKeyStrategy } from './apikey.strategy';
import { LoggerModule } from 'src/core/logger/logger.module';
import { BankAccountModule } from '../bankaccount/bank.account.module';
import { BvnModule } from '../bvn/bvn.module';
import { VerificationController } from './verify/verify.controller';
import { VerifyService } from './verify/verify.service';
import { AdminUsersModule } from '../admin_users/admin.users.module';
import { AdminAuthService } from './admin_user/admin.auth.service';
import { AdminAuthController } from './admin_user/admin.auth.controller';
import { AdminStrategy } from './admin.strategy';

@Module({
  imports: [
    UtilsModule,
    LoggerModule,
    PassportModule,
    BankAccountModule,
    BvnModule,
    UsersModule,
    AdminUsersModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
  }),
],
  providers: [AuthService, VerifyService, AdminAuthService, LocalStrategy, JwtStrategy, ApiKeyStrategy, AdminStrategy],
  controllers: [AdminAuthController, AuthController, VerificationController]
})
export class AuthModule {}
