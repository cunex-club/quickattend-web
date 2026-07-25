// `new URL(...)` alone accepts any scheme, including `javascript:` and
// `data:` — both are valid URLs that must never be stored as (or opened
// from) a user-supplied link like an event's evaluation form, since that
// link is opened via `window.open` for every attendee of the event.
export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Parses a Content-Disposition header's filename, preferring the RFC 5987
// extended form (`filename*=UTF-8''...`) that backends use for non-ASCII
// names — e.g. Thai event names — over the plain `filename="..."` form.
// A naive `/filename="?([^"]+)"?/` regex matches the `*` form too (the `="`
// is optional) and returns the raw `*=UTF-8''%E0%B8%81...` string instead.
export function parseContentDispositionFilename(
  header: string | null,
): string | null {
  if (!header) return null;

  const extended = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (extended) {
    try {
      return decodeURIComponent(extended[1]);
    } catch {
      // fall through to the plain form
    }
  }

  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : null;
}
