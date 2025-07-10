# 🔔 Notification Service Setup

This document explains how to set up and use the TaskSync Notification Service with Kafka event consumption and WebSocket real-time notifications.

## 📋 Overview

The Notification Service is responsible for:
- Consuming Kafka events from todo and person services
- Processing and formatting notifications
- Broadcasting real-time notifications via WebSocket
- Managing client connections and rooms

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Todo Service  │    │  Person Service │    │  Other Services │
│                 │    │                 │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │        Kafka Topics       │
                    │  • todo-events           │
                    │  • person-events         │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Notification Service    │
                    │  • Kafka Consumer        │
                    │  • WebSocket Gateway     │
                    │  • Event Processing      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    WebSocket Clients      │
                    │  • Frontend Apps         │
                    │  • Mobile Apps           │
                    │  • Other Services        │
                    └───────────────────────────┘
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install kafkajs @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Kafka Configuration
KAFKA_BROKERS=localhost:9092

# Notification Service
NOTIFICATION_SERVICE_PORT=3003
```

### 3. Start Kafka (if not already running)

```bash
# Using Docker
docker run -d --name kafka \
  -p 9092:9092 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=localhost:2181 \
  confluentinc/cp-kafka:latest

# Or using Kafka with Zookeeper
docker-compose up -d kafka zookeeper
```

### 4. Start the Notification Service

```bash
npm run start:notification:dev
```

## 📡 Kafka Event Format

### Todo Events

```json
{
  "type": "TODO_CREATED",
  "data": {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the TaskSync project",
    "personId": 1,
    "isDone": false,
    "priority": 1,
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "labels": ["urgent", "project"],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z",
  "userId": "user123"
}
```

### Person Events

```json
{
  "type": "PERSON_CREATED",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-0123",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z",
  "userId": "user123"
}
```

## 🔌 WebSocket API

### Connection

```javascript
const socket = io('http://localhost:3003/notifications');
```

### Events

#### Client to Server

- `joinRoom` - Join a specific room
- `leaveRoom` - Leave a specific room
- `joinUserRoom` - Join a user-specific room
- `getStats` - Get service statistics
- `ping` - Ping the server

#### Server to Client

- `connected` - Connection established
- `notification` - New notification received
- `roomJoined` - Successfully joined a room
- `roomLeft` - Successfully left a room
- `userRoomJoined` - Successfully joined user room
- `stats` - Service statistics
- `pong` - Response to ping
- `error` - Error message

### Example Usage

```javascript
// Connect to notification service
const socket = io('http://localhost:3003/notifications');

// Listen for notifications
socket.on('notification', (notification) => {
  console.log('New notification:', notification.message);
  // Handle notification (show toast, update UI, etc.)
});

// Join specific rooms
socket.emit('joinRoom', { room: 'todo-events' });
socket.emit('joinRoom', { room: 'person-events' });

// Join user-specific room
socket.emit('joinUserRoom', { userId: 'user123' });

// Get service stats
socket.emit('getStats');
socket.on('stats', (stats) => {
  console.log('Connected clients:', stats.connectedClients);
});
```

## 🧪 Testing

### 1. Use the Test Client

Open `test-notification-client.html` in your browser to test the WebSocket functionality.

### 2. Send Test Events

You can send test events using the Kafka producer or directly via WebSocket:

```javascript
// Simulate todo event
socket.emit('simulateTodoEvent', {
  type: 'TODO_CREATED',
  data: { /* todo data */ },
  timestamp: new Date().toISOString()
});

// Simulate person event
socket.emit('simulatePersonEvent', {
  type: 'PERSON_CREATED',
  data: { /* person data */ },
  timestamp: new Date().toISOString()
});
```

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3003/health
```

### WebSocket Stats

```javascript
socket.emit('getStats');
socket.on('stats', (stats) => {
  console.log('Service stats:', stats);
});
```

## 🔧 Configuration

### Kafka Configuration

```typescript
// apps/notification/src/kafka/kafka.config.ts
export const kafkaConfig: KafkaConfig = {
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};
```

### WebSocket Configuration

```typescript
// apps/notification/src/notification.gateway.ts
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
```

## 🚨 Troubleshooting

### Common Issues

1. **Kafka Connection Failed**
   - Ensure Kafka is running on the correct port
   - Check `KAFKA_BROKERS` environment variable
   - Verify network connectivity

2. **WebSocket Connection Failed**
   - Check if notification service is running on port 3003
   - Verify CORS settings
   - Check firewall settings

3. **No Notifications Received**
   - Ensure topics exist in Kafka
   - Check consumer group configuration
   - Verify event format matches expected schema

### Logs

The service provides detailed logging for:
- Kafka connection status
- Message consumption
- WebSocket connections
- Error handling

Check the console output for detailed information.

## 📚 Additional Resources

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways) 