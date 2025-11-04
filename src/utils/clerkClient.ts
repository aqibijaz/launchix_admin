import { Clerk } from "@clerk/clerk-js";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

// Create a singleton instance of Clerk
export const clerkClient = new Clerk(clerkPubKey);

// Wait until Clerk is fully loaded before using it
export async function loadClerk() {
  if (!clerkClient.loaded) {
    await clerkClient.load();
  }
  return clerkClient;
}
