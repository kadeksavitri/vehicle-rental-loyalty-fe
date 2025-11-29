import type { CurrentUser } from '@/interfaces/profile.interface';
import { getLocalStorage, getAuthToken } from './auth';

/**
 * Retrieves the current user from localStorage.
 * @returns The current user object or null if not found.
 */
export function getCurrentUser(): CurrentUser | null {
  return getLocalStorage<CurrentUser>('user');
}

/** Checks if the user is authenticated. */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
}

/** Role helpers for the three roles used in the app. */
function normalizeRole(role: string | undefined | null): string {
  return (role || '').toString().trim().toLowerCase();
}

export function isSuperadmin(): boolean {
  const user = getCurrentUser();
  const role = normalizeRole(user?.roleName || user?.role);
  return role === 'superadmin' || role === 'super_admin' || role === 'super-admin';
}

export function isRentalVendor(): boolean {
  const user = getCurrentUser();
  const role = normalizeRole(user?.roleName || user?.role);
  return role === 'rental vendor' || role === 'rental_vendor' || role === 'rental-vendor' || role === 'vendor';
}

export function isCustomer(): boolean {
  const user = getCurrentUser();
  const role = normalizeRole(user?.roleName || user?.role);
  return role === 'customer' || role === 'customers';
}

/** Checks whether the current user can access a given profile. */
export function canAccessProfile(profileId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  if (isSuperadmin()) return true;
  return user.id === profileId;
}