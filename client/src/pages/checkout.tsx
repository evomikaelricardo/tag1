import { useState } from 'react';
import { ArrowLeft, CreditCard, DollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Link, useLocation } from 'wouter';

type PaymentMethod = 'cash_on_delivery' | 'credit_card' | 'bank_transfer';

const paymentMethods = [
  {
    value: 'cash_on_delivery' as PaymentMethod,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: DollarSign,
  },
  {
    value: 'credit_card' as PaymentMethod,
    label: 'Credit Card',
    description: 'Pay with your credit or debit card',
    icon: CreditCard,
  },
  {
    value: 'bank_transfer' as PaymentMethod,
    label: 'Bank Transfer',
    description: 'Transfer directly from your bank account',
    icon: Building2,
  },
];

function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'US',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order
      const orderData = {
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shippingAddress: {
          street: customerInfo.street,
          city: customerInfo.city,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country,
        },
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: paymentMethod,
      };

      const createResponse = await apiRequest('POST', '/api/create-order', orderData);
      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.message || 'Failed to create order');
      }

      // Confirm order
      const confirmResponse = await apiRequest('POST', '/api/confirm-order', {
        orderId: createData.orderId,
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmData.message || 'Failed to confirm order');
      }

      clearCart();
      
      let successMessage = "Thank you for your purchase!";
      if (paymentMethod === 'cash_on_delivery') {
        successMessage = "Order confirmed! You'll pay when it arrives.";
      } else if (paymentMethod === 'credit_card') {
        successMessage = "Order received! Please complete payment via your credit card.";
      } else if (paymentMethod === 'bank_transfer') {
        successMessage = "Order received! Please complete payment via bank transfer.";
      }

      toast({
        title: "Order Successful",
        description: successMessage,
      });
      
      setLocation(`/order/${createData.orderId}`);
    } catch (error: any) {
      toast({
        title: "Order Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = customerInfo.email && customerInfo.firstName && customerInfo.lastName && 
                     customerInfo.street && customerInfo.city && customerInfo.zipCode;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between" data-testid={`order-item-${item.product.id}`}>
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span data-testid="text-order-total">${getTotalPrice().toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="checkout-form">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="font-medium">Shipping Address</h3>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={customerInfo.street}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, street: e.target.value }))}
                  required
                  data-testid="input-street"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                    required
                    data-testid="input-city"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.zipCode}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                    required
                    data-testid="input-zip"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-medium">Payment Method</h3>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
                data-testid="payment-method-selection"
              >
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={method.value} 
                      id={method.value}
                      data-testid={`payment-method-${method.value}`}
                    />
                    <Label 
                      htmlFor={method.value} 
                      className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <method.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{method.label}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Payment Method Info */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-muted rounded-lg" data-testid="credit-card-info">
                <p className="text-sm text-muted-foreground">
                  After placing your order, you'll receive payment instructions via email to complete your purchase.
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-muted rounded-lg" data-testid="bank-transfer-info">
                <p className="text-sm text-muted-foreground">
                  After placing your order, you'll receive bank account details via email to transfer the payment.
                </p>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="p-4 bg-muted rounded-lg" data-testid="cash-on-delivery-info">
                <p className="text-sm text-muted-foreground">
                  Pay in cash when your order is delivered to your address. No advance payment required.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-complete-order"
            >
              {isLoading ? 'Processing...' : `Complete Order - $${getTotalPrice().toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Checkout() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8" data-testid="link-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8" data-testid="text-checkout-title">Secure Checkout</h1>

        <CheckoutForm />
      </div>

      <Footer />
    </div>
  );
}