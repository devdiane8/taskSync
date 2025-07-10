import { KafkaConfig } from 'kafkajs';

export const kafkaConfig: KafkaConfig = {
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export const kafkaTopics = {
  TODO_EVENTS: 'todo-events',
  PERSON_EVENTS: 'person-events',
} as const;

export const consumerGroupId = 'notification-service-group'; 