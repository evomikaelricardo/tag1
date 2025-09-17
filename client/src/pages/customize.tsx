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
import ReactCountryFlag from 'react-country-flag';

export default function CustomizePage() {
  const [, params] = useRoute('/customize/:id');
  const [, setLocation] = useLocation();
  const productId = params?.id;
  const { addItemWithCustomization, setIsOpen } = useCart();
  const { toast } = useToast();

  const [customization, setCustomization] = useState<CustomizationData>({
    nameOnTag: '',
    emergencyPhone: ''
  });

  const [selectedCountryCode, setSelectedCountryCode] = useState('+62'); // Indonesia default
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const handlePhoneChange = (phoneValue: string) => {
    setPhoneNumber(phoneValue);
    const fullPhone = selectedCountryCode + phoneValue;
    handleInputChange('emergencyPhone', fullPhone);
  };

  const handleCountryCodeChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    const fullPhone = countryCode + phoneNumber;
    handleInputChange('emergencyPhone', fullPhone);
  };

  // Country codes data
  const countryCodes = [
    { code: '+62', name: 'Indonesia', countryCode: 'ID' },
    { code: '+1', name: 'United States', countryCode: 'US' },
    { code: '+44', name: 'United Kingdom', countryCode: 'GB' },
    { code: '+86', name: 'China', countryCode: 'CN' },
    { code: '+91', name: 'India', countryCode: 'IN' },
    { code: '+81', name: 'Japan', countryCode: 'JP' },
    { code: '+49', name: 'Germany', countryCode: 'DE' },
    { code: '+33', name: 'France', countryCode: 'FR' },
    { code: '+39', name: 'Italy', countryCode: 'IT' },
    { code: '+34', name: 'Spain', countryCode: 'ES' },
    { code: '+7', name: 'Russia', countryCode: 'RU' },
    { code: '+55', name: 'Brazil', countryCode: 'BR' },
    { code: '+52', name: 'Mexico', countryCode: 'MX' },
    { code: '+61', name: 'Australia', countryCode: 'AU' },
    { code: '+82', name: 'South Korea', countryCode: 'KR' },
    { code: '+65', name: 'Singapore', countryCode: 'SG' },
    { code: '+60', name: 'Malaysia', countryCode: 'MY' },
    { code: '+66', name: 'Thailand', countryCode: 'TH' },
    { code: '+84', name: 'Vietnam', countryCode: 'VN' },
    { code: '+63', name: 'Philippines', countryCode: 'PH' },
    { code: '+31', name: 'Netherlands', countryCode: 'NL' },
    { code: '+41', name: 'Switzerland', countryCode: 'CH' },
    { code: '+46', name: 'Sweden', countryCode: 'SE' },
    { code: '+47', name: 'Norway', countryCode: 'NO' },
    { code: '+45', name: 'Denmark', countryCode: 'DK' },
    { code: '+358', name: 'Finland', countryCode: 'FI' },
    { code: '+43', name: 'Austria', countryCode: 'AT' },
    { code: '+32', name: 'Belgium', countryCode: 'BE' },
    { code: '+351', name: 'Portugal', countryCode: 'PT' },
    { code: '+30', name: 'Greece', countryCode: 'GR' },
    { code: '+90', name: 'Turkey', countryCode: 'TR' },
    { code: '+48', name: 'Poland', countryCode: 'PL' },
    { code: '+420', name: 'Czech Republic', countryCode: 'CZ' },
    { code: '+36', name: 'Hungary', countryCode: 'HU' },
    { code: '+40', name: 'Romania', countryCode: 'RO' },
    { code: '+27', name: 'South Africa', countryCode: 'ZA' },
    { code: '+20', name: 'Egypt', countryCode: 'EG' },
    { code: '+971', name: 'UAE', countryCode: 'AE' },
    { code: '+966', name: 'Saudi Arabia', countryCode: 'SA' },
    { code: '+972', name: 'Israel', countryCode: 'IL' },
    { code: '+852', name: 'Hong Kong', countryCode: 'HK' },
    { code: '+886', name: 'Taiwan', countryCode: 'TW' },
    { code: '+64', name: 'New Zealand', countryCode: 'NZ' },
    { code: '+56', name: 'Chile', countryCode: 'CL' },
    { code: '+54', name: 'Argentina', countryCode: 'AR' },
    { code: '+57', name: 'Colombia', countryCode: 'CO' },
    { code: '+51', name: 'Peru', countryCode: 'PE' },
    { code: '+598', name: 'Uruguay', countryCode: 'UY' },
    { code: '+595', name: 'Paraguay', countryCode: 'PY' },
    { code: '+593', name: 'Ecuador', countryCode: 'EC' },
    { code: '+591', name: 'Bolivia', countryCode: 'BO' },
    { code: '+58', name: 'Venezuela', countryCode: 'VE' }
  ];

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
                  <div className="flex gap-2">
                    <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
                      <SelectTrigger className="w-[140px]" data-testid="select-country-code">
                        <SelectValue>
                          {selectedCountryCode && (
                            <span className="flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={countryCodes.find(c => c.code === selectedCountryCode)?.countryCode || 'ID'} 
                                svg 
                                style={{
                                  width: '1.2em',
                                  height: '1.2em',
                                  borderRadius: '2px'
                                }}
                              />
                              <span>{selectedCountryCode}</span>
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={country.countryCode} 
                                svg 
                                style={{
                                  width: '1.2em',
                                  height: '1.2em',
                                  borderRadius: '2px'
                                }}
                              />
                              <span>{country.code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="e.g., 1234567890"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      data-testid="input-emergency-phone"
                      className="flex-1"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full number: {selectedCountryCode}{phoneNumber || 'xxxxxxxxxx'}
                  </p>
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