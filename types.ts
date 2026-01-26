
export type Language = 'en' | 'id' | 'zh-TW' | 'zh-CN' | 'es' | 'fr' | 'ar' | 'pt' | 'ru' | 'hi' | 'bn' | 'ur' | 'ja' | 'ko';

export interface AccessibilitySettings {
  highContrast: boolean;
  dyslexicFont: boolean;
  autoRead: boolean;
  fontSize: 'standard' | 'large' | 'extra-large';
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type DonorType = 'individual' | 'organization';

export interface User {
  name: string;
  username: string;
  email?: string;
  pendingEmail?: string;
  emailVerified: boolean;
  phone?: string;
  isLoggedIn: boolean;
  accessibility?: AccessibilitySettings;
  paymentMethods?: PaymentMethod[];
  verificationStatus?: VerificationStatus;
  idDocument?: string; // base64 or url
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
}

export interface Tier {
  id: string;
  amount: number;
  title: string;
  description: string;
  isPremium?: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  niche: string;
  totalRaised: number;
  currency: string;
  activeGoal?: Goal;
  tiers: Tier[];
  feed?: FeedItem[];
  stats?: {
    supporters: number;
    views: number;
  };
  isAccessible?: boolean;
  verificationStatus?: VerificationStatus;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'e-wallet';
  provider: string;
  accountNumber: string;
  accountName: string;
  label: string;
}

export interface Donation {
  id: string;
  creatorId: string;
  donorName: string;
  donorType: DonorType;
  amount: number;
  currency: string;
  message: string;
  timestamp: Date;
}

export type AppView = 'home' | 'creator-profile' | 'dashboard' | 'donate' | 'login' | 'fund-platform';
