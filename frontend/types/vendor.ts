export type VendorApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

export interface Vendor {
  id: string;
  name: string;
  slug?: string;
  shopName?: string;
  email?: string;
  phone?: string;
  location?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  productCount?: number;
  status?: 'active' | 'pending' | 'suspended';
  approvalStatus?: VendorApprovalStatus;
  rejectionReason?: string;
  approvedAt?: string;
  suspendedAt?: string;
  isVerified?: boolean;
  joinedAt?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
  };
}
