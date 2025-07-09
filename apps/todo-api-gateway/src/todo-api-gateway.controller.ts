import { Controller, Get, Post, Put, Delete, Body, Param, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class TodoApiGatewayController {
  constructor(
    @Inject('PERSON_SERVICE') private readonly personClient: ClientProxy,
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

 

  // Health check
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        gateway: 'running',
        person: 'checking...',
        todo: 'checking...',
        notification: 'checking...',
      }
    };
  }
}
