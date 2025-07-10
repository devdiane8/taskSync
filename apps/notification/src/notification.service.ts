import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotificationService {
  private server: Server;
  private readonly logger = new Logger(NotificationService.name);

  setServer(server: Server) {
    this.server = server;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async broadcastNotification(notification: any) {
    try {
      this.logger.log(`📢 Broadcasting notification: ${notification.message}`);
      
      // Broadcast to all connected clients
      this.server.emit('notification', notification);
      
      // Also emit to specific event type rooms
      this.server.to(notification.type.toLowerCase()).emit('notification', notification);
      
      this.logger.log(`✅ Notification broadcasted successfully`);
    } catch (error) {
      this.logger.error(`❌ Error broadcasting notification:`, error);
    }
  }

  async sendToUser(userId: string, notification: any) {
    try {
      this.logger.log(`📤 Sending notification to user ${userId}: ${notification.message}`);
      
      // Send to specific user room
      this.server.to(`user-${userId}`).emit('notification', notification);
      
      this.logger.log(`✅ Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`❌ Error sending notification to user ${userId}:`, error);
    }
  }

  async joinUserRoom(userId: string, socketId: string) {
    try {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        await socket.join(`user-${userId}`);
        this.logger.log(`👤 User ${userId} joined their room`);
      }
    } catch (error) {
      this.logger.error(`❌ Error joining user room:`, error);
    }
  }

  async leaveUserRoom(userId: string, socketId: string) {
    try {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        await socket.leave(`user-${userId}`);
        this.logger.log(`👤 User ${userId} left their room`);
      }
    } catch (error) {
      this.logger.error(`❌ Error leaving user room:`, error);
    }
  }

  getConnectedClientsCount(): number {
    return this.server.sockets.sockets.size;
  }
}
