import { useState, useEffect } from "react";
import { ProductCard, Product } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { QuickViewModal } from "./QuickViewModal";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "./ui/sheet";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "./ui/pagination";
import { Breadcrumb } from "./Breadcrumb";
import { Filter, Search, Grid, List, X, SlidersHorizontal } from "lucide-react";
import { useCategories } from "../contexts/CategoryContext";
import { useLocalization } from "../contexts/LocalizationContext";
import { useProductGrid } from "../hooks/useResponsive";
import { useProductSearch, ProductSort } from "../hooks/useProductSearch";
import { useSearchParams } from "react-router-dom";

interface ProductsPageProps {
  products: Product[];
  onViewDetails: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewVendor?: (vendorId: string) => void;
  searchQuery: string;
  selectedCategoryId?: string | null;
  selectedSubCategoryId?: string | null;
  onPageChange?: (page: string) => void;
}

export function ProductsPage({ 
  products, 
  onViewDetails, 
  onAddToCart, 
  onViewVendor,
  searchQuery, 
  selectedCategoryId, 
  selectedSubCategoryId,
  onPageChange 
}: ProductsPageProps) {
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { categories, getCategoryById } = useCategories();
  const { t } = useLocalization();

  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery !== null) setLocalSearchQuery(urlQuery);
    const categoriesFromUrl = searchParams.get("categories");
    if (categoriesFromUrl) setSelectedCategories(categoriesFromUrl.split(",").filter(Boolean));
    const vendorFromUrl = searchParams.get("vendor");
    if (vendorFromUrl !== null) setSelectedVendor(vendorFromUrl);
    const sortFromUrl = searchParams.get("sort");
    if (sortFromUrl) setSortBy(sortFromUrl);
    setShowOnSale(searchParams.get("sale") === "1");
    setShowInStock(searchParams.get("stock") === "1");
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (localSearchQuery.trim()) next.set("q", localSearchQuery.trim()); else next.delete("q");
    if (selectedCategories.length) next.set("categories", selectedCategories.join(",")); else next.delete("categories");
    if (selectedVendor) next.set("vendor", selectedVendor); else next.delete("vendor");
    if (sortBy !== "name") next.set("sort", sortBy); else next.delete("sort");
    if (showOnSale) next.set("sale", "1"); else next.delete("sale");
    if (showInStock) next.set("stock", "1"); else next.delete("stock");
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [localSearchQuery, selectedCategories, selectedVendor, sortBy, showOnSale, showInStock, searchParams, setSearchParams]);

  // Get unique categories from products
  const productCategories = Array.from(new Set(products.map(p => p.category)));
  const productVendors = Array.from(new Map(products.map(p => [p.vendorId, p.vendorName])).entries());
  
  // Get selected category details
  const selectedCategory = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const selectedSubCategory = selectedCategory && selectedSubCategoryId 
    ? selectedCategory.subCategories.find(sub => sub.id === selectedSubCategoryId)
    : null;

  // Effect to handle category pre-selection from navigation
  useEffect(() => {
    if (selectedCategoryId && selectedCategory) {
      // Map category ID to category name for filtering
      const categoryName = selectedCategory.name;
      if (!selectedCategories.includes(categoryName)) {
        setSelectedCategories([categoryName]);
      }
    }
  }, [selectedCategoryId, selectedCategory]);

  const sortedProducts = useProductSearch(products, {
    query: localSearchQuery || searchQuery,
    categories: selectedCategories,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    vendorId: selectedVendor,
    inStock: showInStock,
    sortBy: sortBy as ProductSort,
  }).filter(product => !showOnSale || product.isOnSale);

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, showOnSale, showInStock, selectedVendor, localSearchQuery, searchQuery, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const relatedProducts = products.filter(p => 
    quickViewProduct ? p.category === quickViewProduct.category && p.id !== quickViewProduct.id : false
  );

  const clearCategoryFilter = () => {
    setSelectedCategories([]);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setShowOnSale(false);
    setShowInStock(false);
    setSelectedVendor("");
    setLocalSearchQuery('');
    setCurrentPage(1);
  };

  // Generate pagination numbers
  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3">{t("products.filters.categories", "Catégories")}</h4>
        <div className="space-y-2">
          {productCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3">Vendeur</h4>
        <Select value={selectedVendor || "all"} onValueChange={value => setSelectedVendor(value === "all" ? "" : value)}>
          <SelectTrigger><SelectValue placeholder="Tous les vendeurs" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les vendeurs</SelectItem>
            {productVendors.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="mb-3">Prix</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Additional Filters */}
      <div className="space-y-3">
        <h4>Filtres avancés</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="on-sale"
            checked={showOnSale}
            onCheckedChange={setShowOnSale}
          />
          <label htmlFor="on-sale" className="text-sm cursor-pointer">
            En promotion
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStock}
            onCheckedChange={setShowInStock}
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            En stock
          </label>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={clearAllFilters}
        className="w-full"
      >
        Effacer tous les filtres
      </Button>
    </div>
  );

  // Generate breadcrumb items
  const breadcrumbItems = [];
  
  if (selectedCategory) {
    breadcrumbItems.push({
      label: "Catégories",
      onClick: () => onPageChange?.("categories")
    });
    
    breadcrumbItems.push({
      label: selectedCategory.name,
      onClick: selectedSubCategory ? () => {
        // Navigate to category without subcategory
        // This would need to be implemented in the parent component
      } : undefined
    });
    
    if (selectedSubCategory) {
      breadcrumbItems.push({
        label: selectedSubCategory.name
      });
    }
  } else if (searchQuery) {
    breadcrumbItems.push({
      label: `Recherche: "${searchQuery}"`
    });
  } else {
    breadcrumbItems.push({
      label: "Tous les produits"
    });
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={breadcrumbItems}
        onHomeClick={() => onPageChange?.("home")}
        className="pb-2"
      />
      
      {/* Page Header with Category Info */}
      {selectedCategory && (
        <div className="bg-muted rounded-lg p-6 border">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {selectedCategory.name}
                {selectedSubCategory && (
                  <span className="text-muted-foreground"> → {selectedSubCategory.name}</span>
                )}
              </h1>
              <p className="text-muted-foreground">
                {t("products.categoryDescription", "Découvrez notre sélection de produits dans cette catégorie")}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearCategoryFilter}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {t("products.clearCategory", "Effacer")}
            </Button>
          </div>
          {selectedSubCategory && (
            <Badge variant="secondary" className="mt-3">
              {selectedSubCategory.name}
            </Badge>
          )}
        </div>
      )}

      {/* Enhanced Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={localSearchQuery}
            onChange={setLocalSearchQuery}
            onSearch={(query) => setLocalSearchQuery(query)}
            products={products}
            placeholder="Recherchez par nom, marque, catégorie..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {/* Sort, View Mode and Results Count */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Mobile Filters Button */}
            <div className="lg:hidden">
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtres et tri
                    {(selectedCategories.length > 0 || showOnSale || showInStock || selectedVendor) && (
                      <Badge variant="secondary" className="ml-auto">
                        {selectedCategories.length + (showOnSale ? 1 : 0) + (showInStock ? 1 : 0) + (selectedVendor ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-muted-foreground">
                  Affichage de {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} sur {sortedProducts.length} produits
                </p>
                {(selectedCategories.length > 0 || showOnSale || showInStock || selectedVendor) && (
                  <div className="flex flex-wrap gap-1">
                    {selectedCategories.map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => handleCategoryChange(category, false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {showOnSale && (
                      <Badge variant="secondary" className="text-xs">
                        En promotion
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => setShowOnSale(false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {showInStock && (
                      <Badge variant="secondary" className="text-xs">
                        En stock
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                          onClick={() => setShowInStock(false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {selectedVendor && <Badge variant="secondary" className="text-xs">{products.find(product => product.vendorId === selectedVendor)?.vendorName}<Button variant="ghost" size="sm" className="h-auto p-0 ml-1 hover:bg-transparent" onClick={() => setSelectedVendor("")}><X className="h-3 w-3" /></Button></Badge>}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Items per page */}
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-2"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 sm:w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom (A-Z)</SelectItem>
                    <SelectItem value="price-low">Prix ↑</SelectItem>
                    <SelectItem value="price-high">Prix ↓</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                    <SelectItem value="popularity">Popularité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Aucun produit ne correspond à vos critères.</p>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
              >
                {t("products.clearFilters", "Effacer les filtres")}
              </Button>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  : "space-y-4"
              }>
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                    onViewVendor={onViewVendor}
                    onQuickView={() => setQuickViewProduct(product)}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {generatePaginationItems().map((item, index) => (
                        <PaginationItem key={index}>
                          {item === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => setCurrentPage(item as number)}
                              isActive={currentPage === item}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

    {/* Quick View Modal */}
    <QuickViewModal
      product={quickViewProduct}
      isOpen={!!quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
      onAddToCart={onAddToCart}
      onViewFullDetails={onViewDetails}
      relatedProducts={relatedProducts}
    />
  </div>
  );
}