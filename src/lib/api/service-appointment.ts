import { apiClient } from './client';

export interface ServiceAppointment {
  id: string;
  orderId: string;
  serviceId: string;
  scheduledDate: string;
  duration?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    title: string;
    providerId: string;
    price: number;
    duration?: string;
  };
  order: {
    id: string;
    orderNumber: string;
    buyerId: string;
    sellerId: string;
    status: string;
  };
}

export interface CreateServiceAppointmentData {
  orderId: string;
  serviceId: string;
  scheduledDate: string;
  duration?: string;
  notes?: string;
}

export interface UpdateServiceAppointmentData {
  scheduledDate?: string;
  duration?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}

export interface ServiceAppointmentFilters {
  serviceId?: string;
  status?: string;
  providerId?: string;
  customerId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export class ServiceAppointmentService {
  // Get all service appointments
  static async getServiceAppointments(filters?: ServiceAppointmentFilters): Promise<{
    appointments: ServiceAppointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      appointments: ServiceAppointment[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-appointments', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service appointments');
    }
    return response.data;
  }

  // Get service appointment by ID
  static async getServiceAppointmentById(id: string): Promise<ServiceAppointment> {
    const response = await apiClient.get<ServiceAppointment>(`/service-appointments/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch service appointment');
    }
    return response.data;
  }

  // Create new service appointment
  static async createServiceAppointment(data: CreateServiceAppointmentData): Promise<ServiceAppointment> {
    const response = await apiClient.post<ServiceAppointment>('/service-appointments', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create service appointment');
    }
    return response.data;
  }

  // Update service appointment
  static async updateServiceAppointment(id: string, data: UpdateServiceAppointmentData): Promise<ServiceAppointment> {
    const response = await apiClient.put<ServiceAppointment>(`/service-appointments/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update service appointment');
    }
    return response.data;
  }

  // Update appointment status
  static async updateAppointmentStatus(id: string, status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'): Promise<ServiceAppointment> {
    const response = await apiClient.patch<ServiceAppointment>(`/service-appointments/${id}/status`, { status });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update appointment status');
    }
    return response.data;
  }

  // Reschedule appointment
  static async rescheduleAppointment(id: string, data: {
    scheduledDate: string;
    duration?: string;
  }): Promise<ServiceAppointment> {
    const response = await apiClient.post<ServiceAppointment>(`/service-appointments/${id}/reschedule`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reschedule appointment');
    }
    return response.data;
  }

  // Cancel appointment
  static async cancelAppointment(id: string, reason?: string): Promise<ServiceAppointment> {
    const response = await apiClient.post<ServiceAppointment>(`/service-appointments/${id}/cancel`, { reason });
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel appointment');
    }
    return response.data;
  }

  // Get appointments for current user
  static async getMyAppointments(filters?: ServiceAppointmentFilters): Promise<{
    appointments: ServiceAppointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      appointments: ServiceAppointment[];
      total: number;
      page: number;
      totalPages: number;
    }>('/service-appointments/my', filters);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch my appointments');
    }
    return response.data;
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(limit: number = 10): Promise<ServiceAppointment[]> {
    const response = await apiClient.get<ServiceAppointment[]>(`/service-appointments/upcoming?limit=${limit}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch upcoming appointments');
    }
    return response.data;
  }

  // Get today's appointments
  static async getTodaysAppointments(): Promise<ServiceAppointment[]> {
    const response = await apiClient.get<ServiceAppointment[]>('/service-appointments/today');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch today\'s appointments');
    }
    return response.data;
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<ServiceAppointment[]> {
    const response = await apiClient.get<ServiceAppointment[]>(`/service-appointments/range?start=${startDate}&end=${endDate}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch appointments by date range');
    }
    return response.data;
  }

  // Get appointment statistics
  static async getAppointmentStats(): Promise<{
    totalAppointments: number;
    scheduledAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    upcomingAppointments: number;
    todaysAppointments: number;
    completionRate: number;
    averageDuration: number;
    appointmentsByStatus: Record<string, number>;
    appointmentsByService: Record<string, number>;
  }> {
    const response = await apiClient.get<{
      totalAppointments: number;
      scheduledAppointments: number;
      completedAppointments: number;
      cancelledAppointments: number;
      noShowAppointments: number;
      upcomingAppointments: number;
      todaysAppointments: number;
      completionRate: number;
      averageDuration: number;
      appointmentsByStatus: Record<string, number>;
      appointmentsByService: Record<string, number>;
    }>('/service-appointments/stats');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch appointment stats');
    }
    return response.data;
  }

  // Send appointment reminder
  static async sendAppointmentReminder(id: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      sentTo: string;
    }>(`/service-appointments/${id}/reminder`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send appointment reminder');
    }
    return response.data;
  }

  // Bulk update appointment statuses
  static async bulkUpdateAppointmentStatuses(updates: Array<{
    id: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  }>): Promise<{
    success: boolean;
    updated: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const response = await apiClient.post<{
      success: boolean;
      updated: number;
      failed: number;
      results: Array<{
        id: string;
        success: boolean;
        error?: string;
      }>;
    }>('/service-appointments/bulk-update-status', { updates });
    if (!response.success) {
      throw new Error(response.error || 'Failed to bulk update appointment statuses');
    }
    return response.data;
  }

  // Get available time slots for a service
  static async getAvailableTimeSlots(serviceId: string, date: string): Promise<Array<{
    startTime: string;
    endTime: string;
    available: boolean;
    duration: string;
  }>> {
    const response = await apiClient.get<Array<{
      startTime: string;
      endTime: string;
      available: boolean;
      duration: string;
    }>>(`/service-appointments/available-slots?serviceId=${serviceId}&date=${date}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch available time slots');
    }
    return response.data;
  }

  // Check appointment conflicts
  static async checkAppointmentConflicts(data: {
    serviceId: string;
    scheduledDate: string;
    duration?: string;
    excludeAppointmentId?: string;
  }): Promise<{
    hasConflict: boolean;
    conflictingAppointments?: ServiceAppointment[];
    suggestedAlternatives?: Array<{
      startTime: string;
      endTime: string;
    }>;
  }> {
    const response = await apiClient.post<{
      hasConflict: boolean;
      conflictingAppointments?: ServiceAppointment[];
      suggestedAlternatives?: Array<{
        startTime: string;
        endTime: string;
      }>;
    }>('/service-appointments/check-conflicts', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to check appointment conflicts');
    }
    return response.data;
  }

  // Get appointment calendar view
  static async getAppointmentCalendar(month: number, year: number): Promise<{
    month: number;
    year: number;
    appointments: Array<{
      id: string;
      date: string;
      serviceTitle: string;
      status: string;
      duration?: string;
    }>;
    busyDays: string[];
  }> {
    const response = await apiClient.get<{
      month: number;
      year: number;
      appointments: Array<{
        id: string;
        date: string;
        serviceTitle: string;
        status: string;
        duration?: string;
      }>;
      busyDays: string[];
    }>(`/service-appointments/calendar?month=${month}&year=${year}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch appointment calendar');
    }
    return response.data;
  }
}