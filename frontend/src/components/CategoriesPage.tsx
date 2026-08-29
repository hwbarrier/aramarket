import { useState } from "react";
import { Search, ChevronRight, Grid3X3, List, Filter, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";
import { useCategories } from "../contexts/CategoryContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Breadcrumb } from "./Breadcrumb";
import { BarChart3, BookOpen, HeartPulse, Home, Leaf, Palette, ShoppingBag, Sparkles, Tag, type LucideIcon } from "lucide-react";

interface CategoriesPageProps {
  onCategorySelect: (categoryId: string, subCategoryId?: string) => void;
  onPageChange: (page: string) => void;
}

export function CategoriesPage({ onCategorySelect, onPageChange }: CategoriesPageProps) {
  const { categories, searchCategories } = useCategories();
  const { t } = useLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "popularity" | "subcategories">("name");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCategories = searchQuery ? searchCategories(searchQuery) : categories;

  // Mock data pour les catégories populaires et tendances
  const popularCategories = ["fashion", "technology", "home-furniture", "beauty-care"];
  const trendingCategories = ["eco-sustainable", "health-wellness", "arts-crafts"];

  const getTabCategories = () => {
    switch (activeTab) {
      case "popular":
        return filteredCategories.filter(cat => popularCategories.includes(cat.id));
      case "trending":
        return filteredCategories.filter(cat => trendingCategories.includes(cat.id));
      default:
        return filteredCategories;
    }
  };

  const sortedCategories = [...getTabCategories()].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return popularCategories.indexOf(a.id) - popularCategories.indexOf(b.id);
      case "subcategories":
        return b.subCategories.length - a.subCategories.length;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryClick = (categoryId: string, subCategoryId?: string) => {
    // Naviguer vers la page des produits avec un filtre de catégorie
    onCategorySelect(categoryId, subCategoryId);
    onPageChange("products");
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const iconMap: Record<string, LucideIcon> = {
      BarChart3, BookOpen, HeartPulse, Home, Leaf, Palette, ShoppingBag, Sparkles, Tag,
    };
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    
    return <IconComponent className="h-8 w-8 text-primary" />;
  };

  const getCategoryImage = (categoryId: string) => {
    const imageMap: Record<string, string> = {
      fashion: "https://images.unsplash.com/photo-1571582665859-4a5f472ee21b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdHlsZSUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1ODY1NDQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technology: "https://images.unsplash.com/photo-1758186386318-42f7fb10f465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZWxlY3Ryb25pY3MlMjBnYWRnZXRzfGVufDF8fHx8MTc1ODY1Mzc1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "home-furniture": "https://images.unsplash.com/photo-1674118276594-a868960ed426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZnVybml0dXJlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU4NjIxNTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "beauty-care": "https://images.unsplash.com/photo-1688955665338-fb430ff8436d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBza2luY2FyZXxlbnwxfHx8fDE3NTg2MjQ0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "health-wellness": "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1ODU5NDk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "eco-sustainable": "https://images.unsplash.com/photo-1709797402281-aac1753af0de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBzdXN0YWluYWJsZSUyMGdyZWVuJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzU4NjUzODc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "food-drinks": "https://images.unsplash.com/photo-1650619338416-1d39d2186bda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZHJpbmtzJTIwa2l0Y2hlbiUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU4NjU0Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "sports-leisure": "https://images.unsplash.com/photo-1758346509780-c872ce25d75e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBsZWlzdXJlJTIwb3V0ZG9vciUyMGFjdGl2aXRpZXN8ZW58MXx8fHwxNzU4NjU0Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "children-baby": "https://images.unsplash.com/photo-1596064459298-e41e6c08fa7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJhYnklMjBraWRzJTIwdG95c3xlbnwxfHx8fDE3NTg2NTQzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "arts-crafts": "https://images.unsplash.com/photo-1586512803683-bdc3f85b15a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRzJTIwY3JhZnRzJTIwY3JlYXRpdmUlMjBzdXBwbGllc3xlbnwxfHx8fDE3NTg2NTQzODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "vehicles-accessories": "https://images.unsplash.com/photo-1613517254043-901337adc0c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlcyUyMGNhcnMlMjBhdXRvbW90aXZlJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU4NjU0Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "plants-gardening": "https://images.unsplash.com/photo-1680562556990-f2922f6892b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudHMlMjBnYXJkZW5pbmclMjBmbG93ZXJzJTIwbmF0dXJlfGVufDF8fHx8MTc1ODY1NDM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "books-media": "https://images.unsplash.com/photo-1581832097738-9810da6766c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMG1lZGlhJTIwbGlicmFyeSUyMHJlYWRpbmd8ZW58MXx8fHwxNzU4NjU0Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    };
    return imageMap[categoryId];
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Breadcrumb
          items={[
            { label: t("breadcrumb.home", "Accueil"), onClick: () => onPageChange("home") },
            { label: t("breadcrumb.categories", "Catégories") }
          ]}
        />
      </motion.div>

      {/* En-tête de la page */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-foreground">
          {t("categories.title", "Toutes les Catégories")}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("categories.description", "Découvrez notre large gamme de produits organisés par catégories. Trouvez facilement ce que vous cherchez parmi nos différentes sections.")}
        </p>
      </motion.div>

      {/* Barre de recherche et contrôles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t("categories.searchPlaceholder", "Rechercher une catégorie...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contrôles d'affichage et tri */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Trier par nom</SelectItem>
                <SelectItem value="popularity">Plus populaires</SelectItem>
                <SelectItem value="subcategories">Plus de sous-catégories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
      >
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold text-primary">{categories.length}</p>
              <p className="text-sm text-muted-foreground">
                {t("categories.stats.total", "Catégories")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold text-primary">
                {categories.reduce((acc, cat) => acc + cat.subCategories.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("categories.stats.subCategories", "Sous-catégories")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-2xl font-bold text-primary">
                {sortedCategories.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("categories.stats.filtered", "Trouvées")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets de catégories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Toutes
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Populaires
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendances
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Liste des catégories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {sortedCategories.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("categories.noResults", "Aucune catégorie trouvée")}
            </h3>
            <p className="text-muted-foreground">
              {t("categories.noResultsDesc", "Essayez avec un autre terme de recherche")}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Image de catégorie en arrière-plan */}
                  <div className="relative h-32 overflow-hidden">
                    {getCategoryImage(category.id) ? (
                      <ImageWithFallback
                        src={getCategoryImage(category.id)}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {renderIcon(category.icon)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute top-4 right-4">
                      {popularCategories.includes(category.id) && (
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Populaire
                        </Badge>
                      )}
                      {trendingCategories.includes(category.id) && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {!getCategoryImage(category.id) && renderIcon(category.icon)}
                          {category.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {category.subCategories.length} {t("categories.subCategoriesCount", "sous-catégories")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {/* Bouton principal de la catégorie */}
                      <Button
                        className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <span>{t("categories.viewAll", "Voir tous les produits")}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>

                      {/* Sous-catégories */}
                      {category.subCategories.length > 0 && (
                        <div className="space-y-1 pt-2 border-t">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {t("categories.subCategories", "Sous-catégories")} :
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            {category.subCategories.slice(0, 3).map((subCategory) => (
                              <Button
                                key={subCategory.id}
                                variant="ghost"
                                size="sm"
                                className="justify-start h-auto py-1 px-2 text-xs hover:bg-accent"
                                onClick={() => handleCategoryClick(category.id, subCategory.id)}
                              >
                                <ChevronRight className="h-3 w-3 mr-1" />
                                <span className="truncate">{subCategory.name}</span>
                              </Button>
                            ))}
                            {category.subCategories.length > 3 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start h-auto py-1 px-2 text-xs text-primary hover:bg-accent"
                                onClick={() => handleCategoryClick(category.id)}
                              >
                                +{category.subCategories.length - 3} {t("categories.more", "de plus")}
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Vue en liste
          <div className="space-y-4">
            {sortedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="group hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          {renderIcon(category.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.subCategories.length} sous-catégories
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {popularCategories.includes(category.id) && (
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Populaire
                          </Badge>
                        )}
                        {trendingCategories.includes(category.id) && (
                          <Badge variant="outline">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Tendance
                          </Badge>
                        )}
                        <Button
                          onClick={() => handleCategoryClick(category.id)}
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Explorer
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Catégories recommandées */}
      {!searchQuery && activeTab === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              {t("categories.recommended.title", "Catégories Recommandées")}
            </h2>
            <p className="text-muted-foreground">
              {t("categories.recommended.description", "Découvrez nos catégories les plus appréciées par nos utilisateurs")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégorie populaire */}
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-primary/20">
              <div className="relative h-40">
                <ImageWithFallback
                  src={getCategoryImage("fashion")}
                  alt="Mode et Accessoires"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="mb-2 bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Plus Populaire
                  </Badge>
                  <h3 className="text-xl font-semibold">Mode et Accessoires</h3>
                  <p className="text-sm opacity-90">+5000 produits disponibles</p>
                </div>
                <Button
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-foreground"
                  size="sm"
                  onClick={() => handleCategoryClick("fashion")}
                >
                  Explorer
                </Button>
              </div>
            </Card>

            {/* Catégorie tendance */}
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-primary/20">
              <div className="relative h-40">
                <ImageWithFallback
                  src={getCategoryImage("eco-sustainable")}
                  alt="Produits Écologiques"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="mb-2 bg-primary text-primary-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Tendance
                  </Badge>
                  <h3 className="text-xl font-semibold">Produits Écologiques</h3>
                  <p className="text-sm opacity-90">+1200 produits durables</p>
                </div>
                <Button
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-foreground"
                  size="sm"
                  onClick={() => handleCategoryClick("eco-sustainable")}
                >
                  Explorer
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Section d'aide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 text-center border border-primary/10"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">
            {t("categories.help.title", "Vous ne trouvez pas ce que vous cherchez ?")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("categories.help.description", "Explorez tous nos produits ou retournez à l'accueil pour découvrir nos recommandations personnalisées.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => onPageChange("products")} className="group">
              {t("categories.help.browseAll", "Parcourir tous les produits")}
              <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={() => onPageChange("home")} className="group">
              {t("categories.help.backHome", "Retour à l'accueil")}
              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Informations de fin de page */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground border-t pt-6"
        >
          <p>
            {t("categories.footer.info", "Dernière mise à jour des catégories : Aujourd'hui")} • 
            <span className="ml-1">
              {categories.length} catégories • {categories.reduce((acc, cat) => acc + cat.subCategories.length, 0)} sous-catégories
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
}