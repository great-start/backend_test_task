import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';

import { PrismaService } from '../prisma.service';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { RolesEnum } from '../auth/enum/roles.enum';
import { SerializeUserDto } from './dto/serialize.user.dto';
import { IUser } from './intefaces/user.inteface';

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
      include: {
        _count: {
          select: {
            subordinates: true,
          },
        },
      },
    });
  }

  async saveUserToDB(user: RegisterAuthDto) {
    return this.prismaService.user.create({ data: user });
  }

  async findBoss(bossId: number) {
    return this.prismaService.user.findFirst({
      where: {
        id: bossId,
      },
    });
  }

  async getUsersList(
    request: IRequestExtended,
  ): Promise<SerializeUserDto | SerializeUserDto[]> {
    try {
      const { id: userId, role, email } = request.user;

      if (role === RolesEnum.USER) {
        const userData = await this.findOneByEmail(email);
        const subordinates = userData._count.subordinates;
        delete userData._count;

        if (subordinates === 0) {
          return new SerializeUserDto(userData);
        } else {
          return (await this.prismaService.$queryRaw`
            WITH RECURSIVE subordinates AS (
                SELECT id, name, email, "bossId" FROM "User" WHERE id = ${+userId} 
                UNION SELECT u.id, u.name, u.email, u."bossId" FROM "User" u 
                INNER JOIN subordinates s ON s.id = u."bossId"
            ) SELECT * FROM subordinates`) as SerializeUserDto[];
        }
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
          orderBy: {
            id: 'asc',
          },
        });
      }
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

  async changeBoss(
    request: IRequestExtended,
    newBossId: string,
    response: Response,
  ) {
    try {
      const { id: userId, email } = request.user;

      const userData = await this.findOneByEmail(email);
      const subordinates = userData._count.subordinates;

      if (subordinates === 0) {
        throw new ForbiddenException(
          `Forbidden resource. Only for users with subordinates.`,
        );
      }

      const existingBoss = await this.prismaService.user.findUnique({
        where: {
          id: +newBossId,
        },
      });

      if (!existingBoss) {
        throw new BadRequestException(
          `User with id - ${newBossId} does not exist. Choose another id user for BOSS changing`,
        );
      }

      const bossSubordinates = (await this.prismaService.$queryRaw`
            WITH RECURSIVE subordinates AS (
                SELECT id, name, email, "bossId" FROM "User" WHERE id = ${+userId} 
                UNION SELECT u.id, u.name, u.email, u."bossId" FROM "User" u 
                INNER JOIN subordinates s ON s.id = u."bossId"
            ) SELECT * FROM subordinates`) as IUser[];

      bossSubordinates.forEach((user) => {
        if (user.id === +newBossId) {
          throw new BadRequestException(
            'You can not transfer your BOSS rights to one of your subordinates. Choose another id user for BOSS',
          );
        }
      });

      await this.prismaService.user.updateMany({
        where: {
          bossId: userId,
        },
        data: {
          bossId: +newBossId,
        },
      });

      response.status(200).json({
        message: `You successfully changed boss for your subordinates! New bossId - ${newBossId}`,
      });
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
}
