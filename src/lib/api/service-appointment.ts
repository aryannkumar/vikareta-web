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
    throw new Error('Update service appointment endpoint not implemented in backend');
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
    const response = await apiClient.patch<ServiceAppointment>(`/service-appointments/${id}/reschedule`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reschedule appointment');
    }
    return response.data;
  }

  // Cancel appointment
  static async cancelAppointment(id: string, reason?: string): Promise<ServiceAppointment> {
    throw new Error('Cancel appointment endpoint not implemented in backend');
  }

  // Get appointments for current user
  static async getMyAppointments(filters?: ServiceAppointmentFilters): Promise<{
    appointments: ServiceAppointment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    throw new Error('Get my appointments endpoint not implemented in backend');
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(limit: number = 10): Promise<ServiceAppointment[]> {
    throw new Error('Get upcoming appointments endpoint not implemented in backend');
  }

  // Get today's appointments
  static async getTodaysAppointments(): Promise<ServiceAppointment[]> {
    throw new Error('Get today\'s appointments endpoint not implemented in backend');
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<ServiceAppointment[]> {
    throw new Error('Get appointments by date range endpoint not implemented in backend');
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
    throw new Error('Get appointment stats endpoint not implemented in backend');
  }

  // Send appointment reminder
  static async sendAppointmentReminder(id: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
  }> {
    throw new Error('Send appointment reminder endpoint not implemented in backend');
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
    throw new Error('Bulk update appointment statuses endpoint not implemented in backend');
  }

  // Get available time slots for a service
  static async getAvailableTimeSlots(serviceId: string, date: string): Promise<Array<{
    startTime: string;
    endTime: string;
    available: boolean;
    duration: string;
  }>> {
    throw new Error('Get available time slots endpoint not implemented in backend');
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
    throw new Error('Check appointment conflicts endpoint not implemented in backend');
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
    throw new Error('Get appointment calendar endpoint not implemented in backend');
  }
}