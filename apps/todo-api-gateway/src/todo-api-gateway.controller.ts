import { Controller, Get, Post, Put, Delete, Body, Param, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class TodoApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy,
  ) {}

  // User routes
  @Get('users')
  async getUsers() {
    try {
      return await firstValueFrom(this.userClient.send('get_users', {}));
    } catch (error) {
      throw new HttpException('User service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.userClient.send('get_user', { id }));
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('users')
  async createUser(@Body() createUserDto: any) {
    try {
      return await firstValueFrom(this.userClient.send('create_user', createUserDto));
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  // Task routes
  @Get('tasks')
  async getTasks() {
    try {
      return await firstValueFrom(this.taskClient.send('get_tasks', {}));
    } catch (error) {
      throw new HttpException('Task service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.taskClient.send('get_task', { id }));
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('tasks')
  async createTask(@Body() createTaskDto: any) {
    try {
      const task = await firstValueFrom(this.taskClient.send('create_task', createTaskDto));
      
      // Send notification after task creation
      await firstValueFrom(this.notificationClient.send('send_notification', {
        type: 'TASK_CREATED',
        userId: createTaskDto.userId,
        taskId: task.id,
        message: `New task created: ${createTaskDto.title}`
      }));
      
      return task;
    } catch (error) {
      throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: any) {
    try {
      const task = await firstValueFrom(this.taskClient.send('update_task', { id, ...updateTaskDto }));
      
      // Send notification after task update
      await firstValueFrom(this.notificationClient.send('send_notification', {
        type: 'TASK_UPDATED',
        userId: updateTaskDto.userId,
        taskId: id,
        message: `Task updated: ${updateTaskDto.title}`
      }));
      
      return task;
    } catch (error) {
      throw new HttpException('Failed to update task', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.taskClient.send('delete_task', { id }));
    } catch (error) {
      throw new HttpException('Failed to delete task', HttpStatus.BAD_REQUEST);
    }
  }

  // Project routes
  @Get('projects')
  async getProjects() {
    try {
      return await firstValueFrom(this.projectClient.send('get_projects', {}));
    } catch (error) {
      throw new HttpException('Project service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post('projects')
  async createProject(@Body() createProjectDto: any) {
    try {
      return await firstValueFrom(this.projectClient.send('create_project', createProjectDto));
    } catch (error) {
      throw new HttpException('Failed to create project', HttpStatus.BAD_REQUEST);
    }
  }

  // Health check
  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        gateway: 'running',
        user: 'checking...',
        task: 'checking...',
        notification: 'checking...',
        project: 'checking...'
      }
    };
  }
}
