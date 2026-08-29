import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import { Product } from "./ProductCard";
import { ContactVendorButton } from "./ContactVendorButton";
import { ReviewSection } from "./ReviewSection";
import { getProductImageUrl } from "../utils/imageUrl";

interface ProductDetailPageProps {
  product: Product | null;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  relatedProducts: Product[];
  onViewDetails: (productId: string) => void;
  onPageChange?: (page: string) => void;
  onViewVendor?: (vendorId: string) => void;
}

export function ProductDetailPage({ 
  product, 
  onAddToCart, 
  onBack, 
  relatedProducts, 
  onViewDetails,
  onPageChange,
  onViewVendor
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p>Product not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.image || product.image)
    : [getProductImageUrl(product), getProductImageUrl(product), getProductImageUrl(product)];
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const features = [
    {
      icon: <Truck className="h-4 w-4" />,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "2 Year Warranty",
      description: "Full manufacturer warranty"
    },
    {
      icon: <RotateCcw className="h-4 w-4" />,
      title: "30-Day Returns",
      description: "Hassle-free returns"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="mb-2">{product.name}</h1>
            <button className="mb-3 text-sm font-medium text-primary hover:underline" onClick={() => onViewVendor?.(product.vendorId)}>
              Vendu par {product.vendorName}
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive">
                    -{discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              This is a high-quality product with excellent features and great value for money. 
              Perfect for everyday use with outstanding durability and performance.
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Contact Vendor Button */}
              <ContactVendorButton 
                product={product}
                onPageChange={onPageChange}
                variant="outline"
                size="lg"
                className="w-full"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-primary">{feature.icon}</div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p>
                This product offers exceptional quality and value. Made with premium materials 
                and designed for long-lasting performance. Whether you're a professional or 
                enthusiast, this item will meet your needs and exceed your expectations.
              </p>
              <Separator className="my-4" />
              <p>
                Key features include premium construction, user-friendly design, and excellent 
                customer support. Backed by our satisfaction guarantee and comprehensive warranty.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">10" x 8" x 2"</p>
                </div>
                <div>
                  <h4 className="mb-2">Weight</h4>
                  <p className="text-sm text-muted-foreground">1.2 lbs</p>
                </div>
                <div>
                  <h4 className="mb-2">Material</h4>
                  <p className="text-sm text-muted-foreground">Premium quality materials</p>
                </div>
                <div>
                  <h4 className="mb-2">Color</h4>
                  <p className="text-sm text-muted-foreground">Multiple options available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6"><ReviewSection targetType="product" targetId={product.id} /></TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h3 className="mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <Card key={relatedProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <ImageWithFallback
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h4 
                    className="line-clamp-2 mb-2 hover:text-primary cursor-pointer"
                    onClick={() => onViewDetails(relatedProduct.id)}
                  >
                    {relatedProduct.name}
                  </h4>
                  <p className="font-semibold">${relatedProduct.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}