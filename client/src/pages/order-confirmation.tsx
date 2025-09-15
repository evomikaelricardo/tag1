import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { CheckCircle, Package, Truck, ArrowLeft, CreditCard, DollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { type Order } from '@shared/schema';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Link } from 'wouter';

export default function OrderConfirmation() {
  const [, params] = useRoute('/order/:id');
  const orderId = params?.id;

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8" data-testid="link-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {isLoading ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : order ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-accent mx-auto" />
                  <h1 className="text-2xl font-bold" data-testid="text-order-success">
                    Order Confirmed!
                  </h1>
                  <p className="text-muted-foreground">
                    {order.paymentMethod === 'cash_on_delivery' 
                      ? "Thank you for your order. You'll pay when it arrives at your address."
                      : order.paymentMethod === 'credit_card'
                      ? "Thank you for your order. Please complete payment to process your order."
                      : "Thank you for your order. Please complete bank transfer to process your order."
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </Badge>
                    <Badge 
                      className={
                        order.status === 'confirmed' ? 'bg-accent text-accent-foreground' : 
                        order.status === 'awaiting_payment' ? 'bg-yellow-500 text-white' :
                        order.status === 'paid' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      }
                    >
                      {order.status === 'confirmed' ? 'Confirmed' : 
                       order.status === 'awaiting_payment' ? 'Awaiting Payment' :
                       order.status === 'paid' ? 'Paid' :
                       order.status.charAt(0).toUpperCase() + order.status.slice(1)
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium" data-testid="text-customer-name">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium" data-testid="text-customer-email">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium" data-testid="text-order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium text-primary" data-testid="text-order-total">
                      ${order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <div className="flex items-center space-x-2">
                      {order.paymentMethod === 'cash_on_delivery' && <DollarSign className="w-4 h-4" />}
                      {order.paymentMethod === 'credit_card' && <CreditCard className="w-4 h-4" />}
                      {order.paymentMethod === 'bank_transfer' && <Building2 className="w-4 h-4" />}
                      <p className="font-medium" data-testid="text-payment-method">
                        {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' :
                         order.paymentMethod === 'credit_card' ? 'Credit Card' :
                         'Bank Transfer'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-muted-foreground mb-2">Shipping Address</p>
                  <div className="text-sm" data-testid="shipping-address">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center" data-testid={`order-item-${index}`}>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">
                        We'll notify you when your order is being prepared
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-muted-foreground">
                        Estimated delivery: 3-5 business days
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions for non-COD orders */}
            {(order.paymentMethod === 'credit_card' || order.paymentMethod === 'bank_transfer') && 
             order.status === 'awaiting_payment' && (
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">
                    Payment Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.paymentMethod === 'credit_card' ? (
                    <div className="space-y-3 text-sm">
                      <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                        Complete your payment to process your order:
                      </p>
                      <div className="space-y-2">
                        <p>• You'll receive payment instructions via email shortly</p>
                        <p>• Use order ID: #{order.id.slice(-8).toUpperCase()}</p>
                        <p>• Your order will be processed once payment is received</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                        Complete your bank transfer to process your order:
                      </p>
                      <div className="space-y-2">
                        <p>• Bank account details will be sent to your email</p>
                        <p>• Include order ID #{order.id.slice(-8).toUpperCase()} in transfer reference</p>
                        <p>• Your order will be processed once payment is received</p>
                        <p>• Processing time: 1-2 business days after payment</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">You'll receive an email confirmation</p>
                      <p className="text-muted-foreground">
                        {order.paymentMethod === 'cash_on_delivery'
                          ? "Check your inbox for order details and tracking information"
                          : "Check your inbox for order details and payment instructions"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Setup instructions included</p>
                      <p className="text-muted-foreground">Each tag comes with easy setup instructions and QR codes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">24/7 support available</p>
                      <p className="text-muted-foreground">Contact us anytime if you need help with setup or have questions</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link href="/">
                    <Button className="w-full" data-testid="button-continue-shopping">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
