import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Transaction[];
}
