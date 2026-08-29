import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { motion } from "framer-motion";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContactVendorButtonProps {
  product: Product;
  onPageChange?: (page: string) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ContactVendorButton({ 
  product, 
  onPageChange,
  variant = "outline",
  size = "default",
  className = ""
}: ContactVendorButtonProps) {
  const { authState } = useAuth();
  const { createConversation, sendMessage } = useMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(`Question sur ${product.name}`);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !authState.user) return;

    setIsLoading(true);
    try {
      // Créer une nouvelle conversation avec le vendeur
      const conversationId = await createConversation(
        [product.vendorId], // ID du vendeur
        subject,
        product.id
      );

      // Envoyer le premier message
      await sendMessage(conversationId, message.trim());

      // Fermer le modal et rediriger vers la messagerie
      setIsOpen(false);
      setMessage("");
      if (onPageChange) {
        onPageChange("messaging");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setMessage("");
      setSubject(`Question sur ${product.name}`);
    }
  };

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  const handleClick = () => {
    if (!authState.isAuthenticated) {
      if (onPageChange) {
        onPageChange("login");
      }
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contacter le vendeur
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Contacter le vendeur</span>
            </DialogTitle>
            <DialogDescription>
              Envoyez un message au vendeur pour poser vos questions sur ce produit.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Informations du produit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/30 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold line-clamp-2 text-sm sm:text-base">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.price.toFixed(2)} €
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Par {product.vendorName}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Informations du vendeur */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                  alt={product.vendorName}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{product.vendorName}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Vendeur certifié</p>
              </div>
              <div className="flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  <span className="hidden sm:inline">En ligne</span>
                  <span className="sm:hidden">●</span>
                </Badge>
              </div>
            </motion.div>

            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <Label htmlFor="subject" className="text-sm">Sujet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet de votre message"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bonjour, j'aimerais avoir plus d'informations sur ce produit..."
                  className="mt-1 min-h-[100px] sm:min-h-[120px] resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {message.length}/500 caractères
                </p>
              </div>

              {/* Suggestions de messages */}
              <div className="space-y-2">
                <Label className="text-sm">Suggestions :</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Ce produit est-il disponible ?",
                    "Puis-je avoir plus de détails ?",
                    "Quel est le délai de livraison ?",
                    "Y a-t-il une garantie ?"
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 text-xs bg-muted/50 hover:bg-muted text-left justify-start"
                      onClick={() => setMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:justify-end sm:space-x-3 pt-4 border-t sticky bottom-0 bg-background"
            >
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="w-full sm:w-auto sm:min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Envoi...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}