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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
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
      "Return list off users, taking into account user's role admin, boss, user",
    description: 'Get list off users',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        name: 'Vanya',
        email: 'Petrov',
        role: 'USER',
        bossId: 1,
        subordinates: [],
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Permission denied',
        error: 'Unauthorized',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        status: 500,
        error: 'Server error',
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
      'Change user`s boss, taking into account, that endpoint require user with role USER and who has subordinates',
    description: 'Change user`s boss',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        message:
          'You successfully changed boss for your subordinates! New bossId 23',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      example: {
        status: 500,
        error: 'Server error',
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(CheckAccessGuard, RolesGuard)
  @Roles(RolesEnum.USER)
  @Get('change/:bossId')
  change(
    @Req() request: IRequestExtended,
    @Param('bossId') bossId: string,
    @Res() response: Response,
  ) {
    return this.userService.changeBoss(request, bossId, response);
  }
}
