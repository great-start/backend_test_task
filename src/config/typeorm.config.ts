import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Token, User } from '../models';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: String(configService.get('DB_PASSWORD')),
      database: configService.get('DB_DATABASE'),
      entities: [User, Token],
      // migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: true,
    };
  },
  inject: [ConfigService],
};
