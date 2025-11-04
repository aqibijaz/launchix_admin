// types/user.ts
export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  profileImage: string;
  isAdmin: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface Plan {
  _id: string;
  code: string;
  name: string;
  description: string;
  currency: string;
  amount: number;
  interval: string;
  intervalCount: number;
  maxBrands: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  user: string;
  plan: Plan;
  status: string;
  interval: string;
  intervalCount: number;
  coupon: string | null;
  trialEndsAt: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentProvider: string | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  user: string;
  subscription: Subscription;
  currency: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  sentAt: string | null;
  providerInvoiceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  owner: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  businessName: string;
  industry: string;
  tagline: string;
  brandStyle: string[];
  aiFlags: {
    businessName: boolean;
    industry: boolean;
    tagline: boolean;
    brandStyle: boolean;
    [key: string]: boolean;
  };
  subdomain: string | null;
  publishedUrl: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UserStats {
  brandCount: number;
  subscriptionCount: number;
  activeSubscriptions: number;
}

export interface UserDetail {
  user: User;
  stats: UserStats;
  subscriptions: Subscription[];
  recentInvoices: Invoice[];
  brands: Brand[];
}

export interface UsersListResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}