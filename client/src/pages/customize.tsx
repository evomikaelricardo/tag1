import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCart, type CustomizationData } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { type Product } from '@shared/schema';
import Header from '@/components/header';
import CartSidebar from '@/components/cart-sidebar';
import Footer from '@/components/footer';

export default function CustomizePage() {
  const [, params] = useRoute('/customize/:id');
  const [, setLocation] = useLocation();
  const productId = params?.id;
  const { addItemWithCustomization, setIsOpen } = useCart();
  const { toast } = useToast();

  const [customization, setCustomization] = useState<CustomizationData>({
    nameOnTag: '',
    emergencyPhone: '',
    contactType: 'phone_call'
  });

  const [quantity, setQuantity] = useState(1);
  
  // Read quantity from URL params and update state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quantityParam = urlParams.get('quantity');
    if (quantityParam && !isNaN(Number(quantityParam)) && Number(quantityParam) > 0) {
      setQuantity(Number(quantityParam));
    }
  }, []);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    enabled: !!productId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    // Validate required fields
    if (!customization.nameOnTag.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name to print on the tag.",
        variant: "destructive",
      });
      return;
    }

    if (!customization.emergencyPhone.trim()) {
      toast({
        title: "Phone Number Required", 
        description: "Please enter an emergency phone number.",
        variant: "destructive",
      });
      return;
    }

    addItemWithCustomization(product, customization, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} with custom details added to your cart.`,
    });

    // Open cart sidebar to show the added item
    setIsOpen(true);
  };

  const handleInputChange = (field: keyof CustomizationData, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">Loading...</div>
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
        <Link href={`/product/${productId}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8" data-testid="link-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Preview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    data-testid="img-product-preview"
                  />
                  {product.isPopular === 1 && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Popular Choice
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2" data-testid="text-product-name">
                  {product.name}
                </h2>
                <p className="text-muted-foreground mb-4" data-testid="text-product-description">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-primary" data-testid="text-product-price">
                  ${product.price}
                </div>
              </CardContent>
            </Card>

            {/* Preview of customization */}
            <Card>
              <CardHeader>
                <CardTitle>Tag Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="text-sm text-muted-foreground">Name on tag:</div>
                  <div className="font-semibold" data-testid="preview-name">
                    {customization.nameOnTag || 'Enter name...'}
                  </div>
                  <div className="text-sm text-muted-foreground">Emergency contact:</div>
                  <div className="font-semibold" data-testid="preview-phone">
                    {customization.emergencyPhone || 'Enter phone number...'}
                  </div>
                  <div className="text-sm text-muted-foreground">Contact method:</div>
                  <div className="font-semibold capitalize" data-testid="preview-contact-type">
                    {customization.contactType.replace('_', ' ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Form */}
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Emergency Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nameOnTag">Name to Print on Tag *</Label>
                  <Input
                    id="nameOnTag"
                    type="text"
                    placeholder="e.g., John Smith, Bella, etc."
                    value={customization.nameOnTag}
                    onChange={(e) => handleInputChange('nameOnTag', e.target.value)}
                    data-testid="input-name-on-tag"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="e.g., +1234567890"
                    value={customization.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    data-testid="input-emergency-phone"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactType">Contact Type *</Label>
                  <Select 
                    value={customization.contactType} 
                    onValueChange={(value) => handleInputChange('contactType', value as CustomizationData['contactType'])}
                  >
                    <SelectTrigger data-testid="select-contact-type">
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                      <SelectItem value="whatsapp_call">WhatsApp Call</SelectItem>
                      <SelectItem value="emergency_url">Show Emergency Contact Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="button-decrease-quantity"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center space-x-2"
                  data-testid="button-add-to-cart-customized"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart (${(parseFloat(product.price) * quantity).toFixed(2)})</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}