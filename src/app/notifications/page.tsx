'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell,
  Package,
  CreditCard,
  Star,
  Gift,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { notificationsApi } from '@/lib/api/notifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'review' | 'promotion' | 'system';
  read: boolean;
  date: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'payment' | 'review' | 'promotion' | 'system'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.getNotifications({
        page: 1,
        limit: 50,
        type: filter === 'all' ? undefined : filter,
        unreadOnly: filter === 'unread'
      });
      
      if (response.success) {
        setNotifications(response.data.notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type === 'message' ? 'system' : n.type === 'rfq' ? 'order' : n.type as 'order' | 'payment' | 'review' | 'promotion' | 'system',
          read: n.read,
          date: n.createdAt,
          actionUrl: n.actionUrl
        })));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast.success('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Error', 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Deleted', 'Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error', 'Failed to delete notification');
    }
  };

  const deleteSelected = async () => {
    try {
      setNotifications(prev => 
        prev.filter(notif => !selectedNotifications.includes(notif.id))
      );
      setSelectedNotifications([]);
      toast.success('Deleted', `${selectedNotifications.length} notifications deleted`);
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Error', 'Failed to delete notifications');
    }
  };

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    const filteredNotifs = getFilteredNotifications();
    setSelectedNotifications(filteredNotifs.map(notif => notif.id));
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'promotion':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notification.read;
      return notification.type === filter;
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-muted rounded h-8 w-48 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-20"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
              { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { key: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
              { key: 'promotion', label: 'Promotions', count: notifications.filter(n => n.type === 'promotion').length },
              { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.key as typeof filter)}
                className="flex items-center gap-2"
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearSelection}>
                    Clear
                  </Button>
                  <Button size="sm" variant="outline" onClick={deleteSelected}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-card rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  } ${
                    selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                          {notification.actionUrl && (
                            <Button size="sm" variant="outline" className="text-xs">
                              View Details
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}