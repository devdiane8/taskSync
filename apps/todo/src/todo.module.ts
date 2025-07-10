import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaService } from '@app/shared';
import { KafkaProducer } from './kafka/kafka.producer';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService, KafkaProducer],
  exports: [TodoService],
})
export class TodoModule {}
