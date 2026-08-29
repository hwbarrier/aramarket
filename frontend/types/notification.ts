export type NotificationType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'loading';

export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export interface NotificationOptions {
  id?: string;
  title?: string;
  description?: string;
  type?: NotificationType;
  duration?: number; // en millisecondes, 0 = persiste jusqu'à fermeture manuelle
  position?: NotificationPosition;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
  icon?: React.ReactNode;
}

export interface Toast extends Required<Omit<NotificationOptions, 'action'>> {
  action?: NotificationOptions['action'];
  timestamp: number;
  isVisible: boolean;
}

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  promotionalEmails: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  stockAlerts: boolean;
  newArrivals: boolean;
  recommendations: boolean;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  href?: string;
}