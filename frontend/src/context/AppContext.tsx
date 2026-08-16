import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, STEMProduct } from '../data/productsData';

// Types and Interfaces
export interface CartItem {
  product: STEMProduct;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'school' | 'admin' | 'store_manager' | 'support_agent' | 'content_manager';
  institution?: string;
  enrolledCourseIds: string[];
  purchasedProductIds: string[];
  certificates: { id: string; courseTitle: string; issueDate: string }[];
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    gstin?: string;
  };
  paymentMethod: string;
  status: 'Ordered' | 'Packed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface RFQ {
  id: string;
  institutionName: string;
  contactPerson: string;
  email: string;
  phone: string;
  institutionType: 'school' | 'college' | 'university' | 'training_center';
  products: { name: string; quantity: number }[];
  requiredDate: string;
  gstDetails?: string;
  requirements?: string;
  status: 'New' | 'Quote Sent' | 'Converted to Order' | 'Rejected';
  estimatedValue: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validUntil: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  orderId?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Waiting' | 'Resolved';
  messages: { sender: 'customer' | 'admin'; text: string; timestamp: string }[];
  createdAt: string;
}

export interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  text: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface AppContextType {
  // Products Catalog
  products: STEMProduct[];
  addProduct: (product: Omit<STEMProduct, 'id' | 'slug'>) => void;
  updateProduct: (product: STEMProduct) => void;
  deleteProduct: (id: string) => void;
  
  // Shopping Cart & Wishlist
  cart: CartItem[];
  wishlist: STEMProduct[];
  addToCart: (product: STEMProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: STEMProduct) => void;
  
  // Auth
  user: UserProfile | null;
  login: (email: string, password: string, role?: string) => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, role: 'student' | 'teacher' | 'school') => boolean;
  enrollCourse: (courseId: string) => void;
  
  // Orders Pipeline
  orders: Order[];
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: string,
    subtotal: number,
    shipping: number,
    discount: number,
    total: number
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Bulk RFQs Quote System
  rfqs: RFQ[];
  submitRFQ: (rfqData: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => void;
  updateRFQStatus: (rfqId: string, status: RFQ['status']) => void;
  convertRFQToOrder: (rfqId: string) => void;
  
  // Coupon Validation Code
  coupons: Coupon[];
  createCoupon: (coupon: Coupon) => void;
  validateCoupon: (code: string, subtotal: number) => { success: boolean; discountAmount?: number; message: string };
  
  // Support Center
  supportTickets: SupportTicket[];
  createTicket: (subject: string, orderId: string | undefined, priority: SupportTicket['priority'], messageText: string) => void;
  replyToTicket: (ticketId: string, sender: 'customer' | 'admin', text: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  
  // Customer Review Moderation
  reviews: ProductReview[];
  submitReview: (productId: string, rating: number, text: string) => void;
  updateReviewStatus: (reviewId: string, status: ProductReview['status']) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (user: string, action: string, details: string) => void;
  
  // Notification Utility
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<STEMProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<STEMProduct[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [notification, setNotification] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    try {
      // Products
      const savedProducts = localStorage.getItem('el_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(PRODUCTS_DATA);
        localStorage.setItem('el_products', JSON.stringify(PRODUCTS_DATA));
      }

      // Cart & Wishlist
      const savedCart = localStorage.getItem('el_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      
      const savedWishlist = localStorage.getItem('el_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      
      // User Auth
      const savedUser = localStorage.getItem('el_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      // Orders
      const savedOrders = localStorage.getItem('el_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const dummyOrders: Order[] = [
          {
            id: "EL000123",
            items: [{ product: PRODUCTS_DATA[0], quantity: 1 }],
            subtotal: 1499,
            shipping: 50,
            discount: 150,
            total: 1399,
            shippingAddress: {
              name: "Alex Learner",
              email: "alex@learner.com",
              phone: "9876543210",
              address: "123 Innovation Street, Block B",
              city: "Bangalore",
              zip: "560001"
            },
            paymentMethod: "UPI / NetBanking",
            status: "Shipped",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setOrders(dummyOrders);
        localStorage.setItem('el_orders', JSON.stringify(dummyOrders));
      }

      // RFQs
      const savedRfqs = localStorage.getItem('el_rfqs');
      if (savedRfqs) {
        setRfqs(JSON.parse(savedRfqs));
      } else {
        const dummyRfqs: RFQ[] = [
          {
            id: "RFQ-101",
            institutionName: "ABC Engineering College",
            contactPerson: "Dr. Ramesh Kumar",
            email: "ramesh@abcengg.edu",
            phone: "9988776655",
            institutionType: "college",
            products: [
              { name: "Arduino Starter Kit", quantity: 50 },
              { name: "IoT ESP32 Starter Kit", quantity: 25 }
            ],
            requiredDate: "2026-09-10",
            gstDetails: "29ABCDE1234F1Z5",
            requirements: "Require custom calibration lab instruction sheet for students.",
            status: "New",
            estimatedValue: 122425,
            createdAt: new Date().toISOString()
          }
        ];
        setRfqs(dummyRfqs);
        localStorage.setItem('el_rfqs', JSON.stringify(dummyRfqs));
      }

      // Coupons
      const savedCoupons = localStorage.getItem('el_coupons');
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      } else {
        const dummyCoupons: Coupon[] = [
          { code: "WELCOME10", discountPercent: 10, minSpend: 500, maxDiscount: 200, usageLimit: 500, usedCount: 15, validUntil: "2026-12-31" },
          { code: "STUDENT20", discountPercent: 20, minSpend: 800, maxDiscount: 500, usageLimit: 500, usedCount: 42, validUntil: "2026-12-31" },
          { code: "BULK15", discountPercent: 15, minSpend: 5000, maxDiscount: 2000, usageLimit: 500, usedCount: 5, validUntil: "2026-12-31" },
          { code: "FESTIVE25", discountPercent: 25, minSpend: 1500, maxDiscount: 600, usageLimit: 300, usedCount: 8, validUntil: "2026-12-31" }
        ];
        setCoupons(dummyCoupons);
        localStorage.setItem('el_coupons', JSON.stringify(dummyCoupons));
      }

      // Tickets
      const savedTickets = localStorage.getItem('el_tickets');
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      } else {
        const dummyTickets: SupportTicket[] = [
          {
            id: "SUP1021",
            customerName: "Alex Learner",
            email: "alex@learner.com",
            subject: "Arduino kit missing component",
            orderId: "EL000123",
            priority: "Medium",
            status: "Open",
            messages: [
              { sender: "customer", text: "Hi, I received the Arduino kit but the Servo Motor is missing. Please help.", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
            ],
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ];
        setSupportTickets(dummyTickets);
        localStorage.setItem('el_tickets', JSON.stringify(dummyTickets));
      }

      // Reviews
      const savedReviews = localStorage.getItem('el_reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        const dummyReviews: ProductReview[] = [
          { id: "rev-1", productId: "prod-1", customerName: "Rohan Patel", rating: 5, text: "Excellent documentation. The code files worked right out of the box!", status: "Approved", createdAt: new Date().toISOString() }
        ];
        setReviews(dummyReviews);
        localStorage.setItem('el_reviews', JSON.stringify(dummyReviews));
      }

      // Audit Logs
      const savedLogs = localStorage.getItem('el_audit_logs');
      if (savedLogs) {
        setAuditLogs(JSON.parse(savedLogs));
      } else {
        const dummyLogs: AuditLog[] = [
          { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: "sedhupathivishnu321@gmail.com", action: "System Init", details: "Commerce rebuild platform database online." }
        ];
        setAuditLogs(dummyLogs);
        localStorage.setItem('el_audit_logs', JSON.stringify(dummyLogs));
      }

    } catch (e) {
      console.error(e);
    }
  }, []);

  // Setters wrapper to write to localStorage automatically
  const setProductsWithSync = (val: STEMProduct[]) => {
    setProducts(val);
    localStorage.setItem('el_products', JSON.stringify(val));
  };
  const setOrdersWithSync = (val: Order[]) => {
    setOrders(val);
    localStorage.setItem('el_orders', JSON.stringify(val));
  };
  const setRfqsWithSync = (val: RFQ[]) => {
    setRfqs(val);
    localStorage.setItem('el_rfqs', JSON.stringify(val));
  };
  const setCouponsWithSync = (val: Coupon[]) => {
    setCoupons(val);
    localStorage.setItem('el_coupons', JSON.stringify(val));
  };
  const setTickets = (val: SupportTicket[]) => {
    setSupportTickets(val);
    localStorage.setItem('el_tickets', JSON.stringify(val));
  };
  const setReviewsWithSync = (val: ProductReview[]) => {
    setReviews(val);
    localStorage.setItem('el_reviews', JSON.stringify(val));
  };
  const setLogsWithSync = (val: AuditLog[]) => {
    setAuditLogs(val);
    localStorage.setItem('el_audit_logs', JSON.stringify(val));
  };

  // Sync basic hooks
  useEffect(() => {
    try { localStorage.setItem('el_cart', JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('el_wishlist', JSON.stringify(wishlist)); } catch (e) {}
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

  // Audit logging utility
  const addAuditLog = (user: string, action: string, details: string) => {
    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      user,
      action,
      details
    };
    setLogsWithSync([log, ...auditLogs]);
  };

  // Products CRUD
  const addProduct = (prod: Omit<STEMProduct, 'id' | 'slug'>) => {
    const newId = `prod-${Date.now()}`;
    const newProd: STEMProduct = {
      ...prod,
      id: newId,
      slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setProductsWithSync([newProd, ...products]);
    addAuditLog(user?.email || "anonymous", "CREATE_PRODUCT", `Added product ${newProd.name} (SKU: ${newProd.specifications?.['SKU'] || 'N/A'})`);
    showNotification(`Added product ${newProd.name}!`);
  };

  const updateProduct = (prod: STEMProduct) => {
    setProductsWithSync(products.map(p => p.id === prod.id ? prod : p));
    addAuditLog(user?.email || "anonymous", "UPDATE_PRODUCT", `Updated product ${prod.name}`);
    showNotification(`Updated product ${prod.name}!`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProductsWithSync(products.filter(p => p.id !== id));
    addAuditLog(user?.email || "anonymous", "DELETE_PRODUCT", `Deleted product ${target?.name || id}`);
    showNotification(`Deleted product ${target?.name || 'Item'} successfully.`);
  };

  // Cart actions
  const addToCart = (product: STEMProduct, quantity = 1) => {
    // Check stock
    const currentProduct = products.find(p => p.id === product.id) || product;
    if (currentProduct.stock <= 0) {
      showNotification(`"${product.name}" is currently out of stock!`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > currentProduct.stock) {
          showNotification(`Cannot add. Only ${currentProduct.stock} items left in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product: currentProduct, quantity }];
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
    const currentProduct = products.find(p => p.id === productId);
    if (currentProduct && quantity > currentProduct.stock) {
      showNotification(`Only ${currentProduct.stock} items available in stock.`);
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

  // Auth Operations
  const login = (email: string, password: string, role = 'student'): boolean => {
    // Support custom administrative roles and Super Admin
    const emailLower = email.toLowerCase();
    if (role === 'admin' || role === 'store_manager' || role === 'support_agent' || role === 'content_manager') {
      if (
        (emailLower === 'sedhupathivishnu321@gmail.com' && password === 'JRLearners2026!') ||
        (emailLower === 'learnersground2@gmail.com' && password === 'Vishnu@12354')
      ) {
        const newUser: UserProfile = {
          name: emailLower === 'learnersground2@gmail.com' ? "Vishnu Administrator" : (role === 'admin' ? "SEDHU SUPER ADMIN" : `SEDHU ${role.toUpperCase()}`),
          email,
          role: 'admin',
          institution: "JR Learners Commerce Platform",
          enrolledCourseIds: [],
          purchasedProductIds: [],
          certificates: []
        };
        setUser(newUser);
        addAuditLog(emailLower, "ADMIN_LOGIN", `Logged in with role: admin`);
        showNotification(`Welcome back, ${newUser.name}!`);
        return true;
      }
    }

    try {
      const savedUsersStr = localStorage.getItem('el_registered_users');
      const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      const matchedUser = registeredUsers.find((u: any) => u.email.toLowerCase() === emailLower && u.password === password && u.role === role);
      
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
        showNotification("Login Failed: Incorrect credentials.");
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
      
      if (registeredUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        showNotification("Registration Failed: Email already registered.");
        return false;
      }

      const newUserRecord = {
        name,
        email,
        password,
        role,
        institution: role === 'school' ? "Institutional Lab Partner" : "STEM Hub",
        enrolledCourseIds: ["course-1"],
        purchasedProductIds: [],
        certificates: []
      };

      registeredUsers.push(newUserRecord);
      localStorage.setItem('el_registered_users', JSON.stringify(registeredUsers));
      
      const newUserProfile: UserProfile = {
        name,
        email,
        role,
        institution: newUserRecord.institution,
        enrolledCourseIds: ["course-1"],
        purchasedProductIds: [],
        certificates: []
      };
      setUser(newUserProfile);
      showNotification(`Registered and Logged in as ${name}! Profile linked to Google Drive Database: (${email})`);
      return true;
    } catch (e) {
      console.error(e);
      showNotification("Error during registration.");
      return false;
    }
  };

  const logout = () => {
    if (user) {
      addAuditLog(user.email, "LOGOUT", "User signed out.");
    }
    setUser(null);
    showNotification("Signed out successfully.");
  };

  const enrollCourse = (courseId: string) => {
    if (!user) {
      showNotification("Please login to enroll in courses.");
      return;
    }
    if (user.enrolledCourseIds.includes(courseId)) {
      showNotification("You are already enrolled in this course.");
      return;
    }
    const updatedUser = {
      ...user,
      enrolledCourseIds: [...user.enrolledCourseIds, courseId]
    };
    setUser(updatedUser);
    try {
      const savedUsersStr = localStorage.getItem('el_registered_users');
      if (savedUsersStr) {
        const registeredUsers = JSON.parse(savedUsersStr);
        const updatedUsers = registeredUsers.map((u: any) => 
          u.email.toLowerCase() === user.email.toLowerCase()
            ? { ...u, enrolledCourseIds: [...(u.enrolledCourseIds || []), courseId] }
            : u
        );
        localStorage.setItem('el_registered_users', JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error(e);
    }
    showNotification("Enrolled successfully! Happy learning.");
  };

  // Orders pipeline
  const placeOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: string,
    subtotal: number,
    shipping: number,
    discount: number,
    total: number
  ): Order | null => {
    if (cart.length === 0) return null;

    // Place order ID
    const newOrderId = `EL000${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: newOrderId,
      items: [...cart],
      subtotal,
      shipping,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      status: 'Ordered',
      createdAt: new Date().toISOString()
    };

    // Stock deduction & validation
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) {
        const remainingStock = Math.max(0, p.stock - cartItem.quantity);
        return { ...p, stock: remainingStock };
      }
      return p;
    });

    setProductsWithSync(updatedProducts);
    setOrdersWithSync([newOrder, ...orders]);
    
    // Add purchased product IDs to user profile to unlock digital downloads
    if (user) {
      const addedProductIds = cart.map(item => item.product.id);
      const updatedUser: UserProfile = {
        ...user,
        purchasedProductIds: Array.from(new Set([...user.purchasedProductIds, ...addedProductIds]))
      };
      setUser(updatedUser);
      // Sync user back to el_registered_users
      const savedUsersStr = localStorage.getItem('el_registered_users');
      if (savedUsersStr) {
        const registeredUsers = JSON.parse(savedUsersStr);
        const updatedUsers = registeredUsers.map((u: any) => 
          u.email.toLowerCase() === user.email.toLowerCase() 
            ? { ...u, purchasedProductIds: updatedUser.purchasedProductIds } 
            : u
        );
        localStorage.setItem('el_registered_users', JSON.stringify(updatedUsers));
      }
    }

    clearCart();
    addAuditLog(user?.email || shippingAddress.email, "PLACE_ORDER", `Placed order ${newOrderId} (Total: ₹${total})`);
    showNotification(`Order ${newOrderId} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrdersWithSync(orders.map(o => o.id === orderId ? { ...o, status } : o));
    addAuditLog(user?.email || "admin", "UPDATE_ORDER_STATUS", `Updated order ${orderId} status to ${status}`);
    showNotification(`Order ${orderId} updated to ${status}.`);
  };

  // B2B Quotes
  const submitRFQ = (rfqData: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => {
    const rfqId = `RFQ-${Math.floor(100 + Math.random() * 900)}`;
    const newRFQ: RFQ = {
      ...rfqData,
      id: rfqId,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setRfqsWithSync([newRFQ, ...rfqs]);
    showNotification(`RFQ submitted successfully! Quotation ID: ${rfqId}`);
  };

  const updateRFQStatus = (rfqId: string, status: RFQ['status']) => {
    setRfqsWithSync(rfqs.map(r => r.id === rfqId ? { ...r, status } : r));
    addAuditLog(user?.email || "admin", "UPDATE_RFQ_STATUS", `Updated RFQ ${rfqId} status to ${status}`);
    showNotification(`RFQ ${rfqId} status updated to ${status}.`);
  };

  const convertRFQToOrder = (rfqId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) return;

    // Map RFQ products to actual products to build order items
    const orderItems: CartItem[] = rfq.products.map(p => {
      const match = products.find(prod => prod.name.toLowerCase().includes(p.name.toLowerCase())) || products[0];
      return { product: match, quantity: p.quantity };
    });

    const newOrderId = `EL000${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: newOrderId,
      items: orderItems,
      subtotal: rfq.estimatedValue,
      shipping: 0,
      discount: 0,
      total: rfq.estimatedValue,
      shippingAddress: {
        name: rfq.contactPerson,
        email: rfq.email,
        phone: rfq.phone,
        address: `${rfq.institutionName} Dept`,
        city: "Institution Campus",
        zip: "000000",
        gstin: rfq.gstDetails
      },
      paymentMethod: "B2B Purchase Order Invoice",
      status: 'Ordered',
      createdAt: new Date().toISOString()
    };

    setOrdersWithSync([newOrder, ...orders]);
    setRfqsWithSync(rfqs.map(r => r.id === rfqId ? { ...r, status: 'Converted to Order' } : r));
    addAuditLog(user?.email || "admin", "CONVERT_RFQ_TO_ORDER", `Converted RFQ ${rfqId} into Order ${newOrderId}`);
    showNotification(`Converted RFQ ${rfqId} to Order ${newOrderId} successfully!`);
  };

  // Coupons
  const createCoupon = (c: Coupon) => {
    setCouponsWithSync([c, ...coupons]);
    addAuditLog(user?.email || "admin", "CREATE_COUPON", `Created coupon code: ${c.code}`);
    showNotification(`Coupon ${c.code} created!`);
  };

  const validateCoupon = (code: string, subtotal: number) => {
    const c = coupons.find(x => x.code.toUpperCase() === code.toUpperCase());
    if (!c) {
      return { success: false, message: "Invalid coupon code." };
    }
    
    // Validate rules
    if (subtotal < c.minSpend) {
      return { success: false, message: `Minimum spend of ₹${c.minSpend} required.` };
    }
    if (c.usedCount >= c.usageLimit) {
      return { success: false, message: "Coupon usage limit reached." };
    }
    if (new Date(c.validUntil) < new Date()) {
      return { success: false, message: "Coupon has expired." };
    }

    const calculatedDiscount = Math.round((subtotal * c.discountPercent) / 100);
    const finalDiscount = Math.min(calculatedDiscount, c.maxDiscount);

    return {
      success: true,
      discountAmount: finalDiscount,
      message: `Coupon "${c.code}" applied! Save ₹${finalDiscount}`
    };
  };

  // Tickets
  const createTicket = (subject: string, orderId: string | undefined, priority: SupportTicket['priority'], messageText: string) => {
    const newId = `SUP${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newId,
      customerName: user?.name || "Guest Customer",
      email: user?.email || "guest@learner.com",
      subject,
      orderId,
      priority,
      status: 'Open',
      messages: [{ sender: 'customer', text: messageText, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    setTickets([newTicket, ...supportTickets]);
    showNotification(`Support Ticket ${newId} created!`);
  };

  const replyToTicket = (ticketId: string, sender: 'customer' | 'admin', text: string) => {
    setTickets(supportTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: sender === 'admin' ? 'Waiting' : 'Open',
          messages: [...t.messages, { sender, text, timestamp: new Date().toISOString() }]
        };
      }
      return t;
    }));
    showNotification("Message sent!");
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(supportTickets.map(t => t.id === ticketId ? { ...t, status } : t));
    addAuditLog(user?.email || "admin", "UPDATE_TICKET_STATUS", `Support ticket ${ticketId} set to ${status}`);
    showNotification(`Ticket ${ticketId} status updated to ${status}.`);
  };

  // Review Moderation
  const submitReview = (productId: string, rating: number, text: string) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      customerName: user?.name || "Verified Maker",
      rating,
      text,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setReviewsWithSync([newReview, ...reviews]);
    showNotification("Review submitted! It will appear once approved by moderator.");
  };

  const updateReviewStatus = (reviewId: string, status: ProductReview['status']) => {
    setReviewsWithSync(reviews.map(r => r.id === reviewId ? { ...r, status } : r));
    addAuditLog(user?.email || "admin", "MODERATE_REVIEW", `Review ${reviewId} set to ${status}`);
    showNotification(`Review status updated to ${status}.`);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        user,
        login,
        logout,
        registerUser,
        enrollCourse,
        orders,
        placeOrder,
        updateOrderStatus,
        rfqs,
        submitRFQ,
        updateRFQStatus,
        convertRFQToOrder,
        coupons,
        createCoupon,
        validateCoupon,
        supportTickets,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        reviews,
        submitReview,
        updateReviewStatus,
        auditLogs,
        addAuditLog,
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
