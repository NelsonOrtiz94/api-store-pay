import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:5173', // tu frontend
  });

  await app.listen(3000);
}
bootstrap();
