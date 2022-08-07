import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { Token, User } from '../models';

config({ path: `.env.example` });

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Token],
  migrations: ['./src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
