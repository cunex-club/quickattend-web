import "server-only";

import { cookies } from "next/headers";

import type { CurrentUser } from "@customTypes/auth";

const AUTH_USER_URL = process.env.NEXT_PUBLIC_API_HOST
  ? `${process.env.NEXT_PUBLIC_API_HOST}/auth/user`
  : "/api/auth/user";
const JWT_COOKIE_NAME = "jwt";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
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
