import { useState } from "react";
import { Search, Filter, Flag, Eye, Archive, Trash2, AlertTriangle, CheckCircle2, Clock, User, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { useMessages } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useLocalization } from "../../contexts/LocalizationContext";
import { Conversation, Message } from "../../types/message";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface MessageManagementProps {
  onBack: () => void;
}

export function MessageManagement({ onBack }: MessageManagementProps) {
  const { 
    getAllConversations,
    currentConversation,
    messages,
    stats,
    setCurrentConversation,
    updateConversationStatus,
    updateConversationPriority,
    flagConversation,
    unflagConversation,
    sendMessage,
    searchConversations
  } = useMessages();
  
  const { authState } = useAuth();
  const { t } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flagged' | 'urgent' | 'active'>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [flagReason, setFlagReason] = useState("");

  // Admin seulement
  if (authState.user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Accès non autorisé</h3>
        <p className="text-muted-foreground">Vous n'avez pas les permissions pour accéder à cette section.</p>
      </div>
    );
  }

  const allConversations = getAllConversations();

  // Filtrer les conversations selon les critères admin
  const filteredConversations = allConversations.filter(conv => {
    if (selectedFilter === 'flagged') {
      return conv.tags?.includes('flagged');
    }
    if (selectedFilter === 'urgent') {
      return conv.priority === 'urgent' || conv.priority === 'high';
    }
    if (selectedFilter === 'active') {
      return conv.status === 'active';
    }
    return true;
  });

  const searchResults = searchQuery ? 
    filteredConversations.filter(conv => 
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : filteredConversations;

  const handleViewConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setCurrentConversation(conversationId);
    setShowConversationModal(true);
  };

  const handleFlagConversation = (conversationId: string) => {
    if (flagReason.trim()) {
      flagConversation(conversationId, flagReason);
      setFlagReason("");
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'archived': return 'text-gray-500';
      case 'closed': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistiques supplémentaires pour l'admin
  const adminStats = {
    totalMessages: allConversations.reduce((acc, conv) => acc + (messages.length || 0), 0),
    flaggedConversations: allConversations.filter(conv => conv.tags?.includes('flagged')).length,
    urgentConversations: allConversations.filter(conv => conv.priority === 'urgent').length,
    averageResponseTime: stats.averageResponseTime
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2">
              ← Retour au tableau de bord
            </Button>
            <h1 className="text-3xl font-bold">Gestion des Messages</h1>
            <p className="text-muted-foreground">
              Supervision et modération des conversations entre utilisateurs
            </p>
          </div>
        </div>

        {/* Statistiques administrateur */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-semibold">{adminStats.totalMessages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flag className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Signalées</p>
                  <p className="text-2xl font-semibold">{adminStats.flaggedConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-semibold">{adminStats.urgentConversations}</p>
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
                  <p className="text-sm text-muted-foreground">Temps réponse moy.</p>
                  <p className="text-2xl font-semibold">{adminStats.averageResponseTime}min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Toutes les Conversations</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as typeof selectedFilter)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="flagged">Signalées</SelectItem>
                  <SelectItem value="urgent">Urgentes</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participants</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {conversation.participants.slice(0, 2).map((participant) => (
                            <Avatar key={participant.userId} className="h-8 w-8 border-2 border-white">
                              <ImageWithFallback
                                src={participant.avatar || ''}
                                alt={participant.name}
                                className="h-full w-full object-cover"
                              />
                            </Avatar>
                          ))}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {conversation.participants.map(p => p.name).join(', ')}
                          </p>
                          <div className="flex items-center space-x-1">
                            {conversation.participants.map(p => (
                              <Badge key={p.userId} variant="outline" className="text-xs">
                                {p.role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{conversation.subject}</p>
                        {conversation.productName && (
                          <p className="text-xs text-muted-foreground">{conversation.productName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(conversation.priority)}>
                        {conversation.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(conversation.lastMessageTime)}</p>
                      <p className="text-xs text-muted-foreground">
                        Non lus: {Object.values(conversation.unreadCount).reduce((a, b) => a + b, 0)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {conversation.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewConversation(conversation.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select onValueChange={(value) => updateConversationPriority(conversation.id, value as Conversation["priority"])}>
                          <SelectTrigger className="w-24 h-8">
                            <TrendingUp className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Basse</SelectItem>
                            <SelectItem value="normal">Normale</SelectItem>
                            <SelectItem value="high">Haute</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Signaler la conversation</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Textarea
                                placeholder="Raison du signalement..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                              />
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setFlagReason("")}>
                                  Annuler
                                </Button>
                                <Button onClick={() => handleFlagConversation(conversation.id)}>
                                  Signaler
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de consultation de conversation */}
      <Dialog open={showConversationModal} onOpenChange={setShowConversationModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Consultation de conversation
              {currentConversation && (
                <Badge variant="outline" className="ml-2">
                  {currentConversation.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {currentConversation && (
            <div className="space-y-4">
              {/* Informations de la conversation */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Participants</h4>
                      <div className="space-y-2 mt-2">
                        {currentConversation.participants.map(participant => (
                          <div key={participant.userId} className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <ImageWithFallback
                                src={participant.avatar || ''}
                                alt={participant.name}
                                className="h-full w-full object-cover"
                              />
                            </Avatar>
                            <span className="text-sm">{participant.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {participant.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Détails</h4>
                      <div className="space-y-1 mt-2 text-sm">
                        <p><strong>Sujet:</strong> {currentConversation.subject}</p>
                        <p><strong>Créée le:</strong> {formatDate(currentConversation.createdAt)}</p>
                        <p><strong>Priorité:</strong> 
                          <Badge variant="outline" className={`ml-2 ${getPriorityColor(currentConversation.priority)}`}>
                            {currentConversation.priority}
                          </Badge>
                        </p>
                        {currentConversation.productName && (
                          <p><strong>Produit:</strong> {currentConversation.productName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Messages ({messages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="border-l-2 border-muted pl-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{message.senderName}</span>
                              <Badge variant="outline" className="text-xs">
                                {message.senderRole}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Actions admin */}
              <div className="flex justify-between items-center pt-4">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => updateConversationStatus(currentConversation.id, 'archived')}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archiver
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => updateConversationStatus(currentConversation.id, 'closed')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Fermer
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setShowConversationModal(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}