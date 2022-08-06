import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CheckAccessGuard } from '../auth/guards/check.access.guard';
import { TokenService } from '../auth/token/token.service';
import { AuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from '../model';
import { AppConfigService } from '../config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UserController],
  providers: [
    UserService,
    TokenService,
    CheckAccessGuard,
    AuthService,
    AppConfigService,
  ],
})
export class UserModule {}
