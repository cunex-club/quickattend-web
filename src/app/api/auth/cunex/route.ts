import { NextRequest, NextResponse } from "next/server";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const locale =
    request.nextUrl.searchParams.get("locale") === "th" ? "th" : "en";
  const backendBase = process.env.BACKEND_PROXY_URL;

  if (!token || !backendBase) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  let response: Response;
  try {
    response = await fetch(`${backendBase.replace(/\/$/, "")}/api/auth/cunex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(40_000),
    });
  } catch {
    // Backend unreachable or the CU NEX round trip timed out.
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=cunex`, request.url),
    );
  }

  const sessionToken = response.headers
    .getSetCookie()
    .map((cookie) => cookie.match(/^jwt=([^;]+)/)?.[1])
    .find(Boolean);
  if (!response.ok || !sessionToken) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?error=cunex`, request.url),
    );
  }

  const redirect = NextResponse.redirect(
    new URL(`/${locale}/events`, request.url),
  );
  redirect.cookies.set("jwt", sessionToken, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return redirect;
}
