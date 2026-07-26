import React, { createContext, useContext, useState, useEffect } from 'react';
import { STEMProduct } from '../data/productsData';

export interface CartItem {
  product: STEMProduct;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'school' | 'admin';
  institution?: string;
  enrolledCourseIds: string[];
  purchasedProductIds: string[];
  certificates: { id: string; courseTitle: string; issueDate: string }[];
}

interface AppContextType {
  cart: CartItem[];
  wishlist: STEMProduct[];
  user: UserProfile | null;
  addToCart: (product: STEMProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: STEMProduct) => void;
  login: (email: string, role?: 'student' | 'teacher' | 'school' | 'admin') => void;
  logout: () => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<STEMProduct[]>([]);
  const [user, setUser] = useState<UserProfile | null>({
    name: "Alex Learner",
    email: "alex@electronlearners.com",
    role: "student",
    institution: "Delhi Public School",
    enrolledCourseIds: ["course-1", "course-2"],
    purchasedProductIds: ["prod-1"],
    certificates: [
      { id: "EL-2026-8942", courseTitle: "Arduino C++ Programming & Hardware Interfacing", issueDate: "2026-04-12" }
    ]
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('el_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedWishlist = localStorage.getItem('el_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      
      const savedUser = localStorage.getItem('el_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('el_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('el_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('el_user', JSON.stringify(user));
      else localStorage.removeItem('el_user');
    } catch (e) {}
  }, [user]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: STEMProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added "${product.name}" to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification("Removed item from cart.");
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: STEMProduct) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showNotification(`Removed "${product.name}" from wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showNotification(`Saved "${product.name}" to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const login = (email: string, role: 'student' | 'teacher' | 'school' | 'admin' = 'student') => {
    const newUser: UserProfile = {
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      institution: "STEM Innovation Lab",
      enrolledCourseIds: ["course-1", "course-2"],
      purchasedProductIds: ["prod-1"],
      certificates: [
        { id: "EL-2026-8942", courseTitle: "Arduino C++ Programming & Hardware Interfacing", issueDate: "2026-04-12" }
      ]
    };
    setUser(newUser);
    showNotification(`Welcome back, ${newUser.name}! (${role.toUpperCase()})`);
  };

  const logout = () => {
    setUser(null);
    showNotification("Signed out successfully.");
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        user,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        login,
        logout,
        notification,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
