import { apiClient } from './client';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject?: string;
  content: string;
  type: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read' | 'archived';
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
    type: string;
  }>;
  metadata?: Record<string, any>;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

export interface Conversation {
  otherUserId: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  totalMessages: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  receiverId: string;
  subject?: string;
  content: string;
  type?: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: File[];
  metadata?: Record<string, any>;
}

export interface MessageFilters {
  type?: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  status?: 'sent' | 'delivered' | 'read' | 'archived';
  senderId?: string;
  receiverId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class MessageService {
  // Get messages for current user
  static async getMessages(filters?: MessageFilters): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
    unreadCount: number;
  }> {
    const response = await apiClient.get('/messages', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch messages');
    }
    return response.data as {
      messages: Message[];
      total: number;
      page: number;
      totalPages: number;
      unreadCount: number;
    };
  }

  // Send a message
  static async sendMessage(messageData: SendMessageData): Promise<Message> {
    const formData = new FormData();
    formData.append('receiverId', messageData.receiverId);
    if (messageData.subject) formData.append('subject', messageData.subject);
    formData.append('content', messageData.content);
    if (messageData.type) formData.append('type', messageData.type);
    if (messageData.priority) formData.append('priority', messageData.priority);
    if (messageData.metadata) formData.append('metadata', JSON.stringify(messageData.metadata));

    // Add attachments
    if (messageData.attachments) {
      messageData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await apiClient.upload('/messages', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send message');
    }
    return response.data as Message;
  }

  // Get message by ID
  static async getMessageById(id: string): Promise<Message> {
    const response = await apiClient.get(`/messages/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch message');
    }
    return response.data as Message;
  }

  // Mark message as read
  static async markAsRead(id: string): Promise<void> {
    const response = await apiClient.put(`/messages/${id}/read`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark message as read');
    }
  }

  // Delete message
  static async deleteMessage(id: string): Promise<void> {
    const response = await apiClient.delete(`/messages/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete message');
    }
  }

  // Get conversation with another user
  static async getConversation(otherUserId: string, filters?: Omit<MessageFilters, 'receiverId' | 'senderId'>): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
    otherUser: {
      id: string;
      name: string;
      avatar?: string;
      role?: string;
      isOnline?: boolean;
      lastSeen?: string;
    };
  }> {
    const response = await apiClient.get(`/messages/conversation/${otherUserId}`, filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch conversation');
    }
    return response.data as {
      messages: Message[];
      total: number;
      page: number;
      totalPages: number;
      otherUser: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
        isOnline?: boolean;
        lastSeen?: string;
      };
    };
  }

  // Get all conversations
  static async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/messages/conversations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch conversations');
    }
    return response.data as Conversation[];
  }

  // Get unread message count
  static async getUnreadCount(): Promise<{
    total: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const response = await apiClient.get('/messages/unread-count');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch unread count');
    }
    return response.data as {
      total: number;
      byType: Record<string, number>;
      byPriority: Record<string, number>;
    };
  }

  // Mark all messages as read
  static async markAllAsRead(): Promise<{
    success: boolean;
    markedCount: number;
  }> {
    const response = await apiClient.put('/messages/mark-all-read');
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark all messages as read');
    }
    return response.data as {
      success: boolean;
      markedCount: number;
    };
  }

  // Archive message
  static async archiveMessage(id: string): Promise<void> {
    const response = await apiClient.put(`/messages/${id}/archive`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to archive message');
    }
  }

  // Bulk delete messages
  static async bulkDeleteMessages(messageIds: string[]): Promise<{
    success: boolean;
    deletedCount: number;
    failedIds: string[];
  }> {
    const response = await apiClient.post('/messages/bulk-delete', { messageIds });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk delete messages');
    }
    return response.data as {
      success: boolean;
      deletedCount: number;
      failedIds: string[];
    };
  }

  // Search messages
  static async searchMessages(query: string, filters?: Omit<MessageFilters, 'search'>): Promise<{
    messages: Message[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/messages/search', { ...filters, q: query });
    if (!response.success) {
      throw new Error(response.error || 'Failed to search messages');
    }
    return response.data as {
      messages: Message[];
      total: number;
      page: number;
      totalPages: number;
    };
  }

  // Get message statistics
  static async getMessageStats(): Promise<{
    totalMessages: number;
    unreadMessages: number;
    totalConversations: number;
    messagesByType: Record<string, number>;
    messagesByPriority: Record<string, number>;
    messagesByMonth: Array<{
      month: string;
      sent: number;
      received: number;
    }>;
  }> {
    const response = await apiClient.get('/messages/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch message stats');
    }
    return response.data as {
      totalMessages: number;
      unreadMessages: number;
      totalConversations: number;
      messagesByType: Record<string, number>;
      messagesByPriority: Record<string, number>;
      messagesByMonth: Array<{
        month: string;
        sent: number;
        received: number;
      }>;
    };
  }

  // Send system message (admin only)
  static async sendSystemMessage(messageData: {
    receiverIds: string[];
    subject: string;
    content: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    attachments?: File[];
    metadata?: Record<string, any>;
  }): Promise<{
    success: boolean;
    sentCount: number;
    failedCount: number;
  }> {
    const formData = new FormData();
    formData.append('receiverIds', JSON.stringify(messageData.receiverIds));
    formData.append('subject', messageData.subject);
    formData.append('content', messageData.content);
    if (messageData.priority) formData.append('priority', messageData.priority);
    if (messageData.metadata) formData.append('metadata', JSON.stringify(messageData.metadata));

    // Add attachments
    if (messageData.attachments) {
      messageData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await apiClient.upload('/messages/system', formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send system message');
    }
    return response.data as {
      success: boolean;
      sentCount: number;
      failedCount: number;
    };
  }

  // Get message templates (for quick replies)
  static async getMessageTemplates(): Promise<Array<{
    id: string;
    name: string;
    subject?: string;
    content: string;
    type: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
    variables: string[]; // Available variables for template
  }>> {
    const response = await apiClient.get('/messages/templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch message templates');
    }
    return response.data as Array<{
      id: string;
      name: string;
      subject?: string;
      content: string;
      type: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
      variables: string[];
    }>;
  }

  // Create message template
  static async createMessageTemplate(template: {
    name: string;
    subject?: string;
    content: string;
    type: 'direct' | 'system' | 'order' | 'support' | 'negotiation';
    variables?: string[];
  }): Promise<{
    id: string;
    name: string;
    subject?: string;
    content: string;
    type: string;
    variables: string[];
  }> {
    const response = await apiClient.post('/messages/templates', template);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create message template');
    }
    return response.data as {
      id: string;
      name: string;
      subject?: string;
      content: string;
      type: string;
      variables: string[];
    };
  }

  // Get online users (for real-time chat)
  static async getOnlineUsers(): Promise<Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    lastSeen: string;
    isOnline: boolean;
  }>> {
    const response = await apiClient.get('/messages/online-users');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch online users');
    }
    return response.data as Array<{
      id: string;
      name: string;
      avatar?: string;
      role?: string;
      lastSeen: string;
      isOnline: boolean;
    }>;
  }

  // Report message (spam, harassment, etc.)
  static async reportMessage(messageId: string, reason: string, details?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post(`/messages/${messageId}/report`, { reason, details });
    if (!response.success) {
      throw new Error(response.error || 'Failed to report message');
    }
    return response.data as {
      success: boolean;
      message: string;
    };
  }
}