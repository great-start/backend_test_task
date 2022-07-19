import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  // findAll() {
  //   return `This action returns all auth`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }

  async register(user: CreateAuthDto) {
    try {
      const existingUser = await this.userService.findOneByEmail(user.email);

      if (existingUser) {
        throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
      }

      const hashPass = await bcrypt.hash(user.password, 5);
      const savedUser = await this.userService.saveUserToDB({
        ...user,
        password: hashPass,
      });

      const { accessToken, userId } = await this.tokenService.getToken(
        savedUser,
      );

      const { accessToken: token } = await this.tokenService.saveToken(
        accessToken,
        userId,
      );

      return {
        token,
      };
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
