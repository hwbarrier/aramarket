import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, CustomCategoryRequest, PREDEFINED_CATEGORIES } from '../types/category';
import { categoryService } from '../services/category.service';

interface CategoryContextType {
  categories: Category[];
  customCategoryRequests: CustomCategoryRequest[];
  addCustomCategoryRequest: (request: Omit<CustomCategoryRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveCustomCategory: (requestId: string, adminNotes?: string) => void;
  rejectCustomCategory: (requestId: string, adminNotes: string) => void;
  createNewCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  getPendingRequests: () => CustomCategoryRequest[];
  getCategoryById: (id: string) => Category | undefined;
  searchCategories: (query: string) => Category[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(import.meta.env.DEV ? PREDEFINED_CATEGORIES : []);
  const [customCategoryRequests, setCustomCategoryRequests] = useState<CustomCategoryRequest[]>(import.meta.env.DEV ? [
    // Données de test
    {
      id: "req1",
      productId: "prod1",
      vendorId: "vendor1",
      requestedCategory: "Produits artisanaux locaux",
      requestedSubCategory: "Poterie traditionnelle",
      description: "Création de poteries artisanales avec des techniques traditionnelles locales",
      status: "pending",
      createdAt: new Date('2024-02-20')
    },
    {
      id: "req2",
      productId: "prod2",
      vendorId: "vendor2",
      requestedCategory: "Objets connectés maison",
      description: "Capteurs IoT pour la domotique et l'automatisation domestique",
      status: "pending",
      createdAt: new Date('2024-02-18')
    }
  ] : []);

  useEffect(() => {
    categoryService.getCategories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.data))
      .catch(() => {
        if (import.meta.env.DEV) setCategories(PREDEFINED_CATEGORIES);
      });
  }, []);

  const addCustomCategoryRequest = (request: Omit<CustomCategoryRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: CustomCategoryRequest = {
      ...request,
      id: `req_${Date.now()}`,
      status: 'pending',
      createdAt: new Date()
    };
    setCustomCategoryRequests(prev => [...prev, newRequest]);
  };

  const approveCustomCategory = (requestId: string, adminNotes?: string) => {
    setCustomCategoryRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved' as const,
              reviewedAt: new Date(),
              adminNotes
            }
          : req
      )
    );

    // Optionnellement, créer automatiquement une nouvelle catégorie
    const request = customCategoryRequests.find(req => req.id === requestId);
    if (request) {
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase().includes(request.requestedCategory.toLowerCase())
      );

      if (!existingCategory) {
        // Créer une nouvelle catégorie
        const newCategory: Category = {
          id: `custom_${Date.now()}`,
          name: request.requestedCategory,
          nameKey: `categories.custom.${request.requestedCategory.toLowerCase().replace(/\s+/g, '')}`,
          subCategories: request.requestedSubCategory ? [{
            id: `sub_${Date.now()}`,
            name: request.requestedSubCategory,
            nameKey: `categories.custom.${request.requestedSubCategory.toLowerCase().replace(/\s+/g, '')}`
          }] : [],
          icon: "Tag"
        };
        setCategories(prev => [...prev, newCategory]);
      }
    }
  };

  const rejectCustomCategory = (requestId: string, adminNotes: string) => {
    setCustomCategoryRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'rejected' as const,
              reviewedAt: new Date(),
              adminNotes
            }
          : req
      )
    );
  };

  const createNewCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const getPendingRequests = () => {
    return customCategoryRequests.filter(req => req.status === 'pending');
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const searchCategories = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return categories.filter(category =>
      category.name.toLowerCase().includes(lowercaseQuery) ||
      category.subCategories.some(sub => 
        sub.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  const value: CategoryContextType = {
    categories,
    customCategoryRequests,
    addCustomCategoryRequest,
    approveCustomCategory,
    rejectCustomCategory,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getPendingRequests,
    getCategoryById,
    searchCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}