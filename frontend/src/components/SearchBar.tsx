import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { cn } from './ui/utils';
import { Product } from './ProductCard';

interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'brand' | 'recent' | 'trending';
  text: string;
  count?: number;
  image?: string;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onShowFilters?: () => void;
  products?: Product[];
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onShowFilters,
  products = [],
  className,
  placeholder = "Rechercher des produits...",
  showSuggestions = true
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    'iPhone 14',
    'Nike Air Max',
    'MacBook Pro',
    'PlayStation 5',
    'Samsung Galaxy'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Erreur lors du chargement des recherches récentes:', error);
      }
    }
  }, []);

  // Générer les suggestions basées sur la saisie
  useEffect(() => {
    if (!value.trim() || !showSuggestions) {
      if (showSuggestions) {
        generateDefaultSuggestions();
      }
      return;
    }

    const query = value.toLowerCase().trim();
    const newSuggestions: SearchSuggestion[] = [];

    // Suggestions de produits
    const productSuggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.category ?? '').toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(product => ({
        id: `product-${product.id}`,
        type: 'product' as const,
        text: product.name,
        image: product.image
      }));

    newSuggestions.push(...productSuggestions);

    // Suggestions de catégories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
      .filter(category => category.toLowerCase().includes(query))
      .slice(0, 3)
      .map(category => {
        const count = products.filter(p => p.category === category).length;
        return {
          id: `category-${category}`,
          type: 'category' as const,
          text: category,
          count
        };
      });

    newSuggestions.push(...categories);

    // Suggestions de marques
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
      .filter(brand => brand!.toLowerCase().includes(query))
      .slice(0, 3)
      .map(brand => {
        const count = products.filter(p => p.brand === brand).length;
        return {
          id: `brand-${brand}`,
          type: 'brand' as const,
          text: brand!,
          count
        };
      });

    newSuggestions.push(...brands);

    setSuggestions(newSuggestions);
  }, [value, products, showSuggestions]);

  const generateDefaultSuggestions = () => {
    const defaultSuggestions: SearchSuggestion[] = [];

    // Recherches récentes
    if (recentSearches.length > 0) {
      const recentSuggestions = recentSearches.slice(0, 5).map(search => ({
        id: `recent-${search}`,
        type: 'recent' as const,
        text: search
      }));
      defaultSuggestions.push(...recentSuggestions);
    }

    // Recherches tendances
    const trendingSuggestions = trendingSearches.slice(0, 5).map(search => ({
      id: `trending-${search}`,
      type: 'trending' as const,
      text: search
    }));
    defaultSuggestions.push(...trendingSuggestions);

    setSuggestions(defaultSuggestions);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Ajouter aux recherches récentes
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));

    onChange(query);
    onSearch(query);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    let searchQuery = suggestion.text;
    
    if (suggestion.type === 'category') {
      searchQuery = `category:${suggestion.text}`;
    } else if (suggestion.type === 'brand') {
      searchQuery = `brand:${suggestion.text}`;
    }
    
    handleSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
    generateDefaultSuggestions();
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(search => search !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
    generateDefaultSuggestions();
  };

  // Gérer les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsOpen(true);
              if (!value.trim()) generateDefaultSuggestions();
            }}
            className="pl-10 pr-10"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button type="submit" disabled={!value.trim()}>
          <Search className="h-4 w-4" />
          <span className="sr-only">Rechercher</span>
        </Button>

        {onShowFilters && (
          <Button type="button" variant="outline" onClick={onShowFilters}>
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Filtres</span>
          </Button>
        )}
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-lg border">
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {/* Recherches récentes */}
                  {recentSearches.length > 0 && !value.trim() && (
                    <>
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h4 className="text-sm font-medium">Recherches récentes</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearRecentSearches}
                          className="text-xs text-muted-foreground"
                        >
                          Effacer tout
                        </Button>
                      </div>
                      {suggestions
                        .filter(s => s.type === 'recent')
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer group"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-center gap-3">
                              {getSuggestionIcon(suggestion.type)}
                              <span className="text-sm">{suggestion.text}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(suggestion.text);
                              }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      <Separator />
                    </>
                  )}

                  {/* Suggestions de produits */}
                  {suggestions.filter(s => s.type === 'product').length > 0 && (
                    <>
                      {(recentSearches.length > 0 && !value.trim()) && (
                        <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                          Produits
                        </div>
                      )}
                      {suggestions
                        .filter(s => s.type === 'product')
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.image && (
                              <img
                                src={suggestion.image}
                                alt={suggestion.text}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{suggestion.text}</span>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Suggestions de catégories et marques */}
                  {suggestions.filter(s => ['category', 'brand'].includes(s.type)).length > 0 && (
                    <>
                      <Separator />
                      {suggestions
                        .filter(s => ['category', 'brand'].includes(s.type))
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-center gap-3">
                              {getSuggestionIcon(suggestion.type)}
                              <span className="text-sm">{suggestion.text}</span>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.type === 'category' ? 'Catégorie' : 'Marque'}
                              </Badge>
                            </div>
                            {suggestion.count && (
                              <span className="text-xs text-muted-foreground">
                                {suggestion.count} produits
                              </span>
                            )}
                          </div>
                        ))}
                    </>
                  )}

                  {/* Recherches tendances */}
                  {suggestions.filter(s => s.type === 'trending').length > 0 && !value.trim() && (
                    <>
                      <Separator />
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                        Tendances
                      </div>
                      {suggestions
                        .filter(s => s.type === 'trending')
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {getSuggestionIcon(suggestion.type)}
                            <span className="text-sm">{suggestion.text}</span>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}