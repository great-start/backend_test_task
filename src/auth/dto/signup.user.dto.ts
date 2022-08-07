import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsNumber,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { RolesEnum } from '../../models';

export class SignupUserDto {
  @ApiProperty({ example: 'Vanya', description: 'name' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({ example: 'vanyaSidorov@gmail.com', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Vs78SID12nm', description: 'password' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'user role (USER | ADMIN). By default - USER',
  })
  @IsEnum(RolesEnum, {
    message: 'user role must be USER or ADMIN',
  })
  role: RolesEnum;

  @ApiPropertyOptional({
    example: '1',
    description:
      'BossId. Required field if role is USER. Must be conforming to the id existing user. Unnecessary field for ADMIN.',
  })
  @ValidateIf((user) => user.role === 'USER')
  @IsNotEmpty({
    message: 'If role = USER, field bossId is required',
  })
  @IsNumber(
    {},
    {
      message:
        'Field bossId must be a number, corresponding to the id existing user',
    },
  )
  bossId?: number;
}
