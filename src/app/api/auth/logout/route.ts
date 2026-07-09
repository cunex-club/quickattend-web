import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("jwt", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}
