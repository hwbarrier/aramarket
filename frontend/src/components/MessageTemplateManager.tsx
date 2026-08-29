import { useState } from "react";
import { Plus, Edit, Trash2, Star, Copy, Save, X, BookOpen, Tag, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useMessages } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { MessageTemplate } from "../types/message";

interface MessageTemplateManagerProps {
  onTemplateSelect?: (template: MessageTemplate) => void;
  onClose?: () => void;
  compact?: boolean;
}

const templateCategories = [
  { id: 'greeting', label: 'Salutations', color: 'bg-blue-100 text-blue-800' },
  { id: 'inquiry', label: 'Demandes d\'info', color: 'bg-green-100 text-green-800' },
  { id: 'shipping', label: 'Livraison', color: 'bg-orange-100 text-orange-800' },
  { id: 'support', label: 'Support', color: 'bg-purple-100 text-purple-800' },
  { id: 'feedback', label: 'Retours', color: 'bg-pink-100 text-pink-800' },
  { id: 'closing', label: 'Clôture', color: 'bg-gray-100 text-gray-800' },
  { id: 'custom', label: 'Personnalisé', color: 'bg-indigo-100 text-indigo-800' }
];

const predefinedTemplates: Omit<MessageTemplate, 'id' | 'createdBy'>[] = [
  {
    title: 'Salutation professionnelle',
    content: 'Bonjour {customer_name},\n\nMerci de votre intérêt pour nos produits. Je suis là pour répondre à toutes vos questions.',
    category: 'greeting',
    isActive: true
  },
  {
    title: 'Demande d\'information produit',
    content: 'Bonjour,\n\nPourriez-vous me donner plus d\'informations sur {product_name} ? Je m\'intéresse particulièrement à {specific_aspect}.',
    category: 'inquiry',
    isActive: true
  },
  {
    title: 'Confirmation d\'expédition',
    content: 'Bonjour {customer_name},\n\nVotre commande #{order_number} a été expédiée aujourd\'hui. Numéro de suivi : {tracking_number}\n\nDélai de livraison estimé : {delivery_time}',
    category: 'shipping',
    isActive: true
  },
  {
    title: 'Résolution de problème',
    content: 'Bonjour {customer_name},\n\nJe comprends votre préoccupation concernant {issue}. Laissez-moi vous proposer une solution adaptée.',
    category: 'support',
    isActive: true
  },
  {
    title: 'Demande d\'avis',
    content: 'Bonjour {customer_name},\n\nJ\'espère que vous êtes satisfait(e) de votre achat. Pourriez-vous partager votre expérience ? Votre avis nous aide à nous améliorer.',
    category: 'feedback',
    isActive: true
  },
  {
    title: 'Clôture de conversation',
    content: 'Parfait ! Je suis content d\'avoir pu vous aider. N\'hésitez pas à me recontacter si vous avez d\'autres questions. Bonne journée !',
    category: 'closing',
    isActive: true
  }
];

export function MessageTemplateManager({ 
  onTemplateSelect, 
  onClose, 
  compact = false 
}: MessageTemplateManagerProps) {
  const { templates, getTemplates, createTemplate, updateTemplate, deleteTemplate } = useMessages();
  const { authState } = useAuth();
  const { showToast } = useNotifications();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: 'custom'
  });

  // Combiner templates existants avec templates prédéfinis
  const allTemplates = [
    ...templates,
    ...predefinedTemplates.map((template, index) => ({
      ...template,
      id: `predefined_${index}`,
      createdBy: 'system'
    }))
  ];

  // Filtrer les templates
  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch && template.isActive;
  });

  const handleCreateTemplate = async () => {
    if (!newTemplate.title.trim() || !newTemplate.content.trim()) {
      showToast({
        title: 'Erreur',
        description: 'Veuillez remplir le titre et le contenu du template',
        type: 'error'
      });
      return;
    }

    try {
      createTemplate(newTemplate);
      setNewTemplate({ title: '', content: '', category: 'custom' });
      setIsCreating(false);
      
      showToast({
        title: 'Template créé',
        description: 'Votre template a été ajouté avec succès',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Erreur',
        description: 'Impossible de créer le template',
        type: 'error'
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      updateTemplate(editingTemplate.id, editingTemplate);
      setEditingTemplate(null);
      
      showToast({
        title: 'Template modifié',
        description: 'Les modifications ont été sauvegardées',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Erreur',
        description: 'Impossible de modifier le template',
        type: 'error'
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      deleteTemplate(templateId);
      
      showToast({
        title: 'Template supprimé',
        description: 'Le template a été supprimé avec succès',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Erreur',
        description: 'Impossible de supprimer le template',
        type: 'error'
      });
    }
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.content);
    showToast({
      title: 'Copié',
      description: 'Le contenu du template a été copié dans le presse-papiers',
      type: 'success'
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return templateCategories.find(cat => cat.id === categoryId) || templateCategories[0];
  };

  const variables = [
    '{customer_name}', '{product_name}', '{order_number}', 
    '{tracking_number}', '{delivery_time}', '{issue}', '{specific_aspect}'
  ];

  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Templates de messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Recherche et filtres */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {templateCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Liste des templates */}
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredTemplates.map((template) => {
                  const categoryInfo = getCategoryInfo(template.category);
                  return (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onTemplateSelect?.(template);
                        onClose?.();
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-sm">{template.title}</h4>
                              <Badge className={`text-xs ${categoryInfo.color}`}>
                                {categoryInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.content}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTemplate(template);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Templates de messages</h2>
          <p className="text-muted-foreground">
            Gérez vos modèles de messages pour gagner du temps
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{allTemplates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {templateCategories.slice(0, 3).map(category => {
          const count = allTemplates.filter(t => t.category === category.id).length;
          return (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{category.label}</p>
                    <p className="text-2xl font-semibold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des templates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mes Templates</CardTitle>
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {templateCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredTemplates.map((template, index) => {
                      const categoryInfo = getCategoryInfo(template.category);
                      const isSystem = template.createdBy === 'system';
                      const canEdit = !isSystem && template.createdBy === authState.user?.id;
                      
                      return (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{template.title}</h4>
                                    <Badge className={`text-xs ${categoryInfo.color}`}>
                                      {categoryInfo.label}
                                    </Badge>
                                    {isSystem && (
                                      <Badge variant="outline" className="text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        Système
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-3">
                                    {template.content}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyTemplate(template)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  {canEdit && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingTemplate(template)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteTemplate(template.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral - Variables et aide */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Variables disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Utilisez ces variables dans vos templates :
                </p>
                <div className="space-y-1">
                  {variables.map(variable => (
                    <div key={variable} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <code className="text-xs">{variable}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(variable);
                          showToast({
                            title: 'Copié',
                            description: `Variable ${variable} copiée`,
                            type: 'success'
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p>• Utilisez des variables pour personnaliser vos messages</p>
                <p>• Organisez vos templates par catégorie</p>
                <p>• Gardez vos messages courts et clairs</p>
                <p>• Testez vos templates avant de les utiliser</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de création */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nom du template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={newTemplate.category} 
                  onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu du template..."
                rows={6}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleCreateTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Titre</Label>
                  <Input
                    id="edit-title"
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select 
                    value={editingTemplate.category} 
                    onValueChange={(value) => setEditingTemplate(prev => prev ? ({ ...prev, category: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Contenu</Label>
                <Textarea
                  id="edit-content"
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleUpdateTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}