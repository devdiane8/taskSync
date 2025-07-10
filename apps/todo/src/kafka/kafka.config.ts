import { KafkaConfig } from 'kafkajs';

export const kafkaConfig: KafkaConfig = {
  clientId: 'todo-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export const kafkaTopics = {
  TODO_EVENTS: 'todo-events',
} as const;

export const consumerGroupId = 'todo-service-consumer'; 