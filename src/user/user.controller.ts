import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
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
import { IRequestExtended } from './intefaces';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get users',
    description:
      'Return - one user (user without subordinates), list of users (boss), all users (admin)',
  })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 5,
          name: 'Vanya',
          email: 'Petrov',
          createdAt: new Date(),
          bossId: 1,
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Permission denied. Token not valid',
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
  @UseGuards(CheckAccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  getUsersList(@Req() request: IRequestExtended) {
    return this.userService.getUsersList(request);
  }

  @ApiOperation({
    summary: 'Change user`s boss',
    description:
      'Change user`s boss, taking into account, that endpoint require user with role USER and who has subordinates',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'You successfully changed boss for your subordinates! New bossId 23',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource. Only for users with subordinates',
        error: 'Forbidden resource',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Permission denied. Token not valid',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'User with id 2 is not your subordinate or does not exist',
        error: 'Bad request',
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
  @UseGuards(CheckAccessGuard)
  @Post('/change')
  changeUserBoss(
    @Req() request: IRequestExtended,
    @Query('subordinateId') subordinateId: number,
    @Query('newBossId') newBossId: number,
    @Res() response: Response,
  ) {
    return this.userService.changeUserBoss(
      request,
      subordinateId,
      newBossId,
      response,
    );
  }
}
