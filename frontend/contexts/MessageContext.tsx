import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Message, 
  Conversation, 
  ConversationParticipant, 
  MessageTemplate,
  ConversationFilter,
  ConversationStats,
  MessageAttachment 
} from '../types/message';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface MessageContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  templates: MessageTemplate[];
  stats: ConversationStats;
  isLoading: boolean;
  
  // Gestion des conversations
  getConversations: (filter?: ConversationFilter) => Conversation[];
  createConversation: (participantIds: string[], subject: string, productId?: string) => Promise<string>;
  getConversation: (conversationId: string) => Promise<Conversation | null>;
  setCurrentConversation: (conversationId: string | null) => void;
  updateConversationStatus: (conversationId: string, status: 'active' | 'archived' | 'closed') => void;
  updateConversationPriority: (conversationId: string, priority: 'low' | 'normal' | 'high' | 'urgent') => void;
  addConversationTag: (conversationId: string, tag: string) => void;
  removeConversationTag: (conversationId: string, tag: string) => void;
  
  // Gestion des messages
  getMessages: (conversationId: string) => Promise<Message[]>;
  sendMessage: (conversationId: string, content: string, attachments?: MessageAttachment[], replyToId?: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  deleteMessage: (messageId: string) => void;
  
  // Templates
  getTemplates: (category?: string) => MessageTemplate[];
  createTemplate: (template: Omit<MessageTemplate, 'id' | 'createdBy'>) => void;
  updateTemplate: (templateId: string, updates: Partial<MessageTemplate>) => void;
  deleteTemplate: (templateId: string) => void;
  
  // Recherche et filtrage
  searchConversations: (query: string) => Conversation[];
  searchMessages: (conversationId: string, query: string) => Message[];
  
  // Stats et analytics
  getConversationStats: (userId?: string) => ConversationStats;
  getUnreadCount: (userId?: string) => number;
  
  // Administration
  getAllConversations: () => Conversation[]; // Admin seulement
  flagConversation: (conversationId: string, reason: string) => void;
  unflagConversation: (conversationId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock data pour le développement
const mockParticipants: ConversationParticipant[] = [
  {
    userId: 'user1',
    name: 'Alice Martin',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  },
  {
    userId: 'vendor1',
    name: 'TechStore Pro',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastSeen: new Date('2024-02-23T10:30:00')
  },
  {
    userId: 'vendor2',
    name: 'Green Fashion',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  },
  {
    userId: 'admin1',
    name: 'Support AraMarket',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true
  }
];

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['user1', 'vendor1'],
    participants: [mockParticipants[0], mockParticipants[1]],
    subject: 'Question sur le casque Bluetooth',
    productId: '1',
    productName: 'Wireless Bluetooth Headphones Premium',
    lastMessageTime: new Date('2024-02-23T14:30:00'),
    unreadCount: { 'user1': 0, 'vendor1': 1 },
    status: 'active',
    createdAt: new Date('2024-02-22T09:15:00'),
    priority: 'normal',
    tags: ['product-inquiry']
  },
  {
    id: 'conv2',
    participantIds: ['user1', 'vendor2'],
    participants: [mockParticipants[0], mockParticipants[2]],
    subject: 'Problème de livraison',
    lastMessageTime: new Date('2024-02-23T11:45:00'),
    unreadCount: { 'user1': 2, 'vendor2': 0 },
    status: 'active',
    createdAt: new Date('2024-02-20T16:20:00'),
    priority: 'high',
    tags: ['shipping', 'urgent']
  },
  {
    id: 'conv3',
    participantIds: ['user1', 'admin1'],
    participants: [mockParticipants[0], mockParticipants[3]],
    subject: 'Support technique',
    lastMessageTime: new Date('2024-02-22T18:00:00'),
    unreadCount: { 'user1': 0, 'admin1': 0 },
    status: 'closed',
    createdAt: new Date('2024-02-21T14:10:00'),
    priority: 'normal',
    tags: ['support', 'resolved']
  }
];

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      conversationId: 'conv1',
      senderId: 'user1',
      senderName: 'Alice Martin',
      senderRole: 'buyer',
      content: 'Bonjour, j\'aimerais savoir si ce casque est compatible avec les appareils iOS ?',
      timestamp: new Date('2024-02-22T09:15:00'),
      isRead: true
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      senderId: 'vendor1',
      senderName: 'TechStore Pro',
      senderRole: 'vendor',
      content: 'Bonjour Alice ! Oui, ce casque est entièrement compatible avec tous les appareils iOS grâce à la technologie Bluetooth 5.0. Vous pourrez l\'utiliser avec votre iPhone, iPad, et autres appareils Apple sans problème.',
      timestamp: new Date('2024-02-22T09:32:00'),
      isRead: true
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      senderId: 'user1',
      senderName: 'Alice Martin',
      senderRole: 'buyer',
      content: 'Parfait ! Et quelle est l\'autonomie réelle en utilisation normale ?',
      timestamp: new Date('2024-02-23T14:30:00'),
      isRead: false
    }
  ],
  conv2: [
    {
      id: 'msg4',
      conversationId: 'conv2',
      senderId: 'user1',
      senderName: 'Alice Martin',
      senderRole: 'buyer',
      content: 'Bonjour, ma commande devait arriver hier mais je n\'ai encore rien reçu. Pouvez-vous me donner des nouvelles ?',
      timestamp: new Date('2024-02-23T10:15:00'),
      isRead: true
    },
    {
      id: 'msg5',
      conversationId: 'conv2',
      senderId: 'vendor2',
      senderName: 'Green Fashion',
      senderRole: 'vendor',
      content: 'Bonjour Alice, je vais vérifier immédiatement le statut de votre commande et vous tenir informée.',
      timestamp: new Date('2024-02-23T10:45:00'),
      isRead: true
    },
    {
      id: 'msg6',
      conversationId: 'conv2',
      senderId: 'vendor2',
      senderName: 'Green Fashion',
      senderRole: 'vendor',
      content: 'Votre colis a été expédié hier soir et devrait arriver aujourd\'hui avant 18h. Voici le numéro de suivi : TR123456789.',
      timestamp: new Date('2024-02-23T11:45:00'),
      isRead: false
    }
  ]
};

const mockTemplates: MessageTemplate[] = [
  {
    id: 'template1',
    title: 'Salutation client',
    content: 'Bonjour {customer_name}, merci pour votre intérêt pour nos produits !',
    category: 'greeting',
    isActive: true,
    createdBy: 'vendor1'
  },
  {
    id: 'template2',
    title: 'Demande d\'informations produit',
    content: 'Puis-je avoir plus d\'informations sur ce produit ? Notamment concernant {specific_question}.',
    category: 'inquiry',
    isActive: true,
    createdBy: 'user1'
  },
  {
    id: 'template3',
    title: 'Suivi de commande',
    content: 'Votre commande #{order_number} a été expédiée. Numéro de suivi : {tracking_number}',
    category: 'shipping',
    isActive: true,
    createdBy: 'vendor1'
  }
];

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { authState } = useAuth();
  const { showToast } = useNotifications();
  const [conversations, setConversations] = useState<Conversation[]>(import.meta.env.DEV ? mockConversations : []);
  const [currentConversation, setCurrentConversationState] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>(import.meta.env.DEV ? mockTemplates : []);
  const [isLoading, setIsLoading] = useState(false);

  // Calcul des stats
  const stats: ConversationStats = {
    totalConversations: conversations.length,
    activeConversations: conversations.filter(c => c.status === 'active').length,
    unreadMessages: conversations.reduce((acc, conv) => {
      const userId = authState.user?.id || '';
      return acc + (conv.unreadCount[userId] || 0);
    }, 0),
    averageResponseTime: import.meta.env.DEV ? 45 : 0,
    responseRate: import.meta.env.DEV ? 95 : 0
  };

  const getConversations = (filter?: ConversationFilter): Conversation[] => {
    let filtered = [...conversations];
    const userId = authState.user?.id || '';

    // Filtrer par participant
    filtered = filtered.filter(conv => conv.participantIds.includes(userId));

    if (filter) {
      if (filter.status) {
        filtered = filtered.filter(conv => conv.status === filter.status);
      }
      if (filter.priority) {
        filtered = filtered.filter(conv => conv.priority === filter.priority);
      }
      if (filter.unreadOnly) {
        filtered = filtered.filter(conv => (conv.unreadCount[userId] || 0) > 0);
      }
      if (filter.productId) {
        filtered = filtered.filter(conv => conv.productId === filter.productId);
      }
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter(conv => 
          filter.tags!.some(tag => conv.tags?.includes(tag))
        );
      }
    }

    return filtered.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  };

  const createConversation = async (
    participantIds: string[], 
    subject: string, 
    productId?: string
  ): Promise<string> => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participantIds: [...participantIds, authState.user?.id || ''],
      participants: [], // Sera rempli avec les vraies données
      subject,
      productId,
      lastMessageTime: new Date(),
      unreadCount: {},
      status: 'active',
      createdAt: new Date(),
      priority: 'normal'
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  const getConversation = async (conversationId: string): Promise<Conversation | null> => {
    return conversations.find(c => c.id === conversationId) || null;
  };

  const setCurrentConversation = (conversationId: string | null) => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      setCurrentConversationState(conversation || null);
      if (conversation) {
        setMessages(mockMessages[conversationId] || []);
        markConversationAsRead(conversationId);
      }
    } else {
      setCurrentConversationState(null);
      setMessages([]);
    }
  };

  const getMessages = async (conversationId: string): Promise<Message[]> => {
    return mockMessages[conversationId] || [];
  };

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    attachments?: MessageAttachment[], 
    replyToId?: string
  ): Promise<void> => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: authState.user?.id || '',
      senderName: authState.user?.name || '',
      senderRole: authState.user?.role as 'buyer' | 'vendor' | 'admin' || 'buyer',
      content,
      timestamp: new Date(),
      isRead: false,
      attachments,
      replyToId
    };

    // Ajouter le message
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    // Mettre à jour la conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedUnreadCount = { ...conv.unreadCount };
        conv.participantIds.forEach(pid => {
          if (pid !== authState.user?.id) {
            updatedUnreadCount[pid] = (updatedUnreadCount[pid] || 0) + 1;
          }
        });

        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          unreadCount: updatedUnreadCount
        };
      }
      return conv;
    }));

    if (conversationId === currentConversation?.id) {
      setMessages(prev => [...prev, newMessage]);
    }

    // Notification
    showToast({
      title: 'Message envoyé',
      description: 'Votre message a été envoyé avec succès',
      type: 'success'
    });
  };

  const markMessageAsRead = (messageId: string) => {
    Object.keys(mockMessages).forEach(convId => {
      mockMessages[convId] = mockMessages[convId].map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      );
    });
    
    if (currentConversation) {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const markConversationAsRead = (conversationId: string) => {
    const userId = authState.user?.id || '';
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: { ...conv.unreadCount, [userId]: 0 } }
        : conv
    ));
  };

  const updateConversationStatus = (
    conversationId: string, 
    status: 'active' | 'archived' | 'closed'
  ) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, status } : conv
    ));
  };

  const updateConversationPriority = (
    conversationId: string, 
    priority: 'low' | 'normal' | 'high' | 'urgent'
  ) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, priority } : conv
    ));
  };

  const addConversationTag = (conversationId: string, tag: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId 
        ? { ...conv, tags: [...(conv.tags || []), tag] }
        : conv
    ));
  };

  const removeConversationTag = (conversationId: string, tag: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId 
        ? { ...conv, tags: (conv.tags || []).filter(t => t !== tag) }
        : conv
    ));
  };

  const searchConversations = (query: string): Conversation[] => {
    const lowercaseQuery = query.toLowerCase();
    return conversations.filter(conv =>
      conv.subject.toLowerCase().includes(lowercaseQuery) ||
      conv.participants.some(p => p.name.toLowerCase().includes(lowercaseQuery)) ||
      conv.productName?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const searchMessages = (conversationId: string, query: string): Message[] => {
    const conversationMessages = mockMessages[conversationId] || [];
    const lowercaseQuery = query.toLowerCase();
    return conversationMessages.filter(msg =>
      msg.content.toLowerCase().includes(lowercaseQuery) ||
      msg.senderName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTemplates = (category?: string): MessageTemplate[] => {
    if (category) {
      return templates.filter(t => t.category === category && t.isActive);
    }
    return templates.filter(t => t.isActive);
  };

  const createTemplate = (template: Omit<MessageTemplate, 'id' | 'createdBy'>) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdBy: authState.user?.id || ''
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const updateTemplate = (templateId: string, updates: Partial<MessageTemplate>) => {
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, ...updates } : t
    ));
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const deleteMessage = (messageId: string) => {
    Object.keys(mockMessages).forEach(convId => {
      mockMessages[convId] = mockMessages[convId].filter(msg => msg.id !== messageId);
    });
    
    if (currentConversation) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const getConversationStats = (userId?: string): ConversationStats => {
    return stats; // Mock pour l'instant
  };

  const getUnreadCount = (userId?: string): number => {
    const targetUserId = userId || authState.user?.id || '';
    return conversations.reduce((total, conv) => {
      return total + (conv.unreadCount[targetUserId] || 0);
    }, 0);
  };

  const getAllConversations = (): Conversation[] => {
    // Admin seulement
    if (authState.user?.role !== 'admin') {
      return [];
    }
    return conversations;
  };

  const flagConversation = (conversationId: string, reason: string) => {
    // Admin functionality
    void conversationId;
    void reason;
  };

  const unflagConversation = (conversationId: string) => {
    // Admin functionality
    void conversationId;
  };

  const value: MessageContextType = {
    conversations,
    currentConversation,
    messages,
    templates,
    stats,
    isLoading,
    getConversations,
    createConversation,
    getConversation,
    setCurrentConversation,
    updateConversationStatus,
    updateConversationPriority,
    addConversationTag,
    removeConversationTag,
    getMessages,
    sendMessage,
    markMessageAsRead,
    markConversationAsRead,
    deleteMessage,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    searchConversations,
    searchMessages,
    getConversationStats,
    getUnreadCount,
    getAllConversations,
    flagConversation,
    unflagConversation
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}