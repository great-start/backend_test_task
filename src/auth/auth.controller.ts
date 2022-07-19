import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user using data',
    description: 'registration',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        token: 'asd234vdce5te5b123vqfve5tb5tasdcawvwrvergewefvwefvwcefwv',
      },
    },
  })
  @ApiBody({ type: CreateAuthDto })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({
    summary: 'Sign in using email, password, and accessToken in request headers',
    description: 'registration',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        accessToken: 'asd234vdce5te5b123vqfve5tb5t',
      },
    },
  })
  @ApiBody({ type: CreateAuthDto })
  @Post('register')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }


  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
