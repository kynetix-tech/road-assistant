import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditRouteConfig1731411732661 implements MigrationInterface {
  name = 'EditRouteConfig1731411732661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "route" DROP COLUMN "path_data"');
    await queryRunner.query(
      'ALTER TABLE "route" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()',
    );
    await queryRunner.query(
      'ALTER TABLE "route" ADD "start_point" json DEFAULT \'{}\'',
    );
    await queryRunner.query(
      'ALTER TABLE "route" ADD "end_point" json DEFAULT \'{}\'',
    );
    await queryRunner.query(
      'ALTER TABLE "rating" ADD CONSTRAINT "UK_user_eca12sqs109sxcl" UNIQUE("user_id");',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "route" DROP COLUMN "end_point"');
    await queryRunner.query('ALTER TABLE "route" DROP COLUMN "start_point"');
    await queryRunner.query('ALTER TABLE "route" DROP COLUMN "created_at"');
    await queryRunner.query(
      'ALTER TABLE "route" ADD "path_data" json DEFAULT \'[]\'',
    );
    await queryRunner.query(
      'ALTER TABLE "rating" DROP CONSTRAINT "UK_user_eca12sqs109sxcl" UNIQUE("user_id");',
    );
  }
}
