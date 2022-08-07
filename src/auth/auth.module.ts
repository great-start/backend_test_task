import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token/token.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from '../models';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [AuthController],
  providers: [AuthService, UserService, TokenService],
})
export class AuthModule {}
