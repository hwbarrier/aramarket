import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, NotificationOptions, PushNotificationOptions, InAppNotification } from '../types/notification';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  toasts: Toast[];
  showToast: (options: NotificationOptions) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  showPushNotification: (options: PushNotificationOptions) => Promise<void>;
  isNotificationSupported: boolean;
  notificationPermission: NotificationPermission;
  notifications: InAppNotification[];
  addNotification: (notification: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied'
  );
  const { authState } = useAuth();
  const notificationUserId = authState.user?.id || "guest";
  const notificationKey = `aramarket_notifications_${notificationUserId}`;

  const isNotificationSupported = typeof window !== 'undefined' && 'Notification' in window;
  useEffect(() => {
    try { setNotifications(JSON.parse(localStorage.getItem(notificationKey) || '[]')); } catch { setNotifications([]); }
  }, [notificationKey]);
  const readNotifications = (userId: string): InAppNotification[] => {
    try {
      const stored = localStorage.getItem(`aramarket_notifications_${userId}`);
      return stored ? JSON.parse(stored) as InAppNotification[] : [];
    } catch {
      return [];
    }
  };

  const persist = (items: InAppNotification[]) => {
    setNotifications(items);
    localStorage.setItem(notificationKey, JSON.stringify(items));
  };

  const addNotification = useCallback((item: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>) => {
    const notification: InAppNotification = {
      ...item,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const targetKey = `aramarket_notifications_${item.userId}`;
    const targetNotifications = item.userId === notificationUserId
      ? [...notifications]
      : readNotifications(item.userId);
    const next = [notification, ...targetNotifications];
    localStorage.setItem(targetKey, JSON.stringify(next));
    if (item.userId === notificationUserId) setNotifications(next);
  }, [notificationUserId, notifications]);

  const markNotificationRead = useCallback((id: string) => {
    persist(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }, [notifications, notificationKey]);

  const markAllNotificationsRead = useCallback(() => {
    persist(notifications.map(n => ({ ...n, read: true })));
  }, [notifications, notificationKey]);

  const showToast = useCallback((options: NotificationOptions): string => {
    const id = options.id || Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    
    const toast: Toast = {
      id,
      title: options.title || '',
      description: options.description || '',
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      position: options.position || 'top-right',
      closable: options.closable ?? true,
      action: options.action,
      image: options.image,
      icon: options.icon,
      timestamp,
      isVisible: true
    };

    setToasts(prev => [...prev, toast]);

    // Auto-hide après la durée spécifiée
    if (toast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!isNotificationSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }, [isNotificationSupported]);

  const showPushNotification = useCallback(async (options: PushNotificationOptions): Promise<void> => {
    if (!isNotificationSupported || notificationPermission !== 'granted') {
      // Fallback vers toast si les notifications push ne sont pas disponibles
      showToast({
        title: options.title,
        description: options.body,
        type: 'info',
        image: options.image
      });
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        badge: options.badge,
        image: options.image,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
        vibrate: options.vibrate
      });

      // Gestion des actions si supportées
      if (options.actions && 'serviceWorker' in navigator) {
        // Les actions nécessitent un service worker
        // Pour l'instant, on utilise les événements de base
        notification.onclick = () => {
          if (options.data?.url) {
            window.open(options.data.url);
          }
          notification.close();
        };
      }

      // Auto-fermeture après 10 secondes si pas d'interaction requise
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
      // Fallback vers toast
      showToast({
        title: options.title,
        description: options.body,
        type: 'error'
      });
    }
  }, [isNotificationSupported, notificationPermission, showToast]);

  // Écouter les changements de permission
  useEffect(() => {
    if (isNotificationSupported) {
      const checkPermission = () => {
        setNotificationPermission(Notification.permission);
      };

      // Vérifier périodiquement (certains navigateurs ne déclenchent pas d'événement)
      const interval = setInterval(checkPermission, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isNotificationSupported]);

  const value: NotificationContextType = {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    requestNotificationPermission,
    showPushNotification,
    isNotificationSupported,
    notificationPermission, notifications, addNotification, markNotificationRead, markAllNotificationsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}