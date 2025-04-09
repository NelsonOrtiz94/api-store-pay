import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Customer } from '../customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private configService: ConfigService, // inyección del ConfigService
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

  // ✅ Nuevo método para generar URL de pago en Wompi Checkout
  async createCheckout(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    const publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY');
    const redirectUrl = this.configService.get<string>('WOMPI_REDIRECT_URL');

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    if (!publicKey || !redirectUrl) {
      throw new Error('Faltan variables de entorno de Wompi');
    }

    const query = new URLSearchParams({
      currency: 'COP',
      amount_in_cents: Math.round(transaction.totalAmount * 100).toString(),
      reference: `tx-${transaction.id}`,
      public_key: publicKey,
      redirect_url: redirectUrl,
    });

    const baseUrl =
      this.configService.get('WOMPI_CHECKOUT_BASE') ??
      'https://checkout.staging.wompi.dev/p/';

    return {
      checkoutUrl: `${baseUrl}?${query.toString()}`,
    };
  }

  // Métodos aún no implementados (puedes completarlos luego si los necesitas)
  remove(_id: number) {
    throw new Error('Method not implemented.');
  }

  update(_id: number, _dto: UpdateTransactionDto) {
    throw new Error('Method not implemented.');
  }

  findOne(_id: number) {
    throw new Error('Method not implemented.');
  }

  findAll() {
    throw new Error('Method not implemented.');
  }
}
