import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInAuthDto } from './dto/signIn-auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user using data',
    description: 'Registration',
  })
  @ApiOkResponse({
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
        status: 400,
        error: 'User already exists',
        message: [
          'name must be longer than or equal to 3 characters',
          'password must be longer than or equal to 3 characters',
        ],
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
  @ApiBody({ type: CreateAuthDto })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({
    summary: 'Sign in using email, password',
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
  @ApiBadRequestResponse({
    schema: {
      example: {
        status: 400,
        error: 'Wrong email or password',
        message: '',
      },
    },
  })
  @ApiBody({ type: SignInAuthDto })
  @Post('signIn')
  signIn(@Body() user: SignInAuthDto) {
    return this.authService.signIn(user);
  }
}
