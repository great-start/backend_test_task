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
    summary: 'Sign up user using SignupUserDto template',
    description: 'Registration',
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
        message: [
          'name must be longer than or equal to 3 characters',
          'password must be longer than or equal to 3 characters',
        ],
        error: 'User already exists',
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
  @ApiBody({ type: SignupUserDto })
  @Post('signup')
  signup(@Body() createAuthDto: SignupUserDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({
    summary: 'Sign in using SigninUserDto template',
    description: 'Sign in',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        token: 'asd234vdce5te5b123vqfve5tb5tc,2308mv0298mcv23v34v45cewcc3c',
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        message: 'Wrong email or password',
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
  @ApiBody({ type: SigninUserDto })
  @Post('signin')
  signin(@Body() user: SigninUserDto, @Res() res: Response) {
    return this.authService.signIn(user, res);
  }
}
