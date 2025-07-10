import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { TodoApiGatewayModule } from './todo-api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TodoApiGatewayModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // Allow extra properties
      skipMissingProperties: false,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TaskSync API Gateway')
    .setDescription('API Gateway for TaskSync microservices architecture')
    .setVersion('1.0')
    .addTag('person', 'Person management operations')
    .addTag('todo', 'Todo management operations')
    .addTag('health', 'Health check operations')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'TaskSync API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Gateway is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🔍 Health Check: http://localhost:${port}/api/v1/health`);
}
bootstrap();
