import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwt_time(): string {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }
  get jwt_key(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_TIME');
  }
  get port(): number {
    return this.configService.get<number>('PORT') || 5000;
  }
  get db_host(): string {
    return this.configService.get<string>('DB_HOST');
  }
  get db_port(): number {
    return this.configService.get<number>('DB_PORT');
  }
  get db_username(): string {
    return this.configService.get<string>('DB_USERNAME');
  }
  get db_password(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  get db_database(): string {
    return this.configService.get<string>('DB_DATABASE');
  }
}