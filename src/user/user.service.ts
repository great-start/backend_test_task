import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { IRequestExtended } from './intefaces/extended.Request.interface';
import { RolesEnum } from '../auth/enum/roles.enum';

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

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async getUsersList(request: IRequestExtended) {
    try {
      const { id: userId, role } = request.user;

      if (role === RolesEnum.USER) {
        return this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
        });
      }

      if (role === RolesEnum.BOSS) {
        return this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
        });
      }

      if (role === RolesEnum.ADMIN) {
        return this.prismaService.user.findMany();
      }
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
