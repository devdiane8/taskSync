// Kafka Event Types
export interface TodoEvent {
  type: 'TODO_CREATED' | 'TODO_UPDATED' | 'TODO_DELETED' | 'TODO_COMPLETED';
  data: {
    id: number;
    title: string;
    description?: string;
    personId: number;
    isDone: boolean;
    priority?: number;
    startDate?: string;
    endDate?: string;
    labels?: string[];
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
  userId?: string;
}

export interface PersonEvent {
  type: 'PERSON_CREATED' | 'PERSON_UPDATED' | 'PERSON_DELETED' | 'PERSON_ACTIVATED' | 'PERSON_DEACTIVATED';
  data: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
  userId?: string;
}

// Notification Types
export interface Notification {
  type: 'TODO_EVENT' | 'PERSON_EVENT' | 'SYSTEM_NOTIFICATION';
  eventType: string;
  data: any;
  timestamp: string;
  message: string;
  userId?: string;
  priority?: 'low' | 'medium' | 'high';
  read?: boolean;
}

// WebSocket Event Types
export interface WebSocketEvent {
  event: string;
  data: any;
  timestamp: string;
}

// Room Types
export interface RoomInfo {
  name: string;
  clients: number;
  type: 'todo' | 'person' | 'user' | 'system';
}

// Stats Types
export interface ServiceStats {
  connectedClients: number;
  totalNotifications: number;
  kafkaTopics: string[];
  uptime: number;
  timestamp: string;
} 