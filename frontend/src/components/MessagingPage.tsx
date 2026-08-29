import { useState, useEffect, useRef } from "react";
import { Search, Send, PlusCircle, Filter, MoreVertical, Paperclip, Image, X, Flag, Archive, Trash2, Star, Clock, User, Tag, AlertCircle, CheckCircle2, Settings, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { Conversation, Message, MessageTemplate } from "../types/message";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ConversationRating } from "./ConversationRating";
import { MessageTemplateManager } from "./MessageTemplateManager";

interface MessagingPageProps {
  onPageChange: (page: string) => void;
}

export function MessagingPage({ onPageChange }: MessagingPageProps) {
  const { 
    conversations, 
    currentConversation, 
    messages, 
    templates,
    stats,
    getConversations,
    setCurrentConversation,
    sendMessage,
    markConversationAsRead,
    updateConversationStatus,
    updateConversationPriority,
    addConversationTag,
    removeConversationTag,
    searchConversations,
    getTemplates,
    createTemplate
  } = useMessages();
  
  const { authState } = useAuth();
  const { t } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'active' | 'archived'>('all');
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filtrer les conversations
  const filteredConversations = getConversations({
    status: selectedFilter === 'all' ? undefined : selectedFilter,
    unreadOnly: selectedFilter === 'unread'
  });

  const searchResults = searchQuery ? searchConversations(searchQuery) : filteredConversations;

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !currentConversation) return;

    setIsLoading(true);
    try {
      await sendMessage(currentConversation.id, newMessageContent.trim());
      setNewMessageContent("");
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setNewMessageContent(template.content);
    setShowTemplateDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'normal': return 'text-blue-500';
      case 'low': return 'text-gray-500';
      default: return 'text-blue-500';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'outline';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Démo locale uniquement :</strong> la messagerie est une vue de démonstration UX, sans backend de conversation réel ni notifications persistées.
      </div>
      {/* En-tête avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messagerie</h1>
            <p className="text-muted-foreground">
              Communiquez avec les vendeurs et gérez vos conversations
            </p>
          </div>
          <Button onClick={() => setShowNewConversationDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversations</p>
                  <p className="text-2xl font-semibold">{stats.totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-semibold">{stats.activeConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Non lus</p>
                  <p className="text-2xl font-semibold">{stats.unreadMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux réponse</p>
                  <p className="text-2xl font-semibold">{stats.responseRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Interface de messagerie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filtrer par</h4>
                      <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as typeof selectedFilter)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="unread">Non lues</SelectItem>
                          <SelectItem value="active">Actives</SelectItem>
                          <SelectItem value="archived">Archivées</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {searchResults.map((conversation) => {
                  const isActive = currentConversation?.id === conversation.id;
                  const unreadCount = conversation.unreadCount[authState.user?.id || ''] || 0;
                  const otherParticipant = conversation.participants.find(p => p.userId !== authState.user?.id);
                  
                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setCurrentConversation(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <ImageWithFallback
                              src={otherParticipant?.avatar || ''}
                              alt={otherParticipant?.name || ''}
                              className="h-full w-full object-cover"
                            />
                          </Avatar>
                          {otherParticipant?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{otherParticipant?.name}</p>
                            <div className="flex items-center space-x-1">
                              <Badge
                                variant={getPriorityBadgeVariant(conversation.priority)}
                                className={`text-xs ${getPriorityColor(conversation.priority)}`}
                              >
                                {conversation.priority}
                              </Badge>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs min-w-[20px] h-5 flex items-center justify-center">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {conversation.subject}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              {conversation.productName && (
                                <Badge variant="outline" className="text-xs">
                                  {conversation.productName}
                                </Badge>
                              )}
                              {conversation.tags?.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <Card className="lg:col-span-2">
          {currentConversation ? (
            <>
              {/* En-tête de conversation */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <ImageWithFallback
                        src={currentConversation.participants.find(p => p.userId !== authState.user?.id)?.avatar || ''}
                        alt={currentConversation.participants.find(p => p.userId !== authState.user?.id)?.name || ''}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {currentConversation.participants.find(p => p.userId !== authState.user?.id)?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{currentConversation.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateConversationStatus(currentConversation.id, 'archived')}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archiver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateConversationStatus(currentConversation.id, 'closed')}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Marquer comme résolu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Flag className="h-4 w-4 mr-2" />
                          Signaler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Évaluation de conversation si fermée */}
                    {(currentConversation.status === 'closed' || currentConversation.status === 'archived') && (
                      <ConversationRating 
                        conversation={currentConversation}
                        onRatingSubmitted={() => {
                          // Optionnel: rafraîchir les données
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[350px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.senderId === authState.user?.id;
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`p-3 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {!isOwnMessage && (
                                <p className="text-xs font-medium mb-1">{message.senderName}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className={`flex items-center mt-1 space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {isOwnMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageTemplateManager 
                      compact={true}
                      onTemplateSelect={handleUseTemplate}
                      onClose={() => setShowTemplateDialog(false)}
                    />
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-end space-x-2">
                    <Textarea
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="min-h-[60px] resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessageContent.trim() || isLoading}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Sélectionnez une conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez une conversation dans la liste pour commencer à échanger
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}