import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';

import { SignupUserDto } from '../auth/dto/signup.user.dto';
import { IRequestExtended } from './intefaces';
import { SerializeUserDto } from './dto/serialize.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEnum, User } from '../models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: {
        subordinates: true,
      },
    });
  }

  async saveUser(user: SignupUserDto): Promise<User> {
    return this.userRepository.save({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      boss: {
        id: user.bossId || null,
      },
    });
  }

  async findBoss(bossId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: bossId });
  }

  async getUsersList(
    request: IRequestExtended,
  ): Promise<SerializeUserDto | SerializeUserDto[]> {
    const { id, role, subordinates } = request.user;

    if (role === RolesEnum.USER) {
      if (subordinates.length === 0) {
        return new SerializeUserDto(request.user);
      } else {
        return this.getSubordinatesArray(id);
      }
    }

    if (role === RolesEnum.ADMIN) {
      return this.userRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        order: { id: 'asc' },
      });
    }
  }

  async getSubordinatesArray(id: number) {
    return (await this.userRepository.query(`
            WITH RECURSIVE subordinates AS (SELECT id, name, email, "createdAt", "bossId"
                FROM "user" WHERE id = ${+id}
                UNION SELECT u.id, u.name, u.email, u."createdAt", u."bossId"
                FROM "user" u
                INNER JOIN subordinates s ON s.id = u."bossId")
            SELECT * FROM subordinates`)) as SerializeUserDto[];
  }

  async changeUserBoss(
    request: IRequestExtended,
    subordinateId: number,
    newBossId: number,
    response: Response,
  ) {
    const { id, subordinates } = request.user;

    if (subordinates.length === 0) {
      throw new ForbiddenException(
        `Forbidden resource. Only for users with subordinates.`,
      );
    }

    if (!subordinateId || !newBossId) {
      throw new BadRequestException('Wrong query');
    }

    const all = await this.getSubordinatesArray(id);
    all.shift();

    const user = all.find((user) => user.id === +subordinateId);

    if (!user) {
      throw new BadRequestException(
        `User with id ${subordinateId} is not your subordinate or does not exist`,
      );
    }

    const existingUser = await this.userRepository.findOneBy({
      id: +newBossId,
    });

    if (!existingUser) {
      throw new BadRequestException(
        `User with id ${newBossId} you want to make as boss does not exist`,
      );
    }

    await this.userRepository.update(
      {
        id: +subordinateId,
      },
      {
        boss: {
          id: +newBossId,
        },
      },
    );

    response.status(200).json({
      message: `You successfully changed boss for your subordinate! New bossId - ${newBossId}`,
    });
  }
}
