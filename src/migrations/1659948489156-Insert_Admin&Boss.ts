import { MigrationInterface, QueryRunner } from 'typeorm';

export class Insert_Admin1659948484513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" ("name", "email", "password", "role") VALUES ('Sasha', 'admin@gmail.com', '123456', 'ADMIN')`);

    await queryRunner.query(`
        INSERT INTO "user" ("name", "email", "password", "role") VALUES ('Vanya', 'boss@gmail.com', '654321', 'USER')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "user" WHERE "email"="admin@gmail.com";
        DELETE FROM "user" WHERE "email"="boss@gmail.com"`);
  }
}
