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
  login: (email: string, password: string, role?: 'student' | 'teacher' | 'school' | 'admin') => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, role: 'student' | 'teacher' | 'school') => boolean;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<STEMProduct[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
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

  const login = (email: string, password: string, role: 'student' | 'teacher' | 'school' | 'admin' = 'student'): boolean => {
    // Admin credentials lock
    if (role === 'admin') {
      if (email.toLowerCase() === 'sedhupathivishnu321@gmail.com' && password === 'JRLearners2026!') {
        const newUser: UserProfile = {
          name: "SEDHU ADMIN",
          email,
          role: 'admin',
          institution: "JR Learners Platform",
          enrolledCourseIds: [],
          purchasedProductIds: [],
          certificates: []
        };
        setUser(newUser);
        showNotification("Welcome back, Admin!");
        return true;
      } else {
        showNotification("Access Denied: Invalid Admin email or password.");
        return false;
      }
    }

    // Standard user login check (validate from localStorage user records)
    try {
      const savedUsersStr = localStorage.getItem('el_registered_users');
      const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      const matchedUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
      
      if (matchedUser) {
        const newUser: UserProfile = {
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          institution: matchedUser.institution || "STEM Innovation Lab",
          enrolledCourseIds: matchedUser.enrolledCourseIds || ["course-1"],
          purchasedProductIds: matchedUser.purchasedProductIds || [],
          certificates: matchedUser.certificates || []
        };
        setUser(newUser);
        showNotification(`Welcome back, ${newUser.name}!`);
        return true;
      } else {
        showNotification("Login Failed: Incorrect email, password, or role.");
        return false;
      }
    } catch (e) {
      console.error(e);
      showNotification("Error during authentication.");
      return false;
    }
  };

  const registerUser = (name: string, email: string, password: string, role: 'student' | 'teacher' | 'school'): boolean => {
    try {
      const savedUsersStr = localStorage.getItem('el_registered_users');
      const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      
      // Check if email already exists
      if (registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        showNotification("Registration Failed: Email already registered.");
        return false;
      }

      const newUserRecord = {
        name,
        email,
        password,
        role,
        institution: "STEM Innovation Lab",
        enrolledCourseIds: ["course-1"],
        purchasedProductIds: [],
        certificates: []
      };

      registeredUsers.push(newUserRecord);
      localStorage.setItem('el_registered_users', JSON.stringify(registeredUsers));
      
      // Auto login
      const newUserProfile: UserProfile = {
        name,
        email,
        role,
        institution: "STEM Innovation Lab",
        enrolledCourseIds: ["course-1"],
        purchasedProductIds: [],
        certificates: []
      };
      setUser(newUserProfile);
      showNotification(`Registered and Logged in as ${name}!`);
      return true;
    } catch (e) {
      console.error(e);
      showNotification("Error during registration.");
      return false;
    }
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
        registerUser,
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
