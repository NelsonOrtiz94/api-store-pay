import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @OneToOne(() => Transaction, (transaction) => transaction.delivery)
  @JoinColumn()
  transaction: Transaction;
}
