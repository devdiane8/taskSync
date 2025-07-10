import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConfig, kafkaTopics, consumerGroupId } from './kafka.config';
import { NotificationService } from '../notification.service';

@Injectable()
export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumer.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly notificationService: NotificationService) {
    this.kafka = new Kafka(kafkaConfig);
    this.consumer = this.kafka.consumer({ groupId: consumerGroupId });
  }

  async onModuleInit() {
    await this.connect();
    await this.subscribeToTopics();
    await this.startConsuming();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      this.logger.log('✅ Kafka consumer connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect Kafka consumer:', error);
      throw error;
    }
  }

  private async subscribeToTopics() {
    try {
      await this.consumer.subscribe({ topic: kafkaTopics.TODO_EVENTS, fromBeginning: false });
      await this.consumer.subscribe({ topic: kafkaTopics.PERSON_EVENTS, fromBeginning: false });
      this.logger.log(`📡 Subscribed to topics: ${kafkaTopics.TODO_EVENTS}, ${kafkaTopics.PERSON_EVENTS}`);
    } catch (error) {
      this.logger.error('❌ Failed to subscribe to topics:', error);
      throw error;
    }
  }

  private async startConsuming() {
    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.logger.log('🚀 Kafka consumer started successfully');
    } catch (error) {
      this.logger.error('❌ Failed to start consuming messages:', error);
      throw error;
    }
  }

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();
    const messageKey = message.key?.toString();

    this.logger.log(`📨 Received message from topic: ${topic}, partition: ${partition}, key: ${messageKey}`);

    try {
      const parsedMessage = messageValue ? JSON.parse(messageValue) : {};
      
      // Handle different event types
      switch (topic) {
        case kafkaTopics.TODO_EVENTS:
          await this.handleTodoEvent(parsedMessage);
          break;
        case kafkaTopics.PERSON_EVENTS:
          await this.handlePersonEvent(parsedMessage);
          break;
        default:
          this.logger.warn(`⚠️ Unknown topic: ${topic}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error processing message from topic ${topic}:`, error);
    }
  }

  private async handleTodoEvent(event: any) {
    this.logger.log(`📋 Processing todo event: ${event.type || 'unknown'}`);
    
    // Create notification based on event type
    const notification = {
      type: 'TODO_EVENT',
      eventType: event.type,
      data: event.data,
      timestamp: new Date().toISOString(),
      message: this.generateTodoMessage(event),
    };

    // Send to WebSocket clients
    await this.notificationService.broadcastNotification(notification);
  }

  private async handlePersonEvent(event: any) {
    this.logger.log(`👤 Processing person event: ${event.type || 'unknown'}`);
    
    // Create notification based on event type
    const notification = {
      type: 'PERSON_EVENT',
      eventType: event.type,
      data: event.data,
      timestamp: new Date().toISOString(),
      message: this.generatePersonMessage(event),
    };

    // Send to WebSocket clients
    await this.notificationService.broadcastNotification(notification);
  }

  private generateTodoMessage(event: any): string {
    const { type, data } = event;
    
    switch (type) {
      case 'TODO_CREATED':
        return `New todo created: "${data.title}"`;
      case 'TODO_UPDATED':
        return `Todo updated: "${data.title}"`;
      case 'TODO_DELETED':
        return `Todo deleted: "${data.title}"`;
      case 'TODO_COMPLETED':
        return `Todo completed: "${data.title}"`;
      default:
        return `Todo event: ${type}`;
    }
  }

  private generatePersonMessage(event: any): string {
    const { type, data } = event;
    
    switch (type) {
      case 'PERSON_CREATED':
        return `New person added: "${data.name}"`;
      case 'PERSON_UPDATED':
        return `Person updated: "${data.name}"`;
      case 'PERSON_DELETED':
        return `Person deleted: "${data.name}"`;
      case 'PERSON_ACTIVATED':
        return `Person activated: "${data.name}"`;
      case 'PERSON_DEACTIVATED':
        return `Person deactivated: "${data.name}"`;
      default:
        return `Person event: ${type}`;
    }
  }

  private async disconnect() {
    try {
      await this.consumer.disconnect();
      this.logger.log('🔌 Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('❌ Error disconnecting Kafka consumer:', error);
    }
  }
} 