/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthProvider } from "@refinedev/core";

// Check if user has required role
const hasRequiredRole = (user: any): boolean => {
  if (!user) return false;
  
  const role = user.publicMetadata?.role as string;
  const allowedRoles = ["admin", "sales", "support"];
  
  return typeof role === "string" && role.length > 0 && allowedRoles.includes(role.toLowerCase());
};

export const authProvider: AuthProvider = {
  login: async () => {
    return { success: true };
  },

  logout: async () => {
    const { Clerk } = window as any;
    if (Clerk) {
      await Clerk.signOut();
    }
    return { success: true, redirectTo: "/sign-in" };
  },

  check: async () => {
    const { Clerk } = window as any;
    
    if (!Clerk) {
      return { authenticated: false, redirectTo: "/sign-in" };
    }

    await Clerk.load();
    
    const isSignedIn = Clerk.user !== null && Clerk.user !== undefined;
    
    if (!isSignedIn) {
      return { authenticated: false, redirectTo: "/sign-in" };
    }

    // Check if user has required role
    if (!hasRequiredRole(Clerk.user)) {
      return { 
        authenticated: false, 
        redirectTo: "/unauthorized",
        error: {
          message: "Access denied. Only Admin and Sales Support roles are allowed.",
          name: "Unauthorized"
        }
      };
    }

    return { authenticated: true };
  },

  getIdentity: async () => {
    const { Clerk } = window as any;
    
    if (!Clerk) return null;

    await Clerk.load();
    const user = Clerk.user;
    
    if (!user) return null;

    return {
      id: user.id,
      name: user.fullName || user.firstName || "User",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatar: user.imageUrl,
    };
  },

  getPermissions: async () => {
    const { Clerk } = window as any;
    
    if (!Clerk) return null;

    await Clerk.load();
    const user = Clerk.user;
    
    const role = user?.publicMetadata?.role || "user";
    return role;
  },

  onError: async (error) => {
    console.error("Auth error:", error);
    
    if (error?.status === 401 || error?.status === 403) {
      return { logout: true, redirectTo: "/sign-in" };
    }
    
    return {};
  },
};