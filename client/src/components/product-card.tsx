import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@shared/schema';
import { Link } from 'wouter';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/product/${product.id}`} data-testid={`card-product-${product.id}`}>
      <Card className="product-card bg-card rounded-lg border border-border overflow-hidden cursor-pointer">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`img-product-${product.id}`}
        />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold" data-testid={`text-product-name-${product.id}`}>
              {product.name}
            </h3>
            {product.isPopular === 1 && (
              <Badge className="bg-accent text-accent-foreground">Popular</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-4" data-testid={`text-product-description-${product.id}`}>
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
