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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CheckAccessGuard } from '../auth/guards/check.access.guard';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      "Return list off users, taking into account user's role admin, user",
    description: 'Get list off users',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 5,
        name: 'Vanya',
        email: 'Petrov',
        bossId: 1,
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        message: 'Permission denied',
        error: 'Unauthorized',
        statusCode: 401,
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
  @ApiForbiddenResponse({
    status: 403,
    schema: {
      example: {
        message:
          'Forbidden resource. Only for users with subordinates. Not for ADMIN',
        error: 'Forbidden resource',
        statusCode: 403,
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        message: 'Permission denied',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    schema: {
      example: {
        message:
          'User with id - 5 does not exist. Choose another id user for BOSS changing',
        error: 'Bad request',
        statusCode: 400,
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
  @Get('change/:newUserId')
  change(
    @Req() request: IRequestExtended,
    @Param('newUserId') newUserId: string,
    @Res() response: Response,
  ) {
    return this.userService.changeBoss(request, newUserId, response);
  }
}
