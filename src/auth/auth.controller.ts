import { Controller, Post, Body, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SignupUserDto } from './dto/signup.user.dto';
import { SigninUserDto } from './dto/signin.user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign up',
    description: 'Sign up using SignupUserDto schema',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        token: 'asd234vdce5te5b123vqfve5tb5tasdcawvwrvergewefvwefvwcefwv',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name must be longer than or equal to 3 characters',
          'name should not be empty',
          'name must be a string',
          'email should not be empty',
          'email must be an email',
          'password must be longer than or equal to 3 characters',
          'password should not be empty',
          'password must be a string',
          'user role must be USER or ADMIN',
        ],
        error: 'Bad Request',
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
  @ApiBody({ type: SignupUserDto })
  @Post('sign-up')
  signUp(@Body() createAuthDto: SignupUserDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({
    summary: 'Sign in',
    description: 'Sign in using SigninUserDto schema',
  })
  @ApiOkResponse({
    schema: {
      example: {
        token: 'asd234vdce5te5b123vqfve5tb5tc,2308mv0298mcv23v34v45cewcc3c',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Wrong email or password',
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
  @ApiBody({ type: SigninUserDto })
  @Post('sign-in')
  signIn(@Body() user: SigninUserDto, @Res() res: Response) {
    return this.authService.signIn(user, res);
  }
}
