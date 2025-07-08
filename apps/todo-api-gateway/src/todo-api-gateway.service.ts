import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoApiGatewayService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy,
  ) {}

  // Cross-service operations
  async getUserWithTasks(userId: string) {
    try {
      const [user, tasks] = await Promise.all([
        firstValueFrom(this.userClient.send('get_user', { id: userId })),
        firstValueFrom(this.taskClient.send('get_tasks_by_user', { userId }))
      ]);

      return {
        ...user,
        tasks
      };
    } catch (error) {
      throw new Error('Failed to fetch user with tasks');
    }
  }

  async getProjectWithTasks(projectId: string) {
    try {
      const [project, tasks] = await Promise.all([
        firstValueFrom(this.projectClient.send('get_project', { id: projectId })),
        firstValueFrom(this.taskClient.send('get_tasks_by_project', { projectId }))
      ]);

      return {
        ...project,
        tasks
      };
    } catch (error) {
      throw new Error('Failed to fetch project with tasks');
    }
  }

  async createTaskWithNotification(taskData: any) {
    try {
      // Create task
      const task = await firstValueFrom(this.taskClient.send('create_task', taskData));
      
      // Send notification
      await firstValueFrom(this.notificationClient.send('send_notification', {
        type: 'TASK_CREATED',
        userId: taskData.userId,
        taskId: task.id,
        message: `New task created: ${taskData.title}`
      }));

      return task;
    } catch (error) {
      throw new Error('Failed to create task with notification');
    }
  }

  // Health check for all services
  async checkServicesHealth() {
    const healthChecks = {
      user: false,
      task: false,
      notification: false,
      project: false
    };

    try {
      await firstValueFrom(this.userClient.send('health_check', {}));
      healthChecks.user = true;
    } catch (error) {
      // Service unavailable
    }

    try {
      await firstValueFrom(this.taskClient.send('health_check', {}));
      healthChecks.task = true;
    } catch (error) {
      // Service unavailable
    }

    try {
      await firstValueFrom(this.notificationClient.send('health_check', {}));
      healthChecks.notification = true;
    } catch (error) {
      // Service unavailable
    }

    try {
      await firstValueFrom(this.projectClient.send('health_check', {}));
      healthChecks.project = true;
    } catch (error) {
      // Service unavailable
    }

    return healthChecks;
  }
}
