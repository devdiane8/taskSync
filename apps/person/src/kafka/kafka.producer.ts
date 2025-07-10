import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { kafkaConfig, kafkaTopics } from './kafka.config';

export interface PersonEvent {
  type: 'PERSON_CREATED' | 'PERSON_UPDATED' | 'PERSON_DELETED' | 'PERSON_ACTIVATED' | 'PERSON_DEACTIVATED';
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

  async publishPersonEvent(event: PersonEvent) {
    try {
      await this.producer.send({
        topic: kafkaTopics.PERSON_EVENTS,
        messages: [
          {
            key: event.data.id?.toString() || 'unknown',
            value: JSON.stringify(event),
            timestamp: Date.now().toString(),
          },
        ],
      });
      
      this.logger.log(`📤 Published person event: ${event.type} for person ID: ${event.data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to publish person event: ${event.type}`, error);
      throw error;
    }
  }

  async publishPersonCreated(personData: any) {
    const event: PersonEvent = {
      type: 'PERSON_CREATED',
      data: personData,
      timestamp: new Date().toISOString(),
    };
    await this.publishPersonEvent(event);
  }

  async publishPersonUpdated(personData: any) {
    const event: PersonEvent = {
      type: 'PERSON_UPDATED',
      data: personData,
      timestamp: new Date().toISOString(),
    };
    await this.publishPersonEvent(event);
  }

  async publishPersonDeleted(personData: any) {
    const event: PersonEvent = {
      type: 'PERSON_DELETED',
      data: personData,
      timestamp: new Date().toISOString(),
    };
    await this.publishPersonEvent(event);
  }

  async publishPersonActivated(personData: any) {
    const event: PersonEvent = {
      type: 'PERSON_ACTIVATED',
      data: personData,
      timestamp: new Date().toISOString(),
    };
    await this.publishPersonEvent(event);
  }

  async publishPersonDeactivated(personData: any) {
    const event: PersonEvent = {
      type: 'PERSON_DEACTIVATED',
      data: personData,
      timestamp: new Date().toISOString(),
    };
    await this.publishPersonEvent(event);
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