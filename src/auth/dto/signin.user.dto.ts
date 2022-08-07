import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SigninUserDto {
  @ApiProperty({ example: 'vanyaSidorov@gmail.com', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Vs78SID12nm', description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
