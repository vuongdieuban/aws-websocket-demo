import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransactionEntity1629578263495 implements MigrationInterface {
    name = 'CreateTransactionEntity1629578263495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "fiat_amount" numeric(14,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_6f9d7f02d8835ac9ef1f685a2e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction_entity"`);
    }

}
