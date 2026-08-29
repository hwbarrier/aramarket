import { User, UserRole } from "./auth";

export type { User, UserRole };

export interface UserProfile extends User {
  phone?: string;
  address?: string;
}
