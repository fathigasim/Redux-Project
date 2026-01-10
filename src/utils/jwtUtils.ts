// utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  role?: string | string[];
  sessionId?: string;
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Add 30 second buffer to refresh before actual expiry
    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat invalid tokens as expired
  }
}

/**
 * Extract user roles from JWT token
 * Handles both ASP.NET Core Identity claim format and simple 'role' claim
 */
export function getUserRoles(token: string): string[] {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check for ASP.NET Core Identity role claim format
    const aspNetRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    if (aspNetRoles) {
      // Role claim can be a string or array
      return Array.isArray(aspNetRoles) ? aspNetRoles : [aspNetRoles];
    }
    
    // Fallback to simple 'role' claim
    const simpleRoles = decoded.role;
    if (simpleRoles) {
      return Array.isArray(simpleRoles) ? simpleRoles : [simpleRoles];
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting roles from token:', error);
    return [];
  }
}

/**
 * Get session ID from token (for single session enforcement)
 */
export function getSessionId(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sessionId || null;
  } catch (error) {
    console.error('Error extracting session ID:', error);
    return null;
  }
}

/**
 * Check if token will expire soon (within 2 minutes)
 */
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    
    return timeUntilExpiry < 120; // Less than 2 minutes  prevents race conditioning
  } catch (error:any) {
    return true;
  }
}