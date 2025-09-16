import { createContext, useContext, useState, useEffect } from 'react';
import { type Product } from '@shared/schema';
import { createStableHash } from '@/lib/utils';

export interface CustomizationData {
  nameOnTag: string;
  emergencyPhone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization: CustomizationData;
}

interface CartContextType {
  items: CartItem[];
  addItemWithCustomization: (product: Product, customization: CustomizationData, quantity?: number) => void;
  removeItem: (productId: string, customizationHash: string) => void;
  updateQuantity: (productId: string, customizationHash: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Helper function to create a hash from customization data
  const getCustomizationHash = (customization: CustomizationData) => {
    return createStableHash(customization);
  };

  const addItemWithCustomization = (product: Product, customization: CustomizationData, quantity = 1) => {
    setItems(prev => {
      const customizationHash = getCustomizationHash(customization);
      const existingItem = prev.find(item => 
        item.product.id === product.id && 
        getCustomizationHash(item.customization) === customizationHash
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && 
          getCustomizationHash(item.customization) === customizationHash
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, customization }];
    });
  };

  const removeItem = (productId: string, customizationHash: string) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && 
        getCustomizationHash(item.customization) === customizationHash)
    ));
  };

  const updateQuantity = (productId: string, customizationHash: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, customizationHash);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId &&
        getCustomizationHash(item.customization) === customizationHash
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addItemWithCustomization,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    setIsOpen,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
