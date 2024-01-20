import { MigrationInterface, QueryRunner } from "typeorm";

export class Tables1705741547642 implements MigrationInterface {
    name = 'Tables1705741547642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ADD "test" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "test"`);
    }

}
