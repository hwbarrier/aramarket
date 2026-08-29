export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'vendor' | 'admin';
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: MessageAttachment[];
  replyToId?: string; // Pour les réponses à des messages spécifiques
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: ConversationParticipant[];
  subject: string;
  productId?: string; // Conversation liée à un produit spécifique
  productName?: string;
  lastMessage?: Message;
  lastMessageTime: Date;
  unreadCount: Record<string, number>; // Nombre de messages non lus par participant
  status: 'active' | 'archived' | 'closed';
  createdAt: Date;
  tags?: string[]; // Tags pour catégoriser les conversations
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'inquiry' | 'support' | 'order' | 'shipping';
  isActive: boolean;
  createdBy: string;
}

export interface ConversationFilter {
  status?: 'active' | 'archived' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  unreadOnly?: boolean;
  participantRole?: 'buyer' | 'vendor' | 'admin';
  dateRange?: {
    start: Date;
    end: Date;
  };
  productId?: string;
  tags?: string[];
}

export interface MessageNotification {
  id: string;
  conversationId: string;
  messageId: string;
  recipientId: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ConversationStats {
  totalConversations: number;
  activeConversations: number;
  unreadMessages: number;
  averageResponseTime: number; // en minutes
  responseRate: number; // pourcentage
  satisfactionRating?: number; // note moyenne
}