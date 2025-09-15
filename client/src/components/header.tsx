import { Shield, ShoppingCart, Menu } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const { getTotalItems, setIsOpen } = useCart();
  const totalItems = getTotalItems();

  const NavLinks = () => (
    <>
      <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors">
        Products
      </a>
      <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
        How it Works
      </a>
      <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
        Support
      </a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">SafeTag Pro</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center cart-count show">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
