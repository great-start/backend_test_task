import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';
import { CheckAccessGuard } from '../auth/guards/check.access.guard';
import { TokenService } from '../auth/token/token.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    TokenService,
    CheckAccessGuard,
    AuthService,
  ],
})
export class UserModule {}
