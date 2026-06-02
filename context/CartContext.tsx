"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gamehub_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("gamehub_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    // Basic validation
    if (product.stock <= 0) {
      return { success: false, message: "Produk sudah habis!" };
    }

    let success = true;
    let message = "";

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQtyInCart = existingItem ? existingItem.quantity : 0;
      const targetQty = currentQtyInCart + quantity;

      if (targetQty > product.stock) {
        success = false;
        message = `Tidak bisa menambah item. Jumlah melebihi stok yang tersedia (${product.stock}).`;
        return prevCart;
      }

      message = `Berhasil menambahkan ${product.name} ke keranjang!`;
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: targetQty } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    return { success, message };
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is set to 0 or less
      removeFromCart(productId);
      return { success: true, message: "Item dihapus dari keranjang." };
    }

    let success = true;
    let message = "";

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (!existingItem) {
        success = false;
        message = "Item tidak ditemukan di keranjang.";
        return prevCart;
      }

      if (quantity > existingItem.stock) {
        success = false;
        message = `Jumlah melebihi stok yang tersedia (${existingItem.stock}).`;
        return prevCart;
      }

      message = "Jumlah pesanan diperbarui.";
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });

    return { success, message };
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
