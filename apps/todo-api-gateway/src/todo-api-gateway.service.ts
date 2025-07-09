import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoApiGatewayService {
  constructor(
    @Inject('PERSON_SERVICE') private readonly personClient: ClientProxy,
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}



  // Health check for all services
  async checkServicesHealth() {
    const healthChecks = {
      person: false,
      todo: false,
      notification: false,
    };

    try {
      await firstValueFrom(this.personClient.send('health_check', {}));
      healthChecks.person = true;
    } catch (error) {
      // Service unavailable
    }

    try {
      await firstValueFrom(this.todoClient.send('health_check', {}));
      healthChecks.todo = true;
    } catch (error) {
      // Service unavailable
    }

    try {
      await firstValueFrom(this.notificationClient.send('health_check', {}));
      healthChecks.notification = true;
    } catch (error) {
      // Service unavailable
    }



    return healthChecks;
  }
}
