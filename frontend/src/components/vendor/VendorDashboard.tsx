import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CategorySelector } from "../CategorySelector";
import { 
  Package, 
  Plus, 
  TrendingUp, 
  ShoppingCart, 
  Euro,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useVendorDashboard } from "../../hooks/useVendorDashboard";

interface VendorDashboardProps {
  onPageChange: (page: string) => void;
}

export function VendorDashboard({ onPageChange }: VendorDashboardProps) {
  const { authState } = useAuth();
  const vendorId = authState.user?.vendorProfileId || authState.user?.id;
  const dashboard = useVendorDashboard(String(vendorId));
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    isCustomCategory: false,
    customCategory: '',
    customSubCategory: '',
    customDescription: ''
  });

  const stats = [
    {
      title: "Mes Produits",
      value: String(dashboard.stats?.productCount ?? 0),
      change: "+2 ce mois",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Ventes Totales",
      value: `€${(dashboard.stats?.sales ?? 0).toFixed(2)}`,
      change: "+15% ce mois",
      icon: <Euro className="h-4 w-4" />,
    },
    {
      title: "Commandes",
      value: String(dashboard.stats?.orderCount ?? 0),
      change: "+8 cette semaine",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Taux de Conversion",
      value: `${dashboard.stats?.conversionRate ?? 0}%`,
      change: "+0.5% ce mois",
      icon: <TrendingUp className="h-4 w-4" />,
    }
  ];

  const myProducts = (Array.isArray(dashboard.products) ? dashboard.products : []).map(product => ({
    id: product.id, name: product.name, price: `€${product.price.toFixed(2)}`, stock: product.stockQuantity,
    status: product.inStock ? 'Publié' : 'Épuisé', sales: 0, views: 0
  }));
  /* const myProducts = [
    { 
      id: '1', 
      name: 'Casque Bluetooth Premium', 
      price: '€79.99', 
      stock: 15, 
      status: 'Publié',
      sales: 23,
      views: 234
    },
    { 
      id: '2', 
      name: 'Montre Connectée Sport', 
      price: '€199.99', 
      stock: 8, 
      status: 'En révision',
      sales: 12,
      views: 156
    },
    { 
      id: '3', 
      name: 'Chargeur Sans Fil', 
      price: '€29.99', 
      stock: 0, 
      status: 'Épuisé',
      sales: 45,
      views: 789
    },
  ]; */

  const recentOrders = (Array.isArray(dashboard.orders) ? dashboard.orders : []).map(order => ({
    id: order.id, product: order.items[0]?.productName || 'Commande vendeur', customer: 'Client',
    amount: `€${order.subtotal.toFixed(2)}`, status: order.status, date: ''
  }));
  /* const recentOrders = [
    { id: 'CMD-001', product: 'Casque Bluetooth Premium', customer: 'M***@email.com', amount: '€79.99', status: 'Expédiée', date: '15/01/2024' },
    { id: 'CMD-002', product: 'Montre Connectée Sport', customer: 'S***@email.com', amount: '€199.99', status: 'En traitement', date: '14/01/2024' },
    { id: 'CMD-003', product: 'Chargeur Sans Fil', customer: 'J***@email.com', amount: '€29.99', status: 'Livrée', date: '13/01/2024' },
  ]; */

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Publié':
      case 'Expédiée':
      case 'Livrée':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">{status}</Badge>;
      case 'En révision':
      case 'En traitement':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case 'Épuisé':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCategoryChange = (categoryId: string, subCategoryId?: string) => {
    setNewProduct(prev => ({
      ...prev,
      categoryId,
      subCategoryId: subCategoryId || '',
      isCustomCategory: false,
      customCategory: '',
      customSubCategory: '',
      customDescription: ''
    }));
  };

  const handleCustomCategoryChange = (category: string, subCategory?: string, description?: string) => {
    setNewProduct(prev => ({
      ...prev,
      categoryId: '',
      subCategoryId: '',
      isCustomCategory: true,
      customCategory: category,
      customSubCategory: subCategory || '',
      customDescription: description || ''
    }));
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - En production, envoyer à l'API
    setNewProduct({ 
      name: '', 
      price: '', 
      description: '', 
      categoryId: '',
      subCategoryId: '',
      isCustomCategory: false,
      customCategory: '',
      customSubCategory: '',
      customDescription: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Mon Espace Vendeur</h1>
          <p className="text-muted-foreground">
            Bienvenue {authState.user?.name}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="text-primary">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Mes Produits
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="add-product">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Produit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Produits ({myProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} • {product.sales} ventes • {product.views} vues
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input aria-label={`Prix ${product.name}`} className="w-24 h-8" type="number" defaultValue={product.price.replace("€","")} onBlur={(e) => dashboard.updateProduct(product.id, { price: Number(e.target.value) })} />
                      <Input aria-label={`Stock ${product.name}`} className="w-16 h-8" type="number" defaultValue={product.stock} onBlur={(e) => dashboard.updateProduct(product.id, { stockQuantity: Number(e.target.value), inStock: Number(e.target.value) > 0 })} />
                      {getStatusBadge(product.status)}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => dashboard.updateProduct(product.id, { inStock: product.stock === 0 })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                      <p className="text-sm text-muted-foreground">Client: {order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.amount}</p>
                      <p className="text-sm text-muted-foreground mb-1">{order.date}</p>
                      {getStatusBadge(order.status)}
                      <select aria-label={`Statut ${order.id}`} value={order.status} onChange={event => void dashboard.updateOrderStatus(order.id, event.target.value as import("../../types/order").OrderStatus)} className="mt-2 rounded border bg-background p-1 text-sm"><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="shipped">Expédiée</option><option value="delivered">Livrée</option><option value="cancelled">Annulée</option></select>
                      {order.status === "shipped" && <div className="mt-2 space-y-1"><Input placeholder="Transporteur" defaultValue={order.carrier} onBlur={event => void dashboard.updateShipment(order.id, { carrier: event.target.value, trackingNumber: order.trackingNumber || "" })} /><Input placeholder="N° de suivi" defaultValue={order.trackingNumber} onBlur={event => void dashboard.updateShipment(order.id, { carrier: order.carrier || "", trackingNumber: event.target.value })} /></div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-product" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un Nouveau Produit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nom du produit</Label>
                    <Input
                      id="product-name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Casque Bluetooth Premium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Prix (€)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="29.99"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre produit en détail..."
                    rows={4}
                  />
                </div>
                
                <CategorySelector
                  selectedCategoryId={newProduct.categoryId}
                  selectedSubCategoryId={newProduct.subCategoryId}
                  customCategory={newProduct.customCategory}
                  customSubCategory={newProduct.customSubCategory}
                  isCustom={newProduct.isCustomCategory}
                  onCategoryChange={handleCategoryChange}
                  onCustomCategoryChange={handleCustomCategoryChange}
                  vendorId={authState.user?.id}
                  productId={undefined} // sera défini après création du produit
                  showDescription={true}
                />
                
                <div className="flex gap-4">
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le Produit
                  </Button>
                  <Button type="button" variant="outline">
                    Brouillon
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}