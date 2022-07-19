import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthDto {
  @ApiProperty({ example: 'vanyaSidorov@gmail.com', description: 'user email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Vs78SID12nm', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}
