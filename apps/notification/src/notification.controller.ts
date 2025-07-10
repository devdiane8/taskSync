import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'notification',
      timestamp: new Date().toISOString(),
      websocket: {
        connectedClients: this.notificationService.getConnectedClientsCount(),
        endpoint: '/notifications',
      },
    };
  }

  @Get('stats')
  getStats() {
    return {
      service: 'notification',
      timestamp: new Date().toISOString(),
      websocket: {
        connectedClients: this.notificationService.getConnectedClientsCount(),
        endpoint: '/notifications',
        namespace: '/notifications',
      },
      kafka: {
        topics: ['todo-events', 'person-events'],
        consumerGroup: 'notification-service-group',
      },
    };
  }
}
