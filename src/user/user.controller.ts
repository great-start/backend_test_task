import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CheckAccessGuard } from '../auth/guards/check.access.guard';
import { RolesEnum } from '../auth/enum/roles.enum';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      "Return list off users, taking into account user's role (ADMIN | BOSS | USER)",
    description: 'Get list off users',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        users: [
          {
            id: 1,
            name: 'Vanya',
            email: 'Petrov',
            role: RolesEnum,
            bossId: 1,
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(CheckAccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  getUsersList(@Req() request: IRequestExtended) {
    return this.userService.getUsersList(request);
  }

  @ApiOperation({
    summary:
      'Change user`s boss, taking into account, that endpoint require user with role BOSS',
    description: 'Change user`s boss',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        message:
          'You successfully changed boss for your subordinates! New bossId 23',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(CheckAccessGuard, RolesGuard)
  @Roles(RolesEnum.BOSS)
  @Get('change/:bossId')
  change(
    @Req() request: IRequestExtended,
    @Param('bossId') bossId: string,
    @Res() response: Response,
  ) {
    return this.userService.changeBoss(request, bossId, response);
  }
}
