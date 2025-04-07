import { DataSource } from 'typeorm';
import { Product } from './src/product/entities/product.entity';
import { Transaction } from './src/transaction/entities/transaction.entity';
import { Customer } from './src/customer/entities/customer.entity';
import { Delivery } from './src/delivery/entities/delivery.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, Transaction, Customer, Delivery],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const productRepository = AppDataSource.getRepository(Product);

  const products = [
    {
      name: 'Camisa básica blanca',
      description: 'Camisa de algodón 100%',
      price: 59.99,
      stock: 10,
    },
    {
      name: 'Pantalón de mezclilla',
      description: 'Jeans azul oscuro',
      price: 89.99,
      stock: 15,
    },
    {
      name: 'Zapatos deportivos',
      description: 'Tenis blancos para hombre',
      price: 120.0,
      stock: 8,
    },
  ];

  for (const p of products) {
    const exists = await productRepository.findOneBy({ name: p.name });
    if (!exists) {
      await productRepository.save(productRepository.create(p));
    }
  }

  console.log('✅ Seed completado');
  process.exit();
}

seed();
