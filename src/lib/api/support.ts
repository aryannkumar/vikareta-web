import { apiClient } from './client';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  subcategory?: string;
  tags: string[];
  customerId: string;
  customerName: string;
  customerEmail: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  firstResponseTime?: number; // in minutes
  totalResponseTime?: number; // in minutes
  messages: SupportMessage[];
  attachments: SupportAttachment[];
  satisfactionRating?: number;
  satisfactionFeedback?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'agent' | 'system';
  message: string;
  isInternal: boolean;
  attachments: SupportAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority?: SupportTicket['priority'];
  tags?: string[];
  attachments?: File[];
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  category?: string;
  subcategory?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface AddMessageData {
  message: string;
  isInternal?: boolean;
  attachments?: File[];
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SupportAnalytics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number; // in hours
  averageFirstResponseTime: number; // in minutes
  customerSatisfaction: number; // average rating
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  agentPerformance: Array<{
    agentId: string;
    agentName: string;
    resolvedTickets: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
  }>;
}

// ===== ADDITIONAL INTERFACES FOR EXPANDED FUNCTIONALITY =====
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  published: boolean;
  featured: boolean;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface LiveChatSession {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'waiting' | 'active' | 'ended';
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agentId?: string;
  agentName?: string;
  startedAt: string;
  endedAt?: string;
  messages: LiveChatMessage[];
  rating?: number;
  feedback?: string;
}

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'agent' | 'system';
  message: string;
  attachments?: SupportAttachment[];
  timestamp: string;
}

export interface FeedbackData {
  ticketId?: string;
  sessionId?: string;
  rating: number; // 1-5
  comment?: string;
  category: 'support_quality' | 'resolution_time' | 'agent_knowledge' | 'platform_usability' | 'overall_experience';
  metadata?: Record<string, any>;
}

export interface SupportPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  autoCreateTickets: boolean;
  preferredContactMethod: 'email' | 'chat' | 'phone';
  language: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

export class SupportService {
  // ===== EXISTING TICKET MANAGEMENT METHODS =====
  static async getTickets(filters?: TicketFilters) {
    return apiClient.get<{
      tickets: SupportTicket[];
      total: number;
      page: number;
      totalPages: number;
    }>('/support/tickets', filters);
  }

  static async getTicket(ticketId: string) {
    return apiClient.get<SupportTicket>(`/support/tickets/${ticketId}`);
  }

  static async createTicket(data: CreateTicketData) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);

    if (data.subcategory) formData.append('subcategory', data.subcategory);
    if (data.priority) formData.append('priority', data.priority);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));

    if (data.attachments) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }

    return apiClient.upload<SupportTicket>('/support/tickets', formData);
  }

  static async updateTicket(ticketId: string, data: UpdateTicketData) {
    return apiClient.put<SupportTicket>(`/support/tickets/${ticketId}`, data);
  }

  static async deleteTicket(ticketId: string) {
    return apiClient.delete(`/support/tickets/${ticketId}`);
  }

  static async closeTicket(ticketId: string, resolution?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/close`, { resolution });
  }

  static async reopenTicket(ticketId: string, reason?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/reopen`, { reason });
  }

  // ===== EXISTING MESSAGE MANAGEMENT METHODS =====
  static async getTicketMessages(ticketId: string) {
    return apiClient.get<SupportMessage[]>(`/support/tickets/${ticketId}/messages`);
  }

  static async addMessage(ticketId: string, data: AddMessageData) {
    const formData = new FormData();
    formData.append('message', data.message);
    if (data.isInternal) formData.append('isInternal', 'true');

    if (data.attachments) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }

    return apiClient.upload<SupportMessage>(`/support/tickets/${ticketId}/messages`, formData);
  }

  static async updateMessage(ticketId: string, messageId: string, message: string) {
    return apiClient.put(`/support/tickets/${ticketId}/messages/${messageId}`, { message });
  }

  static async deleteMessage(ticketId: string, messageId: string) {
    return apiClient.delete(`/support/tickets/${ticketId}/messages/${messageId}`);
  }

  // ===== EXISTING ASSIGNMENT METHODS =====
  static async assignTicket(ticketId: string, agentId: string) {
    return apiClient.post(`/support/tickets/${ticketId}/assign`, { agentId });
  }

  static async unassignTicket(ticketId: string) {
    return apiClient.post(`/support/tickets/${ticketId}/unassign`);
  }

  // ===== EXISTING CATEGORIES AND TAGS METHODS =====
  static async getCategories() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      subcategories: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    }>>('/support/categories');
  }

  static async getTags() {
    return apiClient.get<string[]>('/support/tags');
  }

  static async createCategory(data: { name: string; description: string; parentId?: string }) {
    return apiClient.post('/support/categories', data);
  }

  static async updateCategory(categoryId: string, data: { name?: string; description?: string }) {
    return apiClient.put(`/support/categories/${categoryId}`, data);
  }

  static async deleteCategory(categoryId: string) {
    return apiClient.delete(`/support/categories/${categoryId}`);
  }

  // ===== EXISTING CUSTOMER SATISFACTION METHODS =====
  static async submitSatisfactionRating(ticketId: string, rating: number, feedback?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/satisfaction`, { rating, feedback });
  }

  // ===== EXISTING ANALYTICS METHODS =====
  static async getAnalytics(period?: string) {
    return apiClient.get<SupportAnalytics>('/support/analytics', { period });
  }

  static async getAgentAnalytics(agentId: string, period?: string) {
    return apiClient.get<{
      resolvedTickets: number;
      averageResolutionTime: number;
      averageFirstResponseTime: number;
      customerSatisfaction: number;
      ticketsByStatus: Record<string, number>;
      ticketsByPriority: Record<string, number>;
    }>(`/support/analytics/agent/${agentId}`, { period });
  }

  // ===== EXISTING SLA MANAGEMENT METHODS =====
  static async getSLASettings() {
    return apiClient.get<{
      firstResponseTime: number; // in minutes
      resolutionTime: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
      }; // in hours
      businessHours: {
        start: string;
        end: string;
        timezone: string;
        workingDays: number[];
      };
    }>('/support/sla');
  }

  static async updateSLASettings(settings: any) {
    return apiClient.put('/support/sla', settings);
  }

  // ===== EXISTING KNOWLEDGE BASE METHODS =====
  static async getKnowledgeBaseArticles(filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      articles: Array<{
        id: string;
        title: string;
        content: string;
        category: string;
        tags: string[];
        views: number;
        helpful: number;
        createdAt: string;
        updatedAt: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/support/knowledge-base', filters);
  }

  static async createKnowledgeBaseArticle(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }) {
    return apiClient.post('/support/knowledge-base', data);
  }

  static async updateKnowledgeBaseArticle(articleId: string, data: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
  }) {
    return apiClient.put(`/support/knowledge-base/${articleId}`, data);
  }

  static async deleteKnowledgeBaseArticle(articleId: string) {
    return apiClient.delete(`/support/knowledge-base/${articleId}`);
  }

  static async markArticleHelpful(articleId: string) {
    return apiClient.post(`/support/knowledge-base/${articleId}/helpful`);
  }

  // ===== EXISTING FILE UPLOAD METHODS =====
  static async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<SupportAttachment>('/support/upload', formData);
  }

  static async deleteAttachment(attachmentId: string) {
    return apiClient.delete(`/support/attachments/${attachmentId}`);
  }

  // ===== EXISTING EXPORT METHODS =====
  static async exportTickets(filters?: TicketFilters, format?: 'csv' | 'excel') {
    return apiClient.get('/support/export', { ...filters, format });
  }

  // ===== EXISTING BULK OPERATIONS METHODS =====
  static async bulkUpdateTickets(ticketIds: string[], data: UpdateTicketData) {
    return apiClient.post('/support/tickets/bulk-update', { ticketIds, data });
  }

  static async bulkAssignTickets(ticketIds: string[], agentId: string) {
    return apiClient.post('/support/tickets/bulk-assign', { ticketIds, agentId });
  }

  static async bulkCloseTickets(ticketIds: string[], resolution?: string) {
    return apiClient.post('/support/tickets/bulk-close', { ticketIds, resolution });
  }

  // ===== NEW EXPANDED FUNCTIONALITY =====

  // ===== LIVE CHAT METHODS =====
  static async startLiveChat(data: {
    name: string;
    email: string;
    message: string;
    department?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<{
    sessionId: string;
    status: 'waiting' | 'active' | 'ended';
    estimatedWaitTime?: number;
    agent?: {
      id: string;
      name: string;
      avatar?: string;
      department: string;
    };
  }> {
    const response = await apiClient.post<{
      sessionId: string;
      status: 'waiting' | 'active' | 'ended';
      estimatedWaitTime?: number;
      agent?: {
        id: string;
        name: string;
        avatar?: string;
        department: string;
      };
    }>('/support/live-chat/start', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to start live chat');
    }
    return response.data;
  }

  static async sendLiveChatMessage(sessionId: string, message: string, attachments?: File[]): Promise<LiveChatMessage> {
    const formData = new FormData();
    formData.append('message', message);

    if (attachments) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.upload<LiveChatMessage>(`/support/live-chat/${sessionId}/message`, formData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send live chat message');
    }
    return response.data;
  }

  static async endLiveChat(sessionId: string, feedback?: FeedbackData): Promise<void> {
    const response = await apiClient.post(`/support/live-chat/${sessionId}/end`, { feedback });
    if (!response.success) {
      throw new Error(response.error || 'Failed to end live chat');
    }
  }

  static async getLiveChatHistory(sessionId: string): Promise<LiveChatMessage[]> {
    const response = await apiClient.get<LiveChatMessage[]>(`/support/live-chat/${sessionId}/history`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch live chat history');
    }
    return response.data;
  }

  static async getLiveChatSession(sessionId: string): Promise<LiveChatSession> {
    const response = await apiClient.get<LiveChatSession>(`/support/live-chat/${sessionId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch live chat session');
    }
    return response.data;
  }

  // ===== FEEDBACK MANAGEMENT =====
  static async submitFeedback(data: FeedbackData): Promise<void> {
    const response = await apiClient.post('/support/feedback', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit feedback');
    }
  }

  static async getFeedbackHistory(page?: number, limit?: number): Promise<{
    feedback: Array<{
      id: string;
      ticketId?: string;
      sessionId?: string;
      rating: number;
      comment?: string;
      category: string;
      createdAt: string;
      agentResponse?: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      feedback: Array<{
        id: string;
        ticketId?: string;
        sessionId?: string;
        rating: number;
        comment?: string;
        category: string;
        createdAt: string;
        agentResponse?: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/support/feedback/history', { page, limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch feedback history');
    }
    return response.data;
  }

  // ===== SUPPORT PREFERENCES =====
  static async getSupportPreferences(): Promise<SupportPreferences> {
    const response = await apiClient.get<SupportPreferences>('/support/preferences');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support preferences');
    }
    return response.data;
  }

  static async updateSupportPreferences(preferences: Partial<SupportPreferences>): Promise<void> {
    const response = await apiClient.put('/support/preferences', preferences);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update support preferences');
    }
  }

  // ===== ENHANCED KNOWLEDGE BASE =====
  static async getKnowledgeBaseArticle(articleId: string): Promise<KnowledgeBaseArticle> {
    const response = await apiClient.get<KnowledgeBaseArticle>(`/support/knowledge-base/articles/${articleId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch knowledge base article');
    }
    return response.data;
  }

  static async searchKnowledgeBase(query: string, filters?: {
    category?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<{
    articles: KnowledgeBaseArticle[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const response = await apiClient.get<{
      articles: KnowledgeBaseArticle[];
      total: number;
      page: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>('/support/knowledge-base/search', { query, ...filters });
    if (!response.success) {
      throw new Error(response.error || 'Failed to search knowledge base');
    }
    return response.data;
  }

  static async getFeaturedArticles(limit?: number): Promise<KnowledgeBaseArticle[]> {
    const response = await apiClient.get<KnowledgeBaseArticle[]>('/support/knowledge-base/featured', { limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch featured articles');
    }
    return response.data;
  }

  static async rateArticle(articleId: string, helpful: boolean): Promise<void> {
    const response = await apiClient.post(`/support/knowledge-base/articles/${articleId}/rate`, { helpful });
    if (!response.success) {
      throw new Error(response.error || 'Failed to rate article');
    }
  }

  // ===== SUPPORT STATISTICS =====
  static async getSupportStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    agent?: string;
  }): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
    ticketsByStatus: Record<string, number>;
    ticketsByPriority: Record<string, number>;
    ticketsByCategory: Record<string, number>;
    agentPerformance: Array<{
      agentId: string;
      agentName: string;
      resolvedTickets: number;
      averageResolutionTime: number;
      satisfactionRating: number;
    }>;
    recentActivity: Array<{
      type: 'ticket_created' | 'ticket_resolved' | 'ticket_closed' | 'message_added';
      ticketId: string;
      ticketTitle: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get<{
      totalTickets: number;
      openTickets: number;
      resolvedTickets: number;
      averageResolutionTime: number;
      customerSatisfaction: number;
      ticketsByStatus: Record<string, number>;
      ticketsByPriority: Record<string, number>;
      ticketsByCategory: Record<string, number>;
      agentPerformance: Array<{
        agentId: string;
        agentName: string;
        resolvedTickets: number;
        averageResolutionTime: number;
        satisfactionRating: number;
      }>;
      recentActivity: Array<{
        type: 'ticket_created' | 'ticket_resolved' | 'ticket_closed' | 'message_added';
        ticketId: string;
        ticketTitle: string;
        timestamp: string;
      }>;
    }>('/support/stats', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support statistics');
    }
    return response.data;
  }

  static async getUserSupportStats(): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    satisfactionRating: number;
    recentTickets: SupportTicket[];
  }> {
    const response = await apiClient.get<{
      totalTickets: number;
      openTickets: number;
      resolvedTickets: number;
      averageResolutionTime: number;
      satisfactionRating: number;
      recentTickets: SupportTicket[];
    }>('/support/user/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user support statistics');
    }
    return response.data;
  }

  // ===== TICKET TEMPLATES =====
  static async getTicketTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    subject: string;
    body: string;
    tags: string[];
    attachments: string[];
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      subject: string;
      body: string;
      tags: string[];
      attachments: string[];
    }>>('/support/ticket-templates');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch ticket templates');
    }
    return response.data;
  }

  static async createTicketFromTemplate(templateId: string, customData?: Record<string, any>): Promise<SupportTicket> {
    const response = await apiClient.post<SupportTicket>('/support/tickets/from-template', {
      templateId,
      customData
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to create ticket from template');
    }
    return response.data;
  }

  // ===== SUPPORT AGENTS =====
  static async getAgents(filters?: {
    department?: string;
    status?: 'online' | 'offline' | 'away';
    page?: number;
    limit?: number;
  }): Promise<{
    agents: Array<{
      id: string;
      name: string;
      email: string;
      avatar?: string;
      department: string;
      role: string;
      status: 'online' | 'offline' | 'away';
      lastActive: string;
      currentTickets: number;
      maxConcurrentTickets: number;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      agents: Array<{
        id: string;
        name: string;
        email: string;
        avatar?: string;
        department: string;
        role: string;
        status: 'online' | 'offline' | 'away';
        lastActive: string;
        currentTickets: number;
        maxConcurrentTickets: number;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/support/agents', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support agents');
    }
    return response.data;
  }

  // ===== NOTIFICATIONS =====
  static async getSupportNotifications(page?: number, limit?: number): Promise<{
    notifications: Array<{
      id: string;
      type: 'ticket_assigned' | 'ticket_updated' | 'new_message' | 'sla_breach' | 'feedback_received';
      title: string;
      message: string;
      ticketId?: string;
      read: boolean;
      createdAt: string;
    }>;
    total: number;
    unread: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      notifications: Array<{
        id: string;
        type: 'ticket_assigned' | 'ticket_updated' | 'new_message' | 'sla_breach' | 'feedback_received';
        title: string;
        message: string;
        ticketId?: string;
        read: boolean;
        createdAt: string;
      }>;
      total: number;
      unread: number;
      page: number;
      totalPages: number;
    }>('/support/notifications', { page, limit });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch support notifications');
    }
    return response.data;
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await apiClient.put(`/support/notifications/${notificationId}/read`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark notification as read');
    }
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    const response = await apiClient.put('/support/notifications/mark-all-read');
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark all notifications as read');
    }
  }
}

export const supportApi = {
  // Ticket Management
  async getTickets(filters?: TicketFilters) {
    return apiClient.get<{
      tickets: SupportTicket[];
      total: number;
      page: number;
      totalPages: number;
    }>('/support/tickets', filters);
  },

  async getTicket(ticketId: string) {
    return apiClient.get<SupportTicket>(`/support/tickets/${ticketId}`);
  },

  async createTicket(data: CreateTicketData) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);

    if (data.subcategory) formData.append('subcategory', data.subcategory);
    if (data.priority) formData.append('priority', data.priority);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));

    if (data.attachments) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }

    return apiClient.upload<SupportTicket>('/support/tickets', formData);
  },

  async updateTicket(ticketId: string, data: UpdateTicketData) {
    return apiClient.put<SupportTicket>(`/support/tickets/${ticketId}`, data);
  },

  async deleteTicket(ticketId: string) {
    return apiClient.delete(`/support/tickets/${ticketId}`);
  },

  async closeTicket(ticketId: string, resolution?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/close`, { resolution });
  },

  async reopenTicket(ticketId: string, reason?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/reopen`, { reason });
  },

  // Message Management
  async getTicketMessages(ticketId: string) {
    return apiClient.get<SupportMessage[]>(`/support/tickets/${ticketId}/messages`);
  },

  async addMessage(ticketId: string, data: AddMessageData) {
    const formData = new FormData();
    formData.append('message', data.message);
    if (data.isInternal) formData.append('isInternal', 'true');

    if (data.attachments) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }

    return apiClient.upload<SupportMessage>(`/support/tickets/${ticketId}/messages`, formData);
  },

  async updateMessage(ticketId: string, messageId: string, message: string) {
    return apiClient.put(`/support/tickets/${ticketId}/messages/${messageId}`, { message });
  },

  async deleteMessage(ticketId: string, messageId: string) {
    return apiClient.delete(`/support/tickets/${ticketId}/messages/${messageId}`);
  },

  // Assignment
  async assignTicket(ticketId: string, agentId: string) {
    return apiClient.post(`/support/tickets/${ticketId}/assign`, { agentId });
  },

  async unassignTicket(ticketId: string) {
    return apiClient.post(`/support/tickets/${ticketId}/unassign`);
  },

  // Categories and Tags
  async getCategories() {
    return apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      subcategories: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    }>>('/support/categories');
  },

  async getTags() {
    return apiClient.get<string[]>('/support/tags');
  },

  async createCategory(data: { name: string; description: string; parentId?: string }) {
    return apiClient.post('/support/categories', data);
  },

  async updateCategory(categoryId: string, data: { name?: string; description?: string }) {
    return apiClient.put(`/support/categories/${categoryId}`, data);
  },

  async deleteCategory(categoryId: string) {
    return apiClient.delete(`/support/categories/${categoryId}`);
  },

  // Customer Satisfaction
  async submitSatisfactionRating(ticketId: string, rating: number, feedback?: string) {
    return apiClient.post(`/support/tickets/${ticketId}/satisfaction`, { rating, feedback });
  },

  // Analytics
  async getAnalytics(period?: string) {
    return apiClient.get<SupportAnalytics>('/support/analytics', { period });
  },

  async getAgentAnalytics(agentId: string, period?: string) {
    return apiClient.get<{
      resolvedTickets: number;
      averageResolutionTime: number;
      averageFirstResponseTime: number;
      customerSatisfaction: number;
      ticketsByStatus: Record<string, number>;
      ticketsByPriority: Record<string, number>;
    }>(`/support/analytics/agent/${agentId}`, { period });
  },

  // SLA Management
  async getSLASettings() {
    return apiClient.get<{
      firstResponseTime: number; // in minutes
      resolutionTime: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
      }; // in hours
      businessHours: {
        start: string;
        end: string;
        timezone: string;
        workingDays: number[];
      };
    }>('/support/sla');
  },

  async updateSLASettings(settings: any) {
    return apiClient.put('/support/sla', settings);
  },

  // Knowledge Base
  async getKnowledgeBaseArticles(filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiClient.get<{
      articles: Array<{
        id: string;
        title: string;
        content: string;
        category: string;
        tags: string[];
        views: number;
        helpful: number;
        createdAt: string;
        updatedAt: string;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/support/knowledge-base', filters);
  },

  async createKnowledgeBaseArticle(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }) {
    return apiClient.post('/support/knowledge-base', data);
  },

  async updateKnowledgeBaseArticle(articleId: string, data: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
  }) {
    return apiClient.put(`/support/knowledge-base/${articleId}`, data);
  },

  async deleteKnowledgeBaseArticle(articleId: string) {
    return apiClient.delete(`/support/knowledge-base/${articleId}`);
  },

  async markArticleHelpful(articleId: string) {
    return apiClient.post(`/support/knowledge-base/${articleId}/helpful`);
  },

  // File Upload
  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<SupportAttachment>('/support/upload', formData);
  },

  async deleteAttachment(attachmentId: string) {
    return apiClient.delete(`/support/attachments/${attachmentId}`);
  },

  // Export
  async exportTickets(filters?: TicketFilters, format?: 'csv' | 'excel') {
    return apiClient.get('/support/export', { ...filters, format });
  },

  // Bulk Operations
  async bulkUpdateTickets(ticketIds: string[], data: UpdateTicketData) {
    return apiClient.post('/support/tickets/bulk-update', { ticketIds, data });
  },

  async bulkAssignTickets(ticketIds: string[], agentId: string) {
    return apiClient.post('/support/tickets/bulk-assign', { ticketIds, agentId });
  },

  async bulkCloseTickets(ticketIds: string[], resolution?: string) {
    return apiClient.post('/support/tickets/bulk-close', { ticketIds, resolution });
  }
};