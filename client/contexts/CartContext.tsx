import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Mock data for demo
    {
      id: 1,
      product: { id: 1, name: "Premium Organic Cotton", price: 2.5 },
      quantity: 100,
      price: 250
    },
    {
      id: 2,
      product: { id: 5, name: "Organic Turmeric Powder", price: 8.5 },
      quantity: 50,
      price: 425
    },
    {
      id: 3,
      product: { id: 3, name: "Basmati Rice Premium", price: 1.2 },
      quantity: 200,
      price: 240
    }
  ]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.product.id === item.product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.product.id === item.product.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity, price: cartItem.price + item.price }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity, price: item.product.price * quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value: CartContextType = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
