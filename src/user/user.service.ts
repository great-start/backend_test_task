import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Response } from 'express';

import { PrismaService } from '../prisma.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { RolesEnum } from '../auth/enum/roles.enum';
import { SerializeUserDto } from './dto/serialize.user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async saveUserToDB(user: CreateAuthDto) {
    return this.prismaService.user.create({ data: user });
  }

  async getUsersList(
    request: IRequestExtended,
  ): Promise<SerializeUserDto | SerializeUserDto[]> {
    try {
      const { id: userId, role } = request.user;

      if (role === RolesEnum.USER) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
        });
        return new SerializeUserDto(user);
      }

      if (role === RolesEnum.BOSS) {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            subordinates: {
              include: {
                subordinates: {
                  include: {
                    subordinates: true,
                  },
                },
              },
            },
          },
        });
        return new SerializeUserDto(user);
      }

      if (role === RolesEnum.ADMIN) {
        return this.prismaService.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            password: false,
            role: true,
            bossId: true,
          },
        });
      }
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async changeBoss(
    request: IRequestExtended,
    changeBossId: string,
    response: Response,
  ) {
    try {
      const { id } = request.user;

      const existingBoss = await this.prismaService.user.findUnique({
        where: {
          id: +changeBossId,
        },
      });

      if (!existingBoss) {
        throw new BadRequestException(
          `Boss with id ${changeBossId} does not exist. You can not change your subordinates boss` ,
        );
      }

      await this.prismaService.user.updateMany({
        where: {
          bossId: id,
        },
        data: {
          bossId: +changeBossId,
        },
      });

      response.status(200).json({
        message: `You successfully changed boss for your subordinates! New bossId ${changeBossId}`,
      });
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
