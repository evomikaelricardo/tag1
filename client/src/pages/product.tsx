import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { ArrowLeft, Plus, Minus, Shield, Droplets, Smartphone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@shared/schema';
import Header from '@/components/header';
import CartSidebar from '@/components/cart-sidebar';
import Footer from '@/components/footer';
import { Link } from 'wouter';
import { useState } from 'react';

export default function ProductPage() {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name} added to your cart.`,
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8" data-testid="link-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                data-testid="img-product"
              />
              {product.isPopular === 1 && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Popular Choice
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-primary mb-4" data-testid="text-product-price">
                  ${product.price}
                </p>
                <p className="text-muted-foreground text-lg" data-testid="text-product-description">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2" data-testid="product-features">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Use Cases */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Perfect For</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.category === 'kids' && (
                      <>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">School Safety</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Field Trips</p>
                        </div>
                      </>
                    )}
                    {product.category === 'pets' && (
                      <>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Daily Walks</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Droplets className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Swimming</p>
                        </div>
                      </>
                    )}
                    {product.category === 'luggage' && (
                      <>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Travel</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Smartphone className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Business Trips</p>
                        </div>
                      </>
                    )}
                    {product.category === 'elderly' && (
                      <>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Medical Events</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm font-medium">Daily Activities</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="button-decrease-quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  data-testid="button-add-to-cart"
                >
                  Add to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
                </Button>
              </div>

              {/* Additional Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">What's Included</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                      1x Emergency NFC Tag
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                      Setup Instructions & QR Code
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                      Lifetime Web Portal Access
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                      24/7 Customer Support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
