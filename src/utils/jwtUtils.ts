import { jwtDecode } from "jwt-decode";

// 1. Define .NET Identity Claim Types
// These are the long URLs .NET Core puts in your token by default
const CLAIM_TYPES = {
  name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};

// 2. Define the expected payload interface
interface CustomJwtPayload {
  exp?: number;
  [CLAIM_TYPES.name]?: string;
  [CLAIM_TYPES.email]?: string;
  [CLAIM_TYPES.id]?: string;
  [CLAIM_TYPES.role]?: string | string[];
  // Allow other string keys
  [key: string]: any; 
}

// ------------------------------------------------------------------

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    // Use the library (safer than atob)
    const decoded = jwtDecode<CustomJwtPayload>(token);
    
    if (!decoded.exp) return false; // If no expiry, assume valid? Or invalid? Usually valid.
    
    // Check if current time is past expiry (exp is in seconds, Date.now is ms)
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true; // If decode fails, consider it expired
  }
}

export const decodeUser = (token: string) => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    
    // Return a clean object with friendly names
    return {
      id: decoded[CLAIM_TYPES.id],
      username: decoded[CLAIM_TYPES.name],
      email: decoded[CLAIM_TYPES.email],
    };
  } catch {
    return null;
  }
};

export const getUserRoles = (token: string): string[] => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);

    // .NET sometimes sends 'role' as a simple key, sometimes as the schema URL
    const roleClaim = decoded[CLAIM_TYPES.role] || decoded['role'];

    if (!roleClaim) return [];

    // If there is only one role, .NET sends a string. If multiple, an array.
    // We normalize this to always return an Array.
    return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
  } catch {
    return [];
  }
};

// Generic decoder if you need raw access
export function decodeToken(token: string): CustomJwtPayload | null {
  try {
    return jwtDecode<CustomJwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}