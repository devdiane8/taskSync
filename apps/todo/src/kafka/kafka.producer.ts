import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { kafkaConfig, kafkaTopics } from './kafka.config';

export interface TodoEvent {
  type: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED' | 'TODO_COMPLETED';
  data: any;
  timestamp: string;
}

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducer.name);
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      this.logger.log('✅ Kafka producer connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async publishTodoEvent(event: TodoEvent) {
    try {
      await this.producer.send({
        topic: kafkaTopics.TODO_EVENTS,
        messages: [
          {
            key: event.data.id?.toString() || 'unknown',
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          },
        ],
      });
      
      this.logger.log(`📤 Published todo event: ${event.type} for todo ID: ${event.data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish todo event: ${event.type}`, error);
      throw error;
    }
  }

  async publishTodoCreated(todoData: any) {
    const event: TodoEvent = {
      type: 'TODO_CREATED',
      data: todoData,
      timestamp: new Date().toISOString(),
    };
    await this.publishTodoEvent(event);
  }

  async publishTodoUpdated(todoData: any) {
    const event: TodoEvent = {
      type: 'TODO_UPDATED',
      data: todoData,
      timestamp: new Date().toISOString(),
    };
    await this.publishTodoEvent(event);
  }

  async publishTodoDeleted(todoData: any) {
    const event: TodoEvent = {
      type: 'TODO_DELETED',
      data: todoData,
      timestamp: new Date().toISOString(),
    };
    await this.publishTodoEvent(event);
  }

  async publishTodoCompleted(todoData: any) {
    const event: TodoEvent = {
      type: 'TODO_COMPLETED',
      data: todoData,
      timestamp: new Date().toISOString(),
    };
    await this.publishTodoEvent(event);
  }

  private async disconnect() {
    try {
      await this.producer.disconnect();
      this.logger.log('🔌 Kafka producer disconnected');
    } catch (error) {
      this.logger.error('❌ Error disconnecting Kafka producer:', error);
    }
  }
} 