
// src/utils/jwtUtils.ts
import {jwtDecode} from 'jwt-decode';
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}
export const decodeUser = (token: string) => {
  try {
    const decoded:any=jwtDecode(token);
    // const user = {
    //   id: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    //   name: decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    // };
     const user = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    
    return user;
  } catch {
    return null;
  } 
    
};

 export const getUserRoles = (token: string): string[] => {
  const decoded: any = jwtDecode(token);

  const role =
    decoded.role ||
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return Array.isArray(role) ? role : [role];
};

// const userName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
// const userEmail = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
// const userId = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

export function decodeToken(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}