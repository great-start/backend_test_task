import { Injectable } from '@nestjs/common';

import { IUser } from '../../user/intefaces/user.inteface';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../../models';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  public async getToken(user: IUser) {
    return this._generateToken(user);
  }

  public async saveToken(accessToken: string, userId: number) {
    return this.tokenRepository.create({ accessToken, user: { id: userId } });

    // return this.prismaService.token.create({
    //   data: { userId, accessToken },
    // });
  }

  private _generateToken(user: IUser) {
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_SECRET_KEY'),
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_TIME'),
      },
    );
    return { accessToken, userId: user.id };
  }

  public async findToken(accessToken: string) {
    return this.tokenRepository.findBy({
      accessToken,
    });

    // return this.prismaService.token.findFirst({
    //   where: {
    //     accessToken: token,
    //   },
    // });
  }

  public async verifyToken(token: string) {
    return jwt.verify(token, this.configService.get('JWT_SECRET_KEY'));
  }
}
