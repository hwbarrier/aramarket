import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Conversation } from "../types/message";

interface ConversationRatingProps {
  conversation: Conversation;
  onRatingSubmitted?: () => void;
}

interface ConversationRating {
  id: string;
  conversationId: string;
  ratedBy: string;
  ratedUserId: string;
  rating: number;
  feedback?: string;
  categories: {
    communication: number;
    helpfulness: number;
    responsiveness: number;
    professionalism: number;
  };
  createdAt: Date;
}

export function ConversationRating({ conversation, onRatingSubmitted }: ConversationRatingProps) {
  const { authState } = useAuth();
  const { showToast } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    communication: 0,
    helpfulness: 0,
    responsiveness: 0,
    professionalism: 0
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier si l'utilisateur peut évaluer cette conversation
  const canRate = () => {
    if (!authState.user) return false;
    
    // L'utilisateur doit être participant à la conversation
    const isParticipant = conversation.participantIds.includes(authState.user.id);
    
    // La conversation doit être fermée ou résolue
    const isCompleted = conversation.status === 'closed' || conversation.status === 'archived';
    
    return isParticipant && isCompleted;
  };

  // Obtenir l'autre participant (celui qui sera évalué)
  const getOtherParticipant = () => {
    return conversation.participants.find(p => p.userId !== authState.user?.id);
  };

  const handleStarClick = (rating: number, category?: keyof typeof categoryRatings) => {
    if (category) {
      setCategoryRatings(prev => ({
        ...prev,
        [category]: rating
      }));
    } else {
      setOverallRating(rating);
    }
  };

  const handleSubmitRating = async () => {
    if (!authState.user || overallRating === 0) return;

    setIsSubmitting(true);
    try {
      const ratingData: ConversationRating = {
        id: `rating_${Date.now()}`,
        conversationId: conversation.id,
        ratedBy: authState.user.id,
        ratedUserId: getOtherParticipant()?.userId || '',
        rating: overallRating,
        feedback: feedback.trim() || undefined,
        categories: categoryRatings,
        createdAt: new Date()
      };

      // Ici, on enverrait les données au backend
      // Simulation d'une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast({
        title: 'Évaluation envoyée',
        description: 'Merci pour votre retour ! Cela nous aide à améliorer l\'expérience.',
        type: 'success'
      });

      setIsOpen(false);
      onRatingSubmitted?.();
    } catch (error) {
      showToast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'évaluation. Veuillez réessayer.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, onStarClick: (rating: number) => void, size = "h-5 w-5") => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star)}
            className="focus:outline-none hover:scale-110 transition-transform"
          >
            <Star
              className={`${size} ${
                star <= currentRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const categories = [
    { key: 'communication' as const, label: 'Communication', description: 'Clarté et qualité des échanges' },
    { key: 'helpfulness' as const, label: 'Utilité', description: 'Pertinence des réponses' },
    { key: 'responsiveness' as const, label: 'Réactivité', description: 'Rapidité de réponse' },
    { key: 'professionalism' as const, label: 'Professionnalisme', description: 'Attitude et courtoisie' }
  ];

  if (!canRate()) {
    return null;
  }

  const otherParticipant = getOtherParticipant();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Star className="h-4 w-4 mr-2" />
          Évaluer cette conversation
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Évaluer la conversation</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations sur la conversation */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{conversation.subject}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conversation avec {otherParticipant?.name}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {conversation.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Évaluation globale */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div>
              <h4 className="font-medium">Évaluation globale</h4>
              <p className="text-sm text-muted-foreground">
                Comment évaluez-vous cette conversation dans l'ensemble ?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {renderStars(overallRating, setOverallRating, "h-8 w-8")}
              <span className="text-lg font-medium">
                {overallRating > 0 && `${overallRating}/5`}
              </span>
            </div>
          </motion.div>

          <Separator />

          {/* Évaluations par catégorie */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <h4 className="font-medium">Évaluation détaillée</h4>
              <p className="text-sm text-muted-foreground">
                Évaluez différents aspects de cette conversation
              </p>
            </div>
            
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{category.label}</h5>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(
                      categoryRatings[category.key],
                      (rating) => handleStarClick(rating, category.key)
                    )}
                    <span className="text-sm font-medium w-8">
                      {categoryRatings[category.key] > 0 && categoryRatings[category.key]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Separator />

          {/* Commentaire */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div>
              <h4 className="font-medium">Commentaire (optionnel)</h4>
              <p className="text-sm text-muted-foreground">
                Partagez vos impressions pour nous aider à améliorer l'expérience
              </p>
            </div>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Votre commentaire sur cette conversation..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {feedback.length}/500 caractères
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end space-x-3 pt-4 border-t"
          >
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={overallRating === 0 || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Envoi...</span>
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer l'évaluation
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}