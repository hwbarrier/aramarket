import { useEffect, useState } from "react";
import { Bell, X, MessageSquare, User, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Message } from "../types/message";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MessageNotificationProps {
  onPageChange?: (page: string) => void;
}

interface NotificationMessage extends Message {
  conversationSubject?: string;
  senderAvatar?: string;
}

export function MessageNotifications({ onPageChange }: MessageNotificationProps) {
  const { messages, conversations, getUnreadCount, markConversationAsRead } = useMessages();
  const { authState } = useAuth();
  const { showToast } = useNotifications();
  const [pendingNotifications, setPendingNotifications] = useState<NotificationMessage[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Détecter les nouveaux messages
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const userId = authState.user?.id;
    if (!userId) return;

    // Simuler la réception de nouveaux messages
    const checkForNewMessages = () => {
      const recentMessages = messages.filter(msg => 
        msg.senderId !== userId && 
        !msg.isRead &&
        new Date().getTime() - msg.timestamp.getTime() < 5000 // Messages des 5 dernières secondes
      );

      if (recentMessages.length > 0) {
        const enrichedMessages: NotificationMessage[] = recentMessages.map(msg => {
          const conversation = conversations.find(c => c.id === msg.conversationId);
          const sender = conversation?.participants.find(p => p.userId === msg.senderId);
          
          return {
            ...msg,
            conversationSubject: conversation?.subject,
            senderAvatar: sender?.avatar
          };
        });

        setPendingNotifications(prev => [...prev, ...enrichedMessages]);
        setIsVisible(true);

        // Afficher une notification toast
        if (enrichedMessages.length === 1) {
          showToast({
            title: 'Nouveau message',
            description: `${enrichedMessages[0].senderName}: ${enrichedMessages[0].content.substring(0, 50)}...`,
            type: 'info'
          });
        } else {
          showToast({
            title: 'Nouveaux messages',
            description: `${enrichedMessages.length} nouveaux messages reçus`,
            type: 'info'
          });
        }
      }
    };

    const interval = setInterval(checkForNewMessages, 2000);
    return () => clearInterval(interval);
  }, [messages, conversations, authState, showToast]);

  const handleViewMessage = (notification: NotificationMessage) => {
    // Marquer la conversation comme lue
    markConversationAsRead(notification.conversationId);
    
    // Supprimer la notification
    setPendingNotifications(prev => prev.filter(n => n.id !== notification.id));
    
    // Naviguer vers la messagerie
    if (onPageChange) {
      onPageChange('messaging');
    }
  };

  const handleDismiss = (notificationId: string) => {
    setPendingNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleDismissAll = () => {
    setPendingNotifications([]);
    setIsVisible(false);
  };

  // Auto-hide après 10 secondes
  useEffect(() => {
    if (pendingNotifications.length === 0) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setPendingNotifications([]), 300);
    }, 10000);

    return () => clearTimeout(timer);
  }, [pendingNotifications.length]);

  if (!isVisible || pendingNotifications.length === 0) return null;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}min`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-w-sm">
      <AnimatePresence>
        <Card className="shadow-lg border border-border bg-card">
          <CardContent className="p-0">
            {/* En-tête */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/30">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">
                  Nouveaux messages ({pendingNotifications.length})
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissAll}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {pendingNotifications.slice(0, 5).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => handleViewMessage(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <ImageWithFallback
                        src={notification.senderAvatar || ''}
                        alt={notification.senderName}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {notification.senderName}
                        </p>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {notification.senderRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {notification.conversationSubject && (
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                          {notification.conversationSubject}
                        </p>
                      )}
                      
                      <p className="text-sm text-foreground line-clamp-2">
                        {notification.content}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              {pendingNotifications.length > 5 && (
                <div className="p-3 text-center border-t bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    +{pendingNotifications.length - 5} autres messages
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange?.('messaging')}
                    className="text-xs mt-1"
                  >
                    Voir tous les messages
                  </Button>
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="p-3 border-t bg-muted/30">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange?.('messaging')}
                  className="text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Ouvrir la messagerie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissAll}
                  className="text-xs text-muted-foreground"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Tout marquer comme lu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatePresence>
    </div>
  );
}