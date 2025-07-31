import React, { createContext, useContext, useState, useEffect } from 'react';
import { MCardProduct } from '@/types/mcard';

interface CartItem extends MCardProduct {
  mcardId: string;
  mcardOwnerName?: string;
  mcardOwnerUserId?: string;
  addedAt: Date;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: MCardProduct, mcardInfo: { mcardId: string; ownerName?: string; ownerUserId?: string }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('finderid-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('finderid-cart');
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('finderid-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: MCardProduct, mcardInfo: { mcardId: string; ownerName?: string; ownerUserId?: string }) => {
    const cartItem: CartItem = {
      ...product,
      mcardId: mcardInfo.mcardId,
      mcardOwnerName: mcardInfo.ownerName,
      mcardOwnerUserId: mcardInfo.ownerUserId,
      addedAt: new Date()
    };

    setCartItems(prevItems => {
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        // Mettre à jour la date d'ajout si déjà présent
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], addedAt: new Date() };
        return updatedItems;
      }
      // Ajouter le nouveau produit
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};