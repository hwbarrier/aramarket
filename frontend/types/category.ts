export interface SubCategory {
  id: string;
  name: string;
  nameKey: string; // Pour l'internationalisation
}

export interface Category {
  id: string;
  name: string;
  nameKey: string; // Pour l'internationalisation
  subCategories: SubCategory[];
  icon?: string; // Pour l'icône (Lucide icon name)
  description?: string;
  productCount?: number;
  isActive?: boolean;
}

export interface CustomCategoryRequest {
  id: string;
  productId: string;
  vendorId: string;
  requestedCategory: string;
  requestedSubCategory?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface ProductCategory {
  categoryId: string;
  subCategoryId?: string;
  isCustom: boolean;
  customName?: string;
  customSubName?: string;
}

// Données des catégories prédéfinies
export const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: "fashion",
    name: "Mode et Accessoires",
    nameKey: "categories.fashion",
    icon: "Shirt",
    subCategories: [
      { id: "men-clothing", name: "Vêtements Hommes", nameKey: "categories.fashion.menClothing" },
      { id: "women-clothing", name: "Vêtements Femmes", nameKey: "categories.fashion.womenClothing" },
      { id: "children-clothing", name: "Vêtements Enfants", nameKey: "categories.fashion.childrenClothing" },
      { id: "shoes-accessories", name: "Chaussures et Accessoires", nameKey: "categories.fashion.shoesAccessories" },
      { id: "jewelry-watches", name: "Bijoux et Montres", nameKey: "categories.fashion.jewelryWatches" }
    ]
  },
  {
    id: "technology",
    name: "Technologie et Électronique",
    nameKey: "categories.technology",
    icon: "Smartphone",
    subCategories: [
      { id: "smartphones", name: "Smartphones et Accessoires", nameKey: "categories.technology.smartphones" },
      { id: "computers", name: "Ordinateurs et Tablettes", nameKey: "categories.technology.computers" },
      { id: "electronics", name: "Électronique Grand Public", nameKey: "categories.technology.electronics" }
    ]
  },
  {
    id: "home-furniture",
    name: "Maison et Meubles",
    nameKey: "categories.homeFurniture",
    icon: "Home",
    subCategories: [
      { id: "furniture", name: "Meubles", nameKey: "categories.homeFurniture.furniture" },
      { id: "decoration", name: "Décoration", nameKey: "categories.homeFurniture.decoration" },
      { id: "bedding", name: "Literie et Linge de Maison", nameKey: "categories.homeFurniture.bedding" },
      { id: "kitchen", name: "Articles de Cuisine", nameKey: "categories.homeFurniture.kitchen" },
      { id: "storage", name: "Rangements et Organisation", nameKey: "categories.homeFurniture.storage" }
    ]
  },
  {
    id: "beauty-care",
    name: "Beauté et Soins Personnels",
    nameKey: "categories.beautyCare",
    icon: "Sparkles",
    subCategories: [
      { id: "makeup", name: "Maquillage et Cosmétiques", nameKey: "categories.beautyCare.makeup" },
      { id: "hair-care", name: "Soins Capillaires", nameKey: "categories.beautyCare.hairCare" },
      { id: "skincare", name: "Produits de Soin", nameKey: "categories.beautyCare.skincare" },
      { id: "perfumes", name: "Parfums et Accessoires", nameKey: "categories.beautyCare.perfumes" },
      { id: "natural-products", name: "Produits Bio et Naturels", nameKey: "categories.beautyCare.naturalProducts" }
    ]
  },
  {
    id: "health-wellness",
    name: "Santé et Bien-être",
    nameKey: "categories.healthWellness",
    icon: "Heart",
    subCategories: [
      { id: "supplements", name: "Compléments Alimentaires", nameKey: "categories.healthWellness.supplements" },
      { id: "fitness-equipment", name: "Équipement de Fitness", nameKey: "categories.healthWellness.fitnessEquipment" },
      { id: "sportswear", name: "Vêtements de Sport", nameKey: "categories.healthWellness.sportswear" },
      { id: "personal-care", name: "Soins Personnels", nameKey: "categories.healthWellness.personalCare" }
    ]
  },
  {
    id: "food-drinks",
    name: "Alimentation et Boissons",
    nameKey: "categories.foodDrinks",
    icon: "Coffee",
    subCategories: [
      { id: "food-products", name: "Produits Alimentaires", nameKey: "categories.foodDrinks.foodProducts" },
      { id: "organic-fair", name: "Alimentation Bio et Équitable", nameKey: "categories.foodDrinks.organicFair" },
      { id: "beverages", name: "Boissons", nameKey: "categories.foodDrinks.beverages" },
      { id: "seasonal-baskets", name: "Paniers de Saison", nameKey: "categories.foodDrinks.seasonalBaskets" }
    ]
  },
  {
    id: "sports-leisure",
    name: "Sports et Loisirs",
    nameKey: "categories.sportsLeisure",
    icon: "Trophy",
    subCategories: [
      { id: "sports-equipment", name: "Équipements Sportifs", nameKey: "categories.sportsLeisure.sportsEquipment" },
      { id: "sports-clothing", name: "Vêtements et Accessoires", nameKey: "categories.sportsLeisure.sportsClothing" },
      { id: "outdoor-camping", name: "Articles de Camping", nameKey: "categories.sportsLeisure.outdoorCamping" },
      { id: "games-puzzles", name: "Jeux de Société", nameKey: "categories.sportsLeisure.gamesPuzzles" },
      { id: "diy-crafts", name: "Bricolage et DIY", nameKey: "categories.sportsLeisure.diyCrafts" }
    ]
  },
  {
    id: "children-baby",
    name: "Enfants et Bébé",
    nameKey: "categories.childrenBaby",
    icon: "Baby",
    subCategories: [
      { id: "children-clothes", name: "Vêtements pour Enfants", nameKey: "categories.childrenBaby.childrenClothes" },
      { id: "toys-games", name: "Jouets et Jeux", nameKey: "categories.childrenBaby.toysGames" },
      { id: "baby-equipment", name: "Équipements pour Bébé", nameKey: "categories.childrenBaby.babyEquipment" },
      { id: "baby-care", name: "Produits de Soins", nameKey: "categories.childrenBaby.babyCare" },
      { id: "children-furniture", name: "Mobilier et Décoration", nameKey: "categories.childrenBaby.childrenFurniture" }
    ]
  },
  {
    id: "arts-crafts",
    name: "Arts, Artisanat et Création",
    nameKey: "categories.artsCrafts",
    icon: "Palette",
    subCategories: [
      { id: "art-supplies", name: "Fournitures Artistiques", nameKey: "categories.artsCrafts.artSupplies" },
      { id: "handmade-jewelry", name: "Bijoux Faits Main", nameKey: "categories.artsCrafts.handmadeJewelry" },
      { id: "craft-decoration", name: "Décoration Artisanale", nameKey: "categories.artsCrafts.craftDecoration" },
      { id: "craft-materials", name: "Bricolage et Matériaux", nameKey: "categories.artsCrafts.craftMaterials" },
      { id: "musical-instruments", name: "Instruments de Musique", nameKey: "categories.artsCrafts.musicalInstruments" }
    ]
  },
  {
    id: "vehicles-accessories",
    name: "Véhicules et Accessoires",
    nameKey: "categories.vehiclesAccessories",
    icon: "Car",
    subCategories: [
      { id: "cars-motorcycles", name: "Voitures et Motos", nameKey: "categories.vehiclesAccessories.carsMotorcycles" },
      { id: "auto-accessories", name: "Accessoires Auto", nameKey: "categories.vehiclesAccessories.autoAccessories" },
      { id: "bikes-scooters", name: "Vélos et Trottinettes", nameKey: "categories.vehiclesAccessories.bikesScooters" },
      { id: "vehicle-equipment", name: "Équipements pour Véhicules", nameKey: "categories.vehiclesAccessories.vehicleEquipment" },
      { id: "protective-gear", name: "Équipements de Protection", nameKey: "categories.vehiclesAccessories.protectiveGear" }
    ]
  },
  {
    id: "plants-gardening",
    name: "Fleurs, Plantes et Jardinage",
    nameKey: "categories.plantsGardening",
    icon: "Flower",
    subCategories: [
      { id: "plants", name: "Plantes d'Intérieur et d'Extérieur", nameKey: "categories.plantsGardening.plants" },
      { id: "garden-accessories", name: "Accessoires de Jardin", nameKey: "categories.plantsGardening.gardenAccessories" },
      { id: "fresh-flowers", name: "Fleurs Fraîches", nameKey: "categories.plantsGardening.freshFlowers" },
      { id: "garden-furniture", name: "Mobilier de Jardin", nameKey: "categories.plantsGardening.gardenFurniture" }
    ]
  },
  {
    id: "eco-sustainable",
    name: "Produits Écologiques et Durables",
    nameKey: "categories.ecoSustainable",
    icon: "Leaf",
    subCategories: [
      { id: "zero-waste", name: "Produits Zéro Déchet", nameKey: "categories.ecoSustainable.zeroWaste" },
      { id: "renewable-energy", name: "Énergies Renouvelables", nameKey: "categories.ecoSustainable.renewableEnergy" }
    ]
  },
  {
    id: "books-media",
    name: "Livres, Musique et Médias",
    nameKey: "categories.booksMedia",
    icon: "Book",
    subCategories: [
      { id: "books", name: "Livres Papier et E-books", nameKey: "categories.booksMedia.books" },
      { id: "music-movies", name: "Musique et Films", nameKey: "categories.booksMedia.musicMovies" },
      { id: "streaming", name: "Films et Séries", nameKey: "categories.booksMedia.streaming" }
    ]
  }
];