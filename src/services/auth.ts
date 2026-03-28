import "server-only";

import { cookies } from "next/headers";

import type { CurrentUser } from "@customTypes/auth";
import { AUTH_USER_URL, JWT_COOKIE_NAME } from "@constants/auth";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    if (!AUTH_USER_URL) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          "Backend API host is not configured; unable to fetch current user.",
        );
      }

      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE_NAME)?.value?.trim();

    if (!token) {
      return null;
    }

    const response = await fetch(AUTH_USER_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: CurrentUser | null;
    };

    if (!payload?.data) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}
