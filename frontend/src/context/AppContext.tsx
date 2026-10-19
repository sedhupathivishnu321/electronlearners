import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, STEMProduct } from '../data/productsData';
import { api, ApiError, clearToken, getToken, paymentsConfigured, setToken } from '../utils/api';

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

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Orders come from the server (the database); this is the shape the pages use.
export interface Order {
  id: string;                                   // order reference (PayU transaction id)
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  customerEmail: string;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    zip: string;
    gstin?: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'placed';
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'student' | 'teacher' | 'school';
  institution?: string;
}

const FULFILMENT_TO_STATUS: Record<string, Order['status']> = { Ordered: 'Placed', Packed: 'Processing', Shipped: 'Shipped', Delivered: 'Delivered' };
const STATUS_TO_FULFILMENT: Record<Order['status'], string> = { Placed: 'Ordered', Processing: 'Packed', Shipped: 'Shipped', Delivered: 'Delivered' };

export function mapServerOrder(o: any): Order {
  const method = o.method === 'payu' ? `PayU${o.payment_mode ? ` (${o.payment_mode})` : ''}` : 'Cash on Delivery';
  return {
    id: o.txnid,
    items: (o.items || []).map((i: any) => ({ productId: i.id, productName: i.name, price: i.price, quantity: i.quantity })),
    subtotal: o.subtotal, tax: o.tax || 0, shipping: o.shipping, discount: o.discount, total: o.amount,
    customerEmail: o.customer?.email || o.user_email || '',
    shippingAddress: o.customer,
    paymentMethod: method,
    paymentStatus: o.status,
    status: FULFILMENT_TO_STATUS[o.fulfilment] || 'Placed',
    createdAt: o.created_at,
  };
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
  authReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  registerUser: (data: RegisterData) => Promise<{ ok: boolean; message?: string }>;
  refreshOrders: () => Promise<void>;
  enrollCourse: (courseId: string) => void;
  
  // Orders Pipeline
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Bulk RFQs Quote System
  rfqs: RFQ[];
  submitRFQ: (rfqData: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => void;
  updateRFQStatus: (rfqId: string, status: RFQ['status']) => void;
  convertRFQToOrder: (rfqId: string) => void;
  
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
  const [authReady, setAuthReady] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [notification, setNotification] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    try {
      // The catalogue changed to the 8-kit series: drop data saved by older versions (old product ids / prices)
      if (localStorage.getItem('el_catalog_version') !== '8kits-v2') {
        ['el_products', 'el_cart', 'el_wishlist', 'el_orders', 'el_rfqs'].forEach((k) => localStorage.removeItem(k));
        localStorage.setItem('el_catalog_version', '8kits-v2');
      }
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
              { name: "Level 1: Foundations Kit", quantity: 50 },
              { name: "Level 7: Wireless & Remote Control Kit", quantity: 25 }
            ],
            requiredDate: "2026-09-10",
            gstDetails: "29ABCDE1234F1Z5",
            requirements: "Require custom calibration lab instruction sheet for students.",
            status: "New",
            estimatedValue: 94050,
            createdAt: new Date().toISOString()
          }
        ];
        setRfqs(dummyRfqs);
        localStorage.setItem('el_rfqs', JSON.stringify(dummyRfqs));
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
  const setRfqsWithSync = (val: RFQ[]) => {
    setRfqs(val);
    localStorage.setItem('el_rfqs', JSON.stringify(val));
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

  // ---- Auth: accounts live in the server database; the browser only keeps a signed session token.
  const toProfile = (u: any, purchased: string[] = []): UserProfile => ({
    name: u.name,
    email: u.email,
    role: u.role,
    institution: u.institution || undefined,
    enrolledCourseIds: u.enrolledCourseIds || [],
    purchasedProductIds: purchased,
    certificates: u.certificates || [],
  });

  // restore the session on page load
  useEffect(() => {
    (async () => {
      if (paymentsConfigured && getToken()) {
        try {
          const data = await api('/auth/me');
          setUser(toProfile(data.user, data.purchasedProductIds));
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) clearToken();
        }
      }
      setAuthReady(true);
    })();
  }, []);

  const refreshOrders = async () => {
    if (!user) { setOrders([]); return; }
    try {
      const data = await api(user.role === 'admin' ? '/admin/orders' : '/orders');
      setOrders((data.orders || []).map(mapServerOrder));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => { void refreshOrders(); }, [user?.email, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    try {
      const data = await api('/auth/login', { body: { email, password }, auth: false });
      setToken(data.access_token);
      const me = await api('/auth/me');
      setUser(toProfile(me.user, me.purchasedProductIds));
      showNotification(`Welcome back, ${data.user.name}!`);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  };

  const registerUser = async (d: RegisterData): Promise<{ ok: boolean; message?: string }> => {
    try {
      const data = await api('/auth/register', { body: { name: d.name, email: d.email, phone: d.phone, password: d.password, role: d.role, institution: d.institution || null }, auth: false });
      setToken(data.access_token);
      setUser(toProfile(data.user, []));
      showNotification(`Welcome to JR Learners, ${data.user.name}!`);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setOrders([]);
    showNotification('Signed out successfully.');
  };

  const enrollCourse = (courseId: string) => {
    if (!user) {
      showNotification('Please sign in to enroll in courses.');
      return;
    }
    if (user.enrolledCourseIds.includes(courseId)) {
      showNotification('You are already enrolled in this course.');
      return;
    }
    const enrolled = [...user.enrolledCourseIds, courseId];
    setUser({ ...user, enrolledCourseIds: enrolled });
    api('/auth/profile', { method: 'PUT', body: { enrolled_courses: enrolled } }).catch((e) => console.error(e));
    showNotification('Enrolled successfully! Happy learning.');
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api(`/admin/orders/${encodeURIComponent(orderId)}/fulfilment`, { body: { value: STATUS_TO_FULFILMENT[status] } });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      showNotification(`Order ${orderId} updated to ${status}.`);
    } catch (e) {
      showNotification((e as Error).message);
    }
  };

  const submitRFQ = (rfqData: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => {
    const rfqId = `RFQ-${Math.floor(100 + Math.random() * 900)}`;
    const newRFQ: RFQ = {
      ...rfqData,
      id: rfqId,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setRfqsWithSync([newRFQ, ...rfqs]);
    api('/inquiries', {
      body: {
        kind: 'quote', name: rfqData.contactPerson, email: rfqData.email, phone: rfqData.phone, subject: `Bulk quote ${rfqId} - ${rfqData.institutionName}`,
        message: rfqData.requirements || 'Bulk quote request',
        extra: { quote_id: rfqId, institution: rfqData.institutionName, type: rfqData.institutionType, products: rfqData.products.map((x) => `${x.quantity} x ${x.name}`).join('; '), required_by: rfqData.requiredDate, gst: rfqData.gstDetails },
      },
      auth: !!getToken(),
    }).catch((e) => console.error(e));
    showNotification(`Quote request sent! Reference: ${rfqId}. We will reply by e-mail.`);
  };

  const updateRFQStatus = (rfqId: string, status: RFQ['status']) => {
    setRfqsWithSync(rfqs.map(r => r.id === rfqId ? { ...r, status } : r));
    addAuditLog(user?.email || "admin", "UPDATE_RFQ_STATUS", `Updated RFQ ${rfqId} status to ${status}`);
    showNotification(`RFQ ${rfqId} status updated to ${status}.`);
  };

  const convertRFQToOrder = (rfqId: string) => {
    // Orders are created by customers through the checkout (server database); an approved quote is just marked here.
    setRfqsWithSync(rfqs.map(r => r.id === rfqId ? { ...r, status: 'Converted to Order' } : r));
    addAuditLog(user?.email || "admin", "CONVERT_RFQ_TO_ORDER", `Marked RFQ ${rfqId} as converted`);
    showNotification(`RFQ ${rfqId} marked as converted. The customer places the order from the quote.`);
  };

  // Tickets
  const createTicket = (subject: string, orderId: string | undefined, priority: SupportTicket['priority'], messageText: string) => {
    if (!user) {
      showNotification('Please sign in to create a support ticket, or e-mail help.jrlearners@gmail.com.');
      return;
    }
    const newId = `SUP${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newId,
      customerName: user.name,
      email: user.email,
      subject,
      orderId,
      priority,
      status: 'Open',
      messages: [{ sender: 'customer', text: messageText, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };
    setTickets([newTicket, ...supportTickets]);
    api('/inquiries', {
      body: { kind: 'support', name: newTicket.customerName, email: user.email, subject: `[${newId}] ${subject}`, message: messageText, extra: { ticket: newId, priority, order: orderId || '-' } },
      auth: !!getToken(),
    }).catch((e) => console.error(e));
    showNotification(`Support Ticket ${newId} created and sent to our team.`);
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
        authReady,
        refreshOrders,
        logout,
        registerUser,
        enrollCourse,
        orders,
        updateOrderStatus,
        rfqs,
        submitRFQ,
        updateRFQStatus,
        convertRFQToOrder,
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
