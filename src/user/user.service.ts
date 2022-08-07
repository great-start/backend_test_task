import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';

import { SignupUserDto } from '../auth/dto/signup.user.dto';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { SerializeUserDto } from './dto/serialize.user.dto';
import { IUser } from './intefaces/user.inteface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEnum, User } from '../models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: {
        subordinates: true,
        tokens: true,
      },
    });
    //   {
    //   where: {
    //     email,
    //   },
    //   include: {
    //     _count: {
    //       select: {
    //         subordinates: true,
    //       },
    //     },
    //   },
    // }
  }

  async saveUser(user: SignupUserDto): Promise<User> {
    return this.userRepository.save({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      boss: {
        id: user.bossId,
      },
    });
  }

  async findBoss(bossId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: bossId });

    // return this.prismaService.user.findFirst({
    //   where: {
    //     id: bossId,
    //   },
    // });
  }

  async getUsersList(
    request: IRequestExtended,
  ): Promise<SerializeUserDto | SerializeUserDto[]> {
    const { id: userId, role, email } = request.user;

    if (role === RolesEnum.USER) {
      const userData = await this.findOneByEmail(email);

      const countBy = await this.userRepository.find({
        where: {
          id: userId,
        },
        relations: {
          subordinates: true,
        },
      });
      console.log(countBy[0].subordinates.length);
    }
    // const subordinates = userData._count.subordinates;
    // delete userData._count;
    //
    //   if (subordinates === 0) {
    //     return new SerializeUserDto(userData);
    //   } else {
    //     return (await this.prismaService.$queryRaw`
    //         WITH RECURSIVE subordinates AS (
    //             SELECT id, name, email, "bossId" FROM "User" WHERE id = ${+userId}
    //             UNION SELECT u.id, u.name, u.email, u."bossId" FROM "User" u
    //             INNER JOIN subordinates s ON s.id = u."bossId"
    //         ) SELECT * FROM subordinates`) as SerializeUserDto[];
    //   }
    // }

    if (role === RolesEnum.ADMIN) {
      return this.userRepository.find({
        select: {
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        order: { id: 'asc' },
      });
    }

    // return this.prismaService.user.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     password: false,
    //     role: true,
    //     bossId: true,
    //   },
    //   orderBy: {
    //     id: 'asc',
    //   },
    // });
    //   }
    // }

    // async changeBoss(
    //   request: IRequestExtended,
    //   newBossId: string,
    //   response: Response,
    // ) {
    //   const { id: userId, email } = request.user;
    //
    //   const userData = await this.findOneByEmail(email);
    //   const subordinates = userData._count.subordinates;
    //
    //   if (subordinates === 0) {
    //     throw new ForbiddenException(
    //       `Forbidden resource. Only for users with subordinates.`,
    //     );
    //   }
    //
    //   const existingBoss = await this.prismaService.user.findUnique({
    //     where: {
    //       id: +newBossId,
    //     },
    //   });
    //
    //   if (!existingBoss) {
    //     throw new BadRequestException(
    //       `User with id - ${newBossId} does not exist. Choose another id user for BOSS changing`,
    //     );
    //   }
    //
    //   const bossSubordinates = (await this.prismaService.$queryRaw`
    //           WITH RECURSIVE subordinates AS (
    //               SELECT id, name, email, "bossId" FROM "User" WHERE id = ${+userId}
    //               UNION SELECT u.id, u.name, u.email, u."bossId" FROM "User" u
    //               INNER JOIN subordinates s ON s.id = u."bossId"
    //           ) SELECT * FROM subordinates`) as IUser[];
    //
    //   bossSubordinates.forEach((user) => {
    //     if (user.id === +newBossId) {
    //       throw new BadRequestException(
    //         'You can not transfer your BOSS rights to one of your subordinates. Choose another id user for BOSS',
    //       );
    //     }
    //   });
    //
    //   await this.prismaService.user.updateMany({
    //     where: {
    //       bossId: userId,
    //     },
    //     data: {
    //       bossId: +newBossId,
    //     },
    //   });
    //
    //   response.status(200).json({
    //     message: `You successfully changed boss for your subordinates! New bossId - ${newBossId}`,
    //   });
    // }
  }
}
