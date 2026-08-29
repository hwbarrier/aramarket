import { useEffect, useState } from "react";
import { MessageSquare, TrendingUp, Clock, Users, Star, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";

interface MessageStatsProps {
  className?: string;
  compact?: boolean;
}

export function MessageStats({ className = "", compact = false }: MessageStatsProps) {
  const { stats, conversations, getUnreadCount, getConversations } = useMessages();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des statistiques
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculs de statistiques supplémentaires
  const userConversations = getConversations();
  const responseRate = Math.round((stats.responseRate || 85) + Math.random() * 10);
  const avgResponseTime = stats.averageResponseTime || 45;
  const satisfaction = Math.round(4.2 + Math.random() * 0.6); // Note sur 5

  // Statistiques par période
  const weeklyStats = {
    newConversations: Math.floor(Math.random() * 15) + 5,
    messagesReceived: Math.floor(Math.random() * 50) + 20,
    messagesSent: Math.floor(Math.random() * 60) + 25,
    avgResponseTime: Math.floor(Math.random() * 30) + 20
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 30) return "text-green-500";
    if (time <= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-500";
    if (rate >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  if (compact) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Messages</span>
              </div>
              <Badge variant={getUnreadCount() > 0 ? "destructive" : "secondary"} className="text-xs">
                {getUnreadCount()} non lus
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Actives</p>
                <p className="font-semibold">{stats.activeConversations}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Taux réponse</p>
                <p className={`font-semibold ${getResponseRateColor(responseRate)}`}>
                  {responseRate}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold mb-1">Statistiques de Communication</h3>
        <p className="text-sm text-muted-foreground">
          Aperçu de vos interactions et performances
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversations totales</p>
                  <p className="text-2xl font-semibold">{stats.totalConversations}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+{weeklyStats.newConversations} cette semaine</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Messages non lus</p>
                  <p className="text-2xl font-semibold">{getUnreadCount()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {stats.activeConversations} conversations actives
                    </span>
                  </div>
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
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps de réponse moy.</p>
                  <p className={`text-2xl font-semibold ${getResponseTimeColor(avgResponseTime)}`}>
                    {avgResponseTime}min
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Zap className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-500">-5min vs la semaine dernière</span>
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
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux de réponse</p>
                  <p className={`text-2xl font-semibold ${getResponseRateColor(responseRate)}`}>
                    {responseRate}%
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Progress value={responseRate} className="w-16 h-1" />
                    <span className="text-xs text-muted-foreground">Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques et tendances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Messages reçus</span>
                  </div>
                  <span className="font-semibold">{weeklyStats.messagesReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Messages envoyés</span>
                  </div>
                  <span className="font-semibold">{weeklyStats.messagesSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Nouvelles conversations</span>
                  </div>
                  <span className="font-semibold">{weeklyStats.newConversations}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taux de réponse</span>
                    <span className="text-sm font-semibold">{responseRate}%</span>
                  </div>
                  <Progress value={responseRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Satisfaction client</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{satisfaction.toFixed(1)}/5</span>
                    </div>
                  </div>
                  <Progress value={(satisfaction / 5) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Réactivité</span>
                    <span className="text-sm font-semibold">
                      {avgResponseTime <= 30 ? 'Excellent' : avgResponseTime <= 60 ? 'Bon' : 'À améliorer'}
                    </span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (avgResponseTime / 2))} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conseils et recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {avgResponseTime > 60 && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Améliorez votre temps de réponse</p>
                    <p className="text-sm text-yellow-700">
                      Essayez de répondre aux messages dans les 30 minutes pour une meilleure satisfaction client.
                    </p>
                  </div>
                </div>
              )}
              
              {getUnreadCount() > 5 && (
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <MessageSquare className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Messages en attente</p>
                    <p className="text-sm text-red-700">
                      Vous avez {getUnreadCount()} messages non lus. Pensez à y répondre rapidement.
                    </p>
                  </div>
                </div>
              )}
              
              {responseRate >= 90 && avgResponseTime <= 30 && (
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Excellente performance !</p>
                    <p className="text-sm text-green-700">
                      Continuez ainsi ! Votre réactivité et votre taux de réponse sont excellents.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}