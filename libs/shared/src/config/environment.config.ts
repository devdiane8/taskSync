export interface EnvironmentConfig {
  // Application
  NODE_ENV: string;
  PORT: number;
  
  // Shared Database
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  
  // Microservices
  PERSON_SERVICE_PORT: number;
  TODO_SERVICE_PORT: number;
  NOTIFICATION_SERVICE_PORT: number;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export const getEnvironmentConfig = (): EnvironmentConfig => ({
  // Application
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
  
  // Shared Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'tasksync_db',
  
  // Microservices
  PERSON_SERVICE_PORT: parseInt(process.env.PERSON_SERVICE_PORT || '4001'),
  TODO_SERVICE_PORT: parseInt(process.env.TODO_SERVICE_PORT || '4002'),
  NOTIFICATION_SERVICE_PORT: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '4003'),
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
}); 