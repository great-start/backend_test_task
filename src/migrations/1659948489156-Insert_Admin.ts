import { MigrationInterface, QueryRunner } from 'typeorm';

export class Insert_Admin1659948484513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" ("name", "email", "password", "role") VALUES ('Sasha', 'admin@gmail.com', '123456', 'ADMIN')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "user" WHERE "email"="admin@gmail.com"`);
  }
}
