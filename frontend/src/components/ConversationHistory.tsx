import { useState } from "react";
import { Calendar, Filter, Star, User, MessageSquare, TrendingUp, BarChart3, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ConversationHistoryProps {
  onPageChange?: (page: string) => void;
}

// Mock data pour l'historique des évaluations
const mockRatings = import.meta.env.DEV ? [
  {
    id: "rating1",
    conversationId: "conv1",
    conversationSubject: "Question sur le casque Bluetooth",
    ratedBy: "user1",
    ratedUserName: "TechStore Pro",
    ratedUserAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: {
      communication: 5,
      helpfulness: 5,
      responsiveness: 4,
      professionalism: 5
    },
    feedback: "Excellent service ! Réponses rapides et très professionnelles. Je recommande vivement ce vendeur.",
    createdAt: new Date('2024-02-23T15:30:00'),
    productName: "Wireless Bluetooth Headphones Premium"
  },
  {
    id: "rating2",
    conversationId: "conv2",
    conversationSubject: "Problème de livraison",
    ratedBy: "user1",
    ratedUserName: "Green Fashion",
    ratedUserAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    categories: {
      communication: 4,
      helpfulness: 4,
      responsiveness: 3,
      professionalism: 4
    },
    feedback: "Bonne résolution du problème, mais un peu lent à répondre au début.",
    createdAt: new Date('2024-02-22T11:15:00'),
    productName: "Premium Cotton T-Shirt Organic"
  },
  {
    id: "rating3",
    conversationId: "conv4",
    conversationSubject: "Demande d'informations",
    ratedBy: "vendor1",
    ratedUserName: "Alice Martin",
    ratedUserAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    categories: {
      communication: 5,
      helpfulness: 5,
      responsiveness: 5,
      professionalism: 5
    },
    feedback: "Cliente très agréable et précise dans ses questions. Interaction parfaite !",
    createdAt: new Date('2024-02-21T14:45:00'),
    productName: "Smart Watch Series 5 Advanced"
  }
] : [];

export function ConversationHistory({ onPageChange }: ConversationHistoryProps) {
  const { conversations } = useMessages();
  const { authState } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'given' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les évaluations
  const filteredRatings = mockRatings.filter(rating => {
    const matchesSearch = !searchQuery || 
      rating.conversationSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.ratedUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.productName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'given' && rating.ratedBy === authState.user?.id) ||
      (selectedFilter === 'received' && rating.ratedBy !== authState.user?.id);

    // Filtrage par période
    const now = new Date();
    const ratingDate = rating.createdAt;
    let matchesPeriod = true;

    switch (selectedPeriod) {
      case 'week':
        matchesPeriod = (now.getTime() - ratingDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        matchesPeriod = (now.getTime() - ratingDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        break;
      case 'quarter':
        matchesPeriod = (now.getTime() - ratingDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
        break;
      case 'year':
        matchesPeriod = (now.getTime() - ratingDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        break;
    }

    return matchesSearch && matchesFilter && matchesPeriod;
  });

  // Calcul des statistiques
  const stats = {
    totalRatings: filteredRatings.length,
    averageRating: filteredRatings.length > 0 
      ? (filteredRatings.reduce((sum, r) => sum + r.rating, 0) / filteredRatings.length).toFixed(1)
      : '0',
    ratingsGiven: filteredRatings.filter(r => r.ratedBy === authState.user?.id).length,
    ratingsReceived: filteredRatings.filter(r => r.ratedBy !== authState.user?.id).length
  };

  const categoryAverages = {
    communication: filteredRatings.length > 0 
      ? (filteredRatings.reduce((sum, r) => sum + r.categories.communication, 0) / filteredRatings.length).toFixed(1)
      : '0',
    helpfulness: filteredRatings.length > 0 
      ? (filteredRatings.reduce((sum, r) => sum + r.categories.helpfulness, 0) / filteredRatings.length).toFixed(1)
      : '0',
    responsiveness: filteredRatings.length > 0 
      ? (filteredRatings.reduce((sum, r) => sum + r.categories.responsiveness, 0) / filteredRatings.length).toFixed(1)
      : '0',
    professionalism: filteredRatings.length > 0 
      ? (filteredRatings.reduce((sum, r) => sum + r.categories.professionalism, 0) / filteredRatings.length).toFixed(1)
      : '0'
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Historique des Évaluations</h1>
          <p className="text-muted-foreground">
            Consultez toutes vos évaluations et commentaires de conversations
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Rechercher une évaluation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as typeof selectedPeriod)}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as typeof selectedFilter)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="given">Données</SelectItem>
              <SelectItem value="received">Reçues</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total évaluations</p>
                  <p className="text-2xl font-semibold">{stats.totalRatings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-semibold">{stats.averageRating}</p>
                    <div className="flex items-center">
                      {renderStars(Math.round(parseFloat(stats.averageRating)))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Données</p>
                  <p className="text-2xl font-semibold">{stats.ratingsGiven}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reçues</p>
                  <p className="text-2xl font-semibold">{stats.ratingsReceived}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des évaluations</TabsTrigger>
          <TabsTrigger value="analytics">Analyses détaillées</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Évaluations ({filteredRatings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredRatings.map((rating, index) => (
                    <motion.div
                      key={rating.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-3">
                        {/* En-tête de l'évaluation */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <ImageWithFallback
                                src={rating.ratedUserAvatar}
                                alt={rating.ratedUserName}
                                className="h-full w-full object-cover"
                              />
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{rating.ratedUserName}</h4>
                                <Badge variant={rating.ratedBy === authState.user?.id ? "default" : "secondary"}>
                                  {rating.ratedBy === authState.user?.id ? "Donnée" : "Reçue"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {rating.conversationSubject}
                              </p>
                              {rating.productName && (
                                <p className="text-xs text-muted-foreground">
                                  Produit: {rating.productName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              {renderStars(rating.rating)}
                              <span className="font-semibold">{rating.rating}/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(rating.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Évaluations par catégorie */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Communication</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.categories.communication)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Utilité</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.categories.helpfulness)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Réactivité</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.categories.responsiveness)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Professionnalisme</span>
                            <div className="flex items-center space-x-1">
                              {renderStars(rating.categories.professionalism)}
                            </div>
                          </div>
                        </div>

                        {/* Commentaire */}
                        {rating.feedback && (
                          <div className="bg-muted/50 rounded p-3">
                            <p className="text-sm italic">"{rating.feedback}"</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {filteredRatings.length === 0 && (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucune évaluation trouvée</h3>
                      <p className="text-muted-foreground mb-4">
                        Aucune évaluation ne correspond à vos critères de recherche.
                      </p>
                      <Button variant="outline" onClick={() => onPageChange?.('messaging')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Voir les conversations
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moyennes par catégorie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Moyennes par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { key: 'communication', label: 'Communication' },
                      { key: 'helpfulness', label: 'Utilité' },
                      { key: 'responsiveness', label: 'Réactivité' },
                      { key: 'professionalism', label: 'Professionnalisme' }
                    ].map(category => (
                      <div key={category.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.label}</span>
                          <div className="flex items-center space-x-2">
                            {renderStars(Math.round(parseFloat(categoryAverages[category.key as keyof typeof categoryAverages])))}
                            <span className="text-sm font-semibold">
                              {categoryAverages[category.key as keyof typeof categoryAverages]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Répartition des notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = filteredRatings.filter(r => r.rating === rating).length;
                      const percentage = filteredRatings.length > 0 ? (count / filteredRatings.length) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 w-16">
                            <span className="text-sm">{rating}</span>
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}