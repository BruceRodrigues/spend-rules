import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current user session on the server
 * Use this in Server Components and Server Actions
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Get the current user ID on the server
 * Use this in Server Components and Server Actions
 */
export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in Server Components and Server Actions
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

/**
 * Require user ID - redirects to login if not authenticated
 * Use this in Server Components and Server Actions
 */
export async function requireUserId() {
  const user = await requireAuth();
  if (!user.id) {
    redirect("/login");
  }
  return user.id;
}
