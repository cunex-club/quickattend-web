"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_COOKIE_NAME = "jwt";

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
