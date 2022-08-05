import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { IUser } from '../../user/intefaces/user.inteface';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  public async getToken(user: IUser) {
    return this._generateToken(user);
  }

  public async saveToken(accessToken: string, userId: number) {
    return this.prismaService.token.create({
      data: { userId, accessToken },
    });
  }

  private _generateToken(user: IUser) {
    const jwt_key = this.configService.get('JWT_SECRET_KEY');
    const jwt_time = this.configService.get('JWT_ACCESS_TOKEN_TIME');

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, jwt_key, {
      expiresIn: jwt_time,
    });
    return { accessToken, userId: user.id };
  }

  public async findToken(token: string) {
    return this.prismaService.token.findFirst({
      where: {
        accessToken: token,
      },
    });
  }

  public async verifyToken(token: string) {
    const jwt_key = this.configService.get('JWT_SECRET_KEY');

    return jwt.verify(token, jwt_key);
  }
}
