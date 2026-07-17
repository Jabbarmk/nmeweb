import "server-only";

import { cookies } from "next/headers";
import type { User } from "./types";

/**
 * Session = two httpOnly cookies. The JWT never reaches client JS; every
 * authenticated API call happens in a server action / server component.
 * Token validity is 30 days (matches the API's JWT expiry).
 */

const TOKEN_COOKIE = "nme_token";
const USER_COOKIE = "nme_user";
const MAX_AGE = 30 * 24 * 60 * 60;

export async function setSession(token: string, user: User): Promise<void> {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: MAX_AGE,
    path: "/",
  };
  jar.set(TOKEN_COOKIE, token, opts);
  jar.set(
    USER_COOKIE,
    JSON.stringify({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userImage: user.userImage,
    }),
    opts,
  );
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  jar.delete(USER_COOKIE);
}

export async function getToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  userImage: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
