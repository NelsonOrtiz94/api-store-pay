import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'DECLINED';

  @Column()
  wompiTransactionId: string;

  @ManyToOne(() => Product, (product) => product.transactions)
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.transactions)
  customer: Customer;

  @OneToOne(() => Delivery, (delivery) => delivery.transaction, {
    cascade: true,
  })
  @JoinColumn()
  delivery: Delivery;

  @Column('decimal')
  totalAmount: number;
}
