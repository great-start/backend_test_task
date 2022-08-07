import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { IUser } from '../../user/intefaces';
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
    return this.tokenRepository.save({ accessToken, user: { id: userId } });
  }

  private _generateToken(user: IUser) {
    const payload = { id: user.id, email: user.email.toLowerCase() };
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
  }

  public async verifyToken(token: string) {
    try {
      return jwt.verify(token, this.configService.get('JWT_SECRET_KEY'));
    } catch (e) {
      throw new UnauthorizedException('Token expired');
    }
  }
}
