import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Product } from './product/entities/product.entity';
import { Customer } from './customer/entities/customer.entity';
import { Delivery } from './delivery/entities/delivery.entity';
import { Transaction } from './transaction/entities/transaction.entity';

import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { DeliveryModule } from './delivery/delivery.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product, Customer, Delivery, Transaction],
      synchronize: true, // solo para desarrollo
    }),
    ProductModule,
    CustomerModule,
    DeliveryModule,
    TransactionModule,
  ],
})
export class AppModule {}
