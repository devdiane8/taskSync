import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { KafkaConsumer } from './kafka/kafka.consumer';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, KafkaConsumer],
  exports: [NotificationService],
})
export class NotificationModule {}
