import { Injectable } from '@nestjs/common';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { AppConfigService } from './app.config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly appConfig: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.appConfig.db_host,
      port: this.appConfig.db_port,
      username: this.appConfig.db_username,
      password: this.appConfig.db_password,
      database: this.appConfig.db_database,
      entities: [],
      synchronize: true,
    } as TypeOrmModuleAsyncOptions;
  }
}
