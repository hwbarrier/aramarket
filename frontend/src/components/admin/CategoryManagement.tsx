import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Search,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useCategories } from '../../contexts/CategoryContext';
import { Category, CustomCategoryRequest } from '../../types/category';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function CategoryManagement() {
  const {
    categories,
    customCategoryRequests,
    createNewCategory,
    updateCategory,
    deleteCategory,
    approveCustomCategory,
    rejectCustomCategory,
    getPendingRequests
  } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    nameKey: '',
    icon: 'Tag',
    subCategories: [] as Array<{ name: string; nameKey: string }>
  });
  const [newSubCategory, setNewSubCategory] = useState({ name: '', nameKey: '' });
  const [reviewingRequest, setReviewingRequest] = useState<CustomCategoryRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const pendingRequests = getPendingRequests();
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;

    const categoryToCreate = {
      ...newCategory,
      nameKey: `categories.custom.${newCategory.name.toLowerCase().replace(/\s+/g, '')}`,
      subCategories: newCategory.subCategories.map((sub, index) => ({
        id: `sub_${Date.now()}_${index}`,
        name: sub.name,
        nameKey: sub.nameKey || `categories.custom.${sub.name.toLowerCase().replace(/\s+/g, '')}`
      }))
    };

    createNewCategory(categoryToCreate);
    setNewCategory({ name: '', nameKey: '', icon: 'Tag', subCategories: [] });
    setIsCreating(false);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    updateCategory(editingCategory.id, editingCategory);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory(categoryId);
    }
  };

  const addSubCategory = () => {
    if (!newSubCategory.name.trim()) return;

    setNewCategory(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, {
        name: newSubCategory.name,
        nameKey: newSubCategory.nameKey || `categories.custom.${newSubCategory.name.toLowerCase().replace(/\s+/g, '')}`
      }]
    }));
    setNewSubCategory({ name: '', nameKey: '' });
  };

  const removeSubCategory = (index: number) => {
    setNewCategory(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index)
    }));
  };

  const handleApproveRequest = () => {
    if (!reviewingRequest) return;
    approveCustomCategory(reviewingRequest.id, adminNotes);
    setReviewingRequest(null);
    setAdminNotes('');
  };

  const handleRejectRequest = () => {
    if (!reviewingRequest || !adminNotes.trim()) return;
    rejectCustomCategory(reviewingRequest.id, adminNotes);
    setReviewingRequest(null);
    setAdminNotes('');
  };

  const getStatusBadge = (status: CustomCategoryRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="h2">Gestion des Catégories</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Catégorie
        </Button>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Catégories ({categories.length})</TabsTrigger>
          <TabsTrigger value="requests">
            Demandes ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des catégories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des catégories */}
          <div className="grid gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      <CardTitle>{category.name}</CardTitle>
                      <Badge variant="outline">{category.subCategories.length} sous-catégories</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories.map((sub) => (
                      <Badge key={sub.id} variant="secondary">
                        {sub.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie demandée</TableHead>
                <TableHead>Sous-catégorie</TableHead>
                <TableHead>Vendeur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customCategoryRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requestedCategory}</TableCell>
                  <TableCell>{request.requestedSubCategory || '-'}</TableCell>
                  <TableCell>{request.vendorId}</TableCell>
                  <TableCell>{request.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewingRequest(request)}
                      >
                        Examiner
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Dialog pour créer une nouvelle catégorie */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Créez une nouvelle catégorie de produits pour organiser votre catalogue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Nom de la catégorie *</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Électronique"
              />
            </div>

            <div>
              <Label htmlFor="category-icon">Icône</Label>
              <Select
                value={newCategory.icon}
                onValueChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tag">Tag</SelectItem>
                  <SelectItem value="Shirt">Shirt</SelectItem>
                  <SelectItem value="Smartphone">Smartphone</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Trophy">Trophy</SelectItem>
                  <SelectItem value="Baby">Baby</SelectItem>
                  <SelectItem value="Palette">Palette</SelectItem>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Flower">Flower</SelectItem>
                  <SelectItem value="Leaf">Leaf</SelectItem>
                  <SelectItem value="Book">Book</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sous-catégories</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de la sous-catégorie"
                    value={newSubCategory.name}
                    onChange={(e) => setNewSubCategory(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Button onClick={addSubCategory} disabled={!newSubCategory.name.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {newCategory.subCategories.map((sub, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span>{sub.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubCategory(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour examiner une demande */}
      <Dialog open={!!reviewingRequest} onOpenChange={() => setReviewingRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Examiner la demande de catégorie</DialogTitle>
            <DialogDescription>
              Examinez et décidez d'approuver ou de rejeter cette demande de nouvelle catégorie.
            </DialogDescription>
          </DialogHeader>
          {reviewingRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div><strong>Catégorie:</strong> {reviewingRequest.requestedCategory}</div>
                {reviewingRequest.requestedSubCategory && (
                  <div><strong>Sous-catégorie:</strong> {reviewingRequest.requestedSubCategory}</div>
                )}
                {reviewingRequest.description && (
                  <div><strong>Description:</strong> {reviewingRequest.description}</div>
                )}
                <div><strong>Vendeur:</strong> {reviewingRequest.vendorId}</div>
                <div><strong>Date:</strong> {reviewingRequest.createdAt.toLocaleDateString()}</div>
              </div>

              <div>
                <Label htmlFor="admin-notes">Notes administrateur</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes pour le vendeur..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleRejectRequest}
                  disabled={!adminNotes.trim()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button onClick={handleApproveRequest}>
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour éditer une catégorie */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette catégorie de produits.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Nom de la catégorie *</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>

              <div>
                <Label>Sous-catégories</Label>
                <div className="space-y-2">
                  {editingCategory.subCategories.map((sub, index) => (
                    <div key={sub.id} className="flex items-center gap-2">
                      <Input
                        value={sub.name}
                        onChange={(e) => {
                          const updatedSubs = [...editingCategory.subCategories];
                          updatedSubs[index] = { ...sub, name: e.target.value };
                          setEditingCategory(prev => prev ? { ...prev, subCategories: updatedSubs } : null);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedSubs = editingCategory.subCategories.filter((_, i) => i !== index);
                          setEditingCategory(prev => prev ? { ...prev, subCategories: updatedSubs } : null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateCategory}>
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