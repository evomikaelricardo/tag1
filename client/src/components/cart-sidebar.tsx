import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { createStableHash } from '@/lib/utils';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [, setLocation] = useLocation();

  // Helper function to create a hash from customization data
  const getCustomizationHash = (customization: any) => {
    return createStableHash(customization);
  };

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
              {items.map((item, index) => {
                const customizationHash = getCustomizationHash(item.customization);
                return (
                  <div
                    key={`${item.product.id}-${customizationHash}`}
                    className="flex flex-col space-y-3 p-4 bg-muted/30 rounded-lg"
                    data-testid={`cart-item-${item.product.id}-${index}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium" data-testid={`text-cart-item-name-${item.product.id}-${index}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.product.id}-${index}`}>
                          ${item.product.price} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, customizationHash, item.quantity - 1)}
                          data-testid={`button-decrease-quantity-${item.product.id}-${index}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`text-quantity-${item.product.id}-${index}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, customizationHash, item.quantity + 1)}
                          data-testid={`button-increase-quantity-${item.product.id}-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Customization details */}
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name on tag:</span>
                          <span className="font-medium">{item.customization.nameOnTag}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emergency phone:</span>
                          <span className="font-medium">{item.customization.emergencyPhone}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => removeItem(item.product.id, customizationHash)}
                        data-testid={`button-remove-item-${item.product.id}-${index}`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
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
