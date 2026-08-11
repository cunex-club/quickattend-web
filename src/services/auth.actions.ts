"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_COOKIE_NAME = "jwt";

export async function hasActiveSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value?.trim() ?? "";

  return token.split(".").length === 3;
}

export async function logout(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });

  redirect("/login");
}
