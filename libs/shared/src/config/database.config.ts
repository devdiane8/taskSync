import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean | { rejectUnauthorized: boolean };
}

export const getDatabaseConfig = (serviceName: string, entities: any[]): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tasksync_db',
    entities: entities,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // migrations: [__dirname + `/../../../../apps/${serviceName}/src/migrations/*{.ts,.js}`],
    // migrationsRun: true,
    // migrationsTableName: 'migrations',
  };
};

// Specific configurations for each service
export const personServiceDatabaseConfig = (entities: any[]): TypeOrmModuleOptions => 
  getDatabaseConfig('person', entities);

export const todoServiceDatabaseConfig = (entities: any[]): TypeOrmModuleOptions => 
  getDatabaseConfig('todo', entities);
