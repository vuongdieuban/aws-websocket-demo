import { Column } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';

export class TransactionEntity extends AbstractEntity {
  @Column({
    name: 'fiat_amount',
    default: 0,
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  fiatAmount: number;
}
