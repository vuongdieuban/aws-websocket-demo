import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './Abstract.entity';

@Entity()
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
