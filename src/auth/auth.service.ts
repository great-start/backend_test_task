import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { TokenService } from './token/token.service';
import { SignInAuthDto } from './dto/signIn-auth.dto';
import { RolesEnum } from './enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  public async register(user: CreateAuthDto) {
    try {
      const existingUser = await this.userService.findOneByEmail(user.email);

      if (existingUser) {
        throw new BadRequestException('User already exist');
      }

      if (user.role !== RolesEnum.ADMIN) {
        const existingBoss = await this.userService.findBoss(user.bossId);

        if (!existingBoss) {
          throw new BadRequestException(
            `User with ${user.bossId} does not exist. Put existing related bossId`,
          );
        }
      }

      const hashPass = await bcrypt.hash(user.password, 5);
      const savedUser = await this.userService.saveUserToDB({
        ...user,
        password: hashPass,
        bossId:
          user.role === RolesEnum.ADMIN && user.bossId ? null : user.bossId,
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
      throw new HttpException(
        {
          message: e.response?.message,
          error: e.response?.error,
          statusCode: e.response?.statusCode,
        },
        e.status,
      );
    }
  }

  public async signIn(user: SignInAuthDto, res: Response) {
    try {
      const existingUser = await this._validateUser(user);

      const { accessToken } = await this.tokenService.getToken(existingUser);

      const { accessToken: token } = await this.tokenService.saveToken(
        accessToken,
        existingUser.id,
      );

      res.status(200).json({ token });
    } catch (e) {
      throw new HttpException(
        {
          message: e.response?.message,
          error: e.response?.error,
          statusCode: e.response?.statusCode,
        },
        e.status,
      );
    }
  }

  private async _validateUser(user: SignInAuthDto) {
    const existingUser = await this.userService.findOneByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('Wrong password or email');
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Wrong password or email');
    }

    return existingUser;
  }

  async checkAccess(request: Request) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No token');
      }
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('No token');
      }

      const tokenData = await this.tokenService.findToken(token);

      if (!tokenData) {
        throw new UnauthorizedException('Permission denied');
      }

      const { email } = await this.tokenService.verifyToken(token);
      const existingUser = await this.userService.findOneByEmail(email);

      if (!existingUser) {
        throw new UnauthorizedException('Permission denied');
      }

      return existingUser;
    } catch (e) {
      throw new HttpException(
        {
          message: e.response?.message,
          error: e.response?.error,
          statusCode: e.response?.statusCode,
        },
        e.message,
      );
    }
  }
}
