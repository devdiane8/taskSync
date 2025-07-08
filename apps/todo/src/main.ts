import { NestFactory } from '@nestjs/core';
import { TodoModule } from './todo.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TodoModule, {
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  await app.listen();
}
bootstrap();
