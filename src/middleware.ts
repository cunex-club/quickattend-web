import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { JWT_COOKIE_NAME } from "@constants/auth";
import { routing } from "@i18n/routing";

const intlMiddleware = createMiddleware(routing);
const LOCALES = new Set<string>(routing.locales);
const DEFAULT_LOCALE = routing.defaultLocale ?? "en";
const LOCALE_COOKIE_NAME =
  (typeof routing.localeCookie === "object" && routing.localeCookie
    ? routing.localeCookie.name
    : undefined) ?? "NEXT_LOCALE";

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

function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale && LOCALES.has(maybeLocale)) {
    return maybeLocale;
  }

  return null;
}

function getLocaleFromAcceptLanguage(headerValue: string | null) {
  if (!headerValue) {
    return null;
  }

  const candidates = headerValue
    .split(",")
    .map((entry) => {
      const [rawLocale, ...qualityParts] = entry.trim().split(";q=");
      const quality = qualityParts.length > 0 ? Number(qualityParts[0]) : 1;

      return {
        locale: rawLocale.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter(({ locale }) => locale);

  candidates.sort((left, right) => right.quality - left.quality);

  for (const candidate of candidates) {
    if (candidate.locale === "*") {
      continue;
    }

    if (LOCALES.has(candidate.locale)) {
      return candidate.locale;
    }

    const baseLocale = candidate.locale.split("-")[0];
    if (baseLocale && LOCALES.has(baseLocale)) {
      return baseLocale;
    }
  }

  return null;
}

function detectLocale(request: NextRequest, pathname: string) {
  const localizedPathLocale = getLocaleFromPathname(pathname);
  if (localizedPathLocale) {
    return localizedPathLocale;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value?.trim();
  if (cookieLocale && LOCALES.has(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguageLocale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );

  return acceptLanguageLocale ?? DEFAULT_LOCALE;
}

function buildLocalizedPath(locale: string, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(`${normalized}${padding}`);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function hasUsableToken(request: NextRequest) {
  const token = request.cookies.get(JWT_COOKIE_NAME)?.value?.trim();
  if (!token) {
    return false;
  }

  const segments = token.split(".");
  if (segments.length !== 3) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(segments[1])) as {
      exp?: number;
      nbf?: number;
    };

    if (typeof payload.exp !== "number") {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return false;
    }

    if (typeof payload.nbf === "number" && payload.nbf > now) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
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

export default async function middleware(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);
  const localizedPath = stripLocale(pathname);
  const locale = detectLocale(request, pathname);

  if (localizedPath === "/login") {
    if (hasUsableToken(request)) {
      return redirectToEvents(request, locale);
    }

    return intlMiddleware(request);
  }

  if (!hasUsableToken(request)) {
    return redirectToLogin(request, locale);
  }

  if (localizedPath === "/") {
    return redirectToEvents(request, locale);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
