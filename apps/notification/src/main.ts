import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  // Enable CORS for WebSocket connections
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.NOTIFICATION_SERVICE_PORT || 3003;
  await app.listen(port);

  console.log(`🔔 Notification Service is running on: http://localhost:${port}`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${port}/notifications`);
  console.log(`📚 Test client: http://localhost:${port}/test-client`);
}
bootstrap();
