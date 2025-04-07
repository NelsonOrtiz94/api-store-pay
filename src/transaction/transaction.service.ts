import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Customer } from '../customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(_arg0: number) {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(arg0: number, _updateTransactionDto: UpdateTransactionDto) {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOne(_arg0: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async create(dto: CreateTransactionDto) {
    let customer = await this.customerRepository.findOne({
      where: { email: dto.email },
    });

    if (!customer) {
      customer = this.customerRepository.create({
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
      });
      customer = await this.customerRepository.save(customer);
    }

    const delivery = this.deliveryRepository.create({
      address: dto.address,
      city: dto.city,
      postalCode: dto.postalCode,
      country: dto.country || 'Colombia',
    });
    await this.deliveryRepository.save(delivery);

    const product: Product | null = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const baseFee = 5.0;
    const deliveryFee = 7.0;

    const total = Number(product.price) + baseFee + deliveryFee;

    const transaction = this.transactionRepository.create({
      product,
      customer,
      delivery,
      totalAmount: total,
      status: 'PENDING',
      wompiTransactionId: '',
    });

    return this.transactionRepository.save(transaction);
  }
}
