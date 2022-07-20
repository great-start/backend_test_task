import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../enum/roles.enum';

export class CreateAuthDto {
  @ApiProperty({ example: 'Vanya', description: 'name' })
  @IsString()
  @IsNotEmpty()
  @Length(3)
  name: string;

  @ApiProperty({ example: 'vanyaSidorov@gmail.com', description: 'user email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Vs78SID12nm', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @Length(2)
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'user role (USER | BOSS | ADMIN). By default - USER',
  })
  role?: RolesEnum;

  @ApiProperty({
    example: '1',
    description:
      'BossId. Required field if role is USER or BOSS. Unnecessary for ADMIN',
  })
  @ValidateIf((o) => o.role !== 'ADMIN')
  @IsNotEmpty({
    message: 'If role = USER or BOSS, field bossId is required',
  })
  @IsNumber(
    {},
    {
      message: 'Field bossId must be a number, conforming to the existing user',
    },
  )
  bossId?: number;
}
