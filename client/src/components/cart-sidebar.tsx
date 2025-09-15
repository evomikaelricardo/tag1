import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    if (items.length > 0) {
      setIsOpen(false);
      setLocation('/checkout');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-8" data-testid="cart-empty">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add some emergency tags to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`text-cart-item-name-${item.product.id}`}>
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.product.id}`}>
                      ${item.product.price} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      data-testid={`button-decrease-quantity-${item.product.id}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center" data-testid={`text-quantity-${item.product.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      data-testid={`button-increase-quantity-${item.product.id}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t border-border pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary" data-testid="text-cart-total">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
