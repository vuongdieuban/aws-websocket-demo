import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionEntity } from '../entities/Transaction.entity';

export class SeedsTransactions1629580106395 implements MigrationInterface {
  private MaxNumberOfTransactions = 300;

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { manager } = queryRunner;
    const repo = manager.getRepository<TransactionEntity>(TransactionEntity);

    const data: Partial<TransactionEntity>[] = new Array(this.MaxNumberOfTransactions)
      .fill(null)
      .map(() => ({
        fiatAmount: this.randomIntFromInterval(10, 10000),
      }));

    await repo.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
