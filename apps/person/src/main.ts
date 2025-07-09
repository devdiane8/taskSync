import { NestFactory } from '@nestjs/core';
import { PersonModule } from './person.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PersonModule, {
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  });
  await app.listen();
}
bootstrap();
