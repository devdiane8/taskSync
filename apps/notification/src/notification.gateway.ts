import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    this.logger.log('🚀 Notification WebSocket Gateway initialized');
    // Set the server instance in the notification service
    this.notificationService.setServer(server);
  }

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Client connected: ${client.id}`);
    
    // Send welcome message
    client.emit('connected', {
      message: 'Connected to notification service',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { room: string }) {
    try {
      client.join(payload.room);
      this.logger.log(`👥 Client ${client.id} joined room: ${payload.room}`);
      
      client.emit('roomJoined', {
        room: payload.room,
        message: `Joined room: ${payload.room}`,
      });
    } catch (error) {
      this.logger.error(`❌ Error joining room:`, error);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { room: string }) {
    try {
      client.leave(payload.room);
      this.logger.log(`👥 Client ${client.id} left room: ${payload.room}`);
      
      client.emit('roomLeft', {
        room: payload.room,
        message: `Left room: ${payload.room}`,
      });
    } catch (error) {
      this.logger.error(`❌ Error leaving room:`, error);
      client.emit('error', { message: 'Failed to leave room' });
    }
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinUserRoom(client: Socket, payload: { userId: string }) {
    try {
      const roomName = `user-${payload.userId}`;
      client.join(roomName);
      this.logger.log(`👤 Client ${client.id} joined user room: ${roomName}`);
      
      client.emit('userRoomJoined', {
        userId: payload.userId,
        message: `Joined user room: ${payload.userId}`,
      });
    } catch (error) {
      this.logger.error(`❌ Error joining user room:`, error);
      client.emit('error', { message: 'Failed to join user room' });
    }
  }

  @SubscribeMessage('getStats')
  handleGetStats(client: Socket) {
    try {
      const stats = {
        connectedClients: this.server.sockets.sockets.size,
        timestamp: new Date().toISOString(),
      };
      
      client.emit('stats', stats);
    } catch (error) {
      this.logger.error(`❌ Error getting stats:`, error);
      client.emit('error', { message: 'Failed to get stats' });
    }
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong', {
      timestamp: new Date().toISOString(),
      clientId: client.id,
    });
  }
} 