import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeInstallationAddressNullable1750000000000 implements MigrationInterface {
  name = 'MakeInstallationAddressNullable1750000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "installation" ALTER COLUMN "addressId" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "installation" ALTER COLUMN "addressId" SET NOT NULL`);
  }
}
