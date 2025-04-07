import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  stock: number;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];
}
