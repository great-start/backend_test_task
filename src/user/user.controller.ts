import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CheckAccessGuard } from '../auth/guards/check.access.guard';

import { RolesEnum } from '../auth/enum/roles.enum';

@ApiTags('User')
@Controller('user')
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
            name: 'Vanya',
            email: 'Petrov',
            password: 'ciSB37678dhSUQBS',
            role: RolesEnum,
            bossId: 1,
          },
        ],
      },
    },
  })
  @UseGuards(CheckAccessGuard)
  @Get('/')
  getUsersList(@Request() request: IRequestExtended) {
    return this.userService.getUsersList(request);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  //
  //
  // @Get('/:id')
  // getUsers(@Param('id') id: string) {
  //   return this.userService.getAll(+id);
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
