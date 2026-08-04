import { NextRequest, NextResponse } from "next/server";

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

// The login page reads this to show a message that actually matches what
// happened — "your link expired, log in again" and "something's misconfigured,
// contact support" call for different user actions, and collapsing them into
// one generic failure made every CU NEX login error look identical and silent.
type CunexLoginError = "expired" | "config" | "unreachable";

function redirectToLoginWithError(
  request: NextRequest,
  locale: string,
  error: CunexLoginError,
) {
  return NextResponse.redirect(
    new URL(`/${locale}/login?error=${error}`, request.url),
  );
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const locale =
    request.nextUrl.searchParams.get("locale") === "th" ? "th" : "en";
  const backendApiBase = process.env.BACKEND_PROXY_URL
    ? `${process.env.BACKEND_PROXY_URL.replace(/\/$/, "")}/api`
    : (process.env.NEXT_PUBLIC_API_HOST ??
      new URL("/api", request.url).toString());

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  let response: Response;
  try {
    response = await fetch(`${backendApiBase.replace(/\/$/, "")}/auth/cunex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      signal: AbortSignal.timeout(40_000),
    });
  } catch {
    // Backend unreachable or the CU NEX round trip timed out.
    return redirectToLoginWithError(request, locale, "unreachable");
  }

  // Per the LLE API reference, 204 specifically means the token couldn't be
  // resolved (expired / invalid / issued to a different project) — a normal
  // "log in again" situation, distinct from a real backend/config problem.
  // The CU NEX API returns 204, while the current backend normalizes the same
  // invalid/expired-token case to 401.
  if (response.status === 204 || response.status === 401) {
    return redirectToLoginWithError(request, locale, "expired");
  }

  const sessionToken = response.headers
    .getSetCookie()
    .map((cookie) => cookie.match(/^jwt=([^;]+)/)?.[1])
    .find(Boolean);
  if (!response.ok || !sessionToken) {
    return redirectToLoginWithError(request, locale, "config");
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
