import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryManagement } from "./CategoryManagement";
import { MessageManagement } from "./MessageManagement";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  UserCheck,
  AlertTriangle,
  Eye,
  Tag,
  MessageSquare
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

export function AdminDashboard({ onPageChange }: AdminDashboardProps) {
  const { orders, isLoading: ordersLoading } = useOrders();
  const stats = [
    {
      title: "Utilisateurs Total",
      value: "2,847",
      change: "+12%",
      icon: <Users className="h-4 w-4" />,
      changeType: "positive" as const
    },
    {
      title: "Produits Actifs",
      value: "1,234",
      change: "+5%",
      icon: <Package className="h-4 w-4" />,
      changeType: "positive" as const
    },
    {
      title: "Commandes ce mois",
      value: "892",
      change: "+18%",
      icon: <ShoppingCart className="h-4 w-4" />,
      changeType: "positive" as const
    },
    {
      title: "Revenus",
      value: "€45,231",
      change: "+7%",
      icon: <TrendingUp className="h-4 w-4" />,
      changeType: "positive" as const
    }
  ];

  const recentUsers = [
    { id: '1', name: 'Marie Dubois', email: 'marie@email.com', role: 'Client', status: 'Actif', joinDate: '2024-01-15' },
    { id: '2', name: 'Pierre Martin', email: 'pierre@email.com', role: 'Vendeur', status: 'En attente', joinDate: '2024-01-14' },
    { id: '3', name: 'Sophie Laurent', email: 'sophie@email.com', role: 'Client', status: 'Actif', joinDate: '2024-01-13' },
  ];

  const recentProducts = [
    { id: '1', name: 'iPhone 15 Pro', vendor: 'Apple Store', price: '€1,199', status: 'Approuvé', date: '2024-01-15' },
    { id: '2', name: 'MacBook Air M2', vendor: 'Tech World', price: '€1,299', status: 'En révision', date: '2024-01-14' },
    { id: '3', name: 'AirPods Pro', vendor: 'Apple Store', price: '€279', status: 'Approuvé', date: '2024-01-13' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Actif':
      case 'Approuvé':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Actif</Badge>;
      case 'En attente':
      case 'En révision':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tableau de bord Admin</h1>
          <p className="text-muted-foreground">
            Gérez votre plateforme AraMarket
          </p>
        </div>
        <Button onClick={() => onPageChange('settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
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
                  <p className="text-sm text-green-600 mt-1">{stat.change} ce mois</p>
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
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Produits
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag className="h-4 w-4 mr-2" />
            Catégories
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{user.role}</Badge>
                      {getStatusBadge(user.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Par {product.vendor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{product.price}</span>
                      {getStatusBadge(product.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <MessageManagement onBack={() => {}} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                {ordersLoading ? <p className="text-muted-foreground">Chargement...</p> : orders.length === 0 ? <p className="text-muted-foreground">Aucune commande locale.</p> : <div className="space-y-3 text-left">{orders.flatMap(order => (order.vendors || []).map(vendorOrder => <div key={vendorOrder.id} className="rounded border p-3"><div className="flex justify-between"><span>{vendorOrder.vendorName}</span><Badge>{vendorOrder.deliveryStatus || vendorOrder.status}</Badge></div>{vendorOrder.trackingNumber && <p className="text-sm text-muted-foreground">{vendorOrder.carrier}: {vendorOrder.trackingNumber}</p>}</div>))}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics détaillées en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Section */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Attention</p>
              <p className="text-sm text-yellow-700">
                3 produits en attente de validation et 2 utilisateurs nécessitent une vérification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}