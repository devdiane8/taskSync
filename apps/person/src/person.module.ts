import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PrismaService } from '@app/shared';
import { KafkaProducer } from './kafka/kafka.producer';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService, KafkaProducer],
  exports: [PersonService],
})
export class PersonModule {}
