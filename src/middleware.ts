import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const LOCALES = new Set<string>(routing.locales);
const DEFAULT_LOCALE = routing.defaultLocale ?? "en";

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (!maybeLocale || !LOCALES.has(maybeLocale)) {
    return pathname;
  }

  const strippedPath = `/${segments.slice(2).join("/")}`;
  return strippedPath === "/" ? "/" : strippedPath || "/";
}

function getLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale && LOCALES.has(maybeLocale)) {
    return maybeLocale;
  }

  return DEFAULT_LOCALE;
}

function buildLocalizedPath(locale: string, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

function hasUsableToken(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value?.trim() ?? "";

  return token.split(".").length === 3;
}

function redirectToLogin(request: NextRequest, locale: string) {
  const url = request.nextUrl.clone();
  url.pathname = buildLocalizedPath(locale, "/login");
  url.search = "";

  return NextResponse.redirect(url);
}

function redirectToEvents(request: NextRequest, locale: string) {
  const url = request.nextUrl.clone();
  url.pathname = buildLocalizedPath(locale, "/events");
  url.search = "";

  return NextResponse.redirect(url);
}

export default function middleware(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);
  const localizedPath = stripLocale(pathname);
  const locale = getLocale(pathname);
  const hasToken = hasUsableToken(request);
  const incomingToken = request.nextUrl.searchParams.get("token")?.trim();

  // A freshly presented CU NEX token always wins, even if a session cookie is
  // still around: it may belong to a different person on a shared device.
  if (incomingToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/web-api/auth/cunex";
    url.search = "";
    url.searchParams.set("token", incomingToken);
    url.searchParams.set("locale", locale);
    return NextResponse.redirect(url);
  }

  if (localizedPath === "/") {
    return redirectToEvents(request, locale);
  }

  if (localizedPath === "/login") {
    if (hasToken) {
      return redirectToEvents(request, locale);
    }

    return intlMiddleware(request);
  }

  if (!hasToken) {
    return redirectToLogin(request, locale);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/web-api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|web-api|trpc|_next|_vercel|.*\\..*).*)",
};
