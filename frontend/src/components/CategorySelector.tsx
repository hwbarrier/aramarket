import React, { useState } from 'react';
import { ChevronDown, Plus, Tag } from 'lucide-react';
import { useCategories } from '../contexts/CategoryContext';
import { Category, SubCategory } from '../types/category';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  customCategory?: string;
  customSubCategory?: string;
  isCustom?: boolean;
  onCategoryChange: (categoryId: string, subCategoryId?: string) => void;
  onCustomCategoryChange: (category: string, subCategory?: string, description?: string) => void;
  vendorId?: string;
  productId?: string;
  disabled?: boolean;
  showDescription?: boolean;
}

export function CategorySelector({
  selectedCategoryId,
  selectedSubCategoryId,
  customCategory,
  customSubCategory,
  isCustom = false,
  onCategoryChange,
  onCustomCategoryChange,
  vendorId,
  productId,
  disabled = false,
  showDescription = true
}: CategorySelectorProps) {
  const { categories, addCustomCategoryRequest } = useCategories();
  const [showCustomForm, setShowCustomForm] = useState(isCustom);
  const [customCategoryName, setCustomCategoryName] = useState(customCategory || '');
  const [customSubCategoryName, setCustomSubCategoryName] = useState(customSubCategory || '');
  const [customDescription, setCustomDescription] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const availableSubCategories = selectedCategory?.subCategories || [];

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'custom') {
      setShowCustomForm(true);
      return;
    }
    setShowCustomForm(false);
    onCategoryChange(categoryId);
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    if (selectedCategoryId) {
      onCategoryChange(selectedCategoryId, subCategoryId);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customCategoryName.trim()) return;
    
    setIsSubmittingCustom(true);
    
    try {
      // Soumettre la demande de catégorie personnalisée si vendorId et productId sont fournis
      if (vendorId && productId) {
        addCustomCategoryRequest({
          productId,
          vendorId,
          requestedCategory: customCategoryName,
          requestedSubCategory: customSubCategoryName || undefined,
          description: customDescription || undefined
        });
      }

      // Notifier le parent
      onCustomCategoryChange(
        customCategoryName,
        customSubCategoryName || undefined,
        customDescription || undefined
      );

      // Réinitialiser le formulaire
      setCustomCategoryName('');
      setCustomSubCategoryName('');
      setCustomDescription('');
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category-select">Catégorie *</Label>
        <Select
          value={showCustomForm ? 'custom' : selectedCategoryId || ''}
          onValueChange={handleCategorySelect}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une catégorie..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <div className="flex items-center gap-2 text-primary">
                <Plus className="h-4 w-4" />
                Autre (spécifier)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sous-catégorie pour catégories prédéfinies */}
      {!showCustomForm && selectedCategory && availableSubCategories.length > 0 && (
        <div>
          <Label htmlFor="subcategory-select">Sous-catégorie</Label>
          <Select
            value={selectedSubCategoryId || ''}
            onValueChange={handleSubCategorySelect}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une sous-catégorie..." />
            </SelectTrigger>
            <SelectContent>
              {availableSubCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Formulaire pour catégorie personnalisée */}
      {showCustomForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Spécifier une catégorie personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="custom-category">Nom de la catégorie *</Label>
              <Input
                id="custom-category"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="Ex: Produits artisanaux locaux"
                disabled={disabled || isSubmittingCustom}
              />
            </div>

            <div>
              <Label htmlFor="custom-subcategory">Sous-catégorie (optionnel)</Label>
              <Input
                id="custom-subcategory"
                value={customSubCategoryName}
                onChange={(e) => setCustomSubCategoryName(e.target.value)}
                placeholder="Ex: Poterie traditionnelle"
                disabled={disabled || isSubmittingCustom}
              />
            </div>

            {showDescription && (
              <div>
                <Label htmlFor="custom-description">Description (optionnel)</Label>
                <Textarea
                  id="custom-description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Décrivez votre produit pour aider l'administrateur à le catégoriser..."
                  rows={3}
                  disabled={disabled || isSubmittingCustom}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleCustomSubmit}
                disabled={!customCategoryName.trim() || disabled || isSubmittingCustom}
                className="flex-1"
              >
                {isSubmittingCustom ? 'Soumission...' : 'Confirmer'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomCategoryName('');
                  setCustomSubCategoryName('');
                  setCustomDescription('');
                }}
                disabled={disabled || isSubmittingCustom}
              >
                Annuler
              </Button>
            </div>

            {vendorId && productId && (
              <p className="text-sm text-muted-foreground">
                ℹ️ Votre demande sera examinée par un administrateur qui pourra créer cette catégorie ou vous proposer une catégorie existante plus appropriée.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information sur la catégorie sélectionnée */}
      {selectedCategory && !showCustomForm && showDescription && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Catégorie sélectionnée: <span className="font-medium">{selectedCategory.name}</span>
              {selectedSubCategoryId && availableSubCategories.find(sub => sub.id === selectedSubCategoryId) && (
                <> → <span className="font-medium">
                  {availableSubCategories.find(sub => sub.id === selectedSubCategoryId)?.name}
                </span></>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}