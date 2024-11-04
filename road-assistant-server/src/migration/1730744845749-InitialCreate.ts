import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCreate1730744845749 implements MigrationInterface {
  name = 'InitialCreate1730744845749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "route" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "recognized_signs" json DEFAULT \'[]\', "path_data" json DEFAULT \'[]\', "user_id" character varying NOT NULL, CONSTRAINT "PK_08affcd076e46415e5821acf52d" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "comment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "route_id" integer NOT NULL, "user_id" character varying NOT NULL, "path_data" json DEFAULT \'{}\', CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "rating" ("id" SERIAL NOT NULL, "accuracy" real NOT NULL, "recognized_signs" integer NOT NULL, "added_comments" integer NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "REL_17618c8d69b7e2e287bf9f8fbb" UNIQUE ("user_id"), CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"user_adc_gender_enum\" AS ENUM('Male', 'Female', 'Other')",
    );
    await queryRunner.query(
      'CREATE TABLE "user_adc" ("auth0_id" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "gender" "public"."user_adc_gender_enum" NOT NULL, "settings" json DEFAULT \'[]\', CONSTRAINT "UQ_6b2506e4249b7e4b8981d03112c" UNIQUE ("email"), CONSTRAINT "PK_f3231394b7eaeadabdc6f3bf1f7" PRIMARY KEY ("auth0_id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "route" ADD CONSTRAINT "FK_797177a310ed69b8ede51c81a55" FOREIGN KEY ("user_id") REFERENCES "user_adc"("auth0_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user_adc"("auth0_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "comment" ADD CONSTRAINT "FK_a729d4d603345f17c4cfaa98e95" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "rating" ADD CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3" FOREIGN KEY ("user_id") REFERENCES "user_adc"("auth0_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "rating" DROP CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3"',
    );
    await queryRunner.query(
      'ALTER TABLE "comment" DROP CONSTRAINT "FK_a729d4d603345f17c4cfaa98e95"',
    );
    await queryRunner.query(
      'ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"',
    );
    await queryRunner.query(
      'ALTER TABLE "route" DROP CONSTRAINT "FK_797177a310ed69b8ede51c81a55"',
    );
    await queryRunner.query('DROP TABLE "user_adc"');
    await queryRunner.query('DROP TYPE "public"."user_adc_gender_enum"');
    await queryRunner.query('DROP TABLE "rating"');
    await queryRunner.query('DROP TABLE "comment"');
    await queryRunner.query('DROP TABLE "route"');
  }
}
