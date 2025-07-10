import { KafkaConfig } from 'kafkajs';

export const kafkaConfig: KafkaConfig = {
  clientId: 'person-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export const kafkaTopics = {
  PERSON_EVENTS: 'person-events',
} as const;

export const producerGroupId = 'person-service-producer'; 