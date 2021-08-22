import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './database/entities/Transaction.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly txRepo: Repository<TransactionEntity>,
  ) {}

  getTransactions(): Promise<TransactionEntity[]> {
    return this.txRepo.find({
      take: 60,
    });
  }
}
