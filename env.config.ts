export const envConfig = {
  // Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'tasksync',

  // Application Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),

  // Microservices Configuration
  USER_SERVICE_PORT: parseInt(process.env.USER_SERVICE_PORT || '4001'),
  TASK_SERVICE_PORT: parseInt(process.env.TASK_SERVICE_PORT || '4002'),
  NOTIFICATION_SERVICE_PORT: parseInt(process.env.NOTIFICATION_SERVICE_PORT || '4003'),
  PROJECT_SERVICE_PORT: parseInt(process.env.PROJECT_SERVICE_PORT || '4004'),

  // JWT Configuration (for future use)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
}; 