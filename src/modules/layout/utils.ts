import type { CurrentUser } from "@customTypes/auth";

export function formatFullName(
  user: CurrentUser | null,
  locale: string = "th",
): string {
  if (!user) {
    return "Guest";
  }

  const thName = [user.title_th, user.firstname_th, user.surname_th]
    .filter(Boolean)
    .join(" ");
  const enName = [user.title_en, user.firstname_en, user.surname_en]
    .filter(Boolean)
    .join(" ");

  return locale === "en"
    ? enName || thName || user.ref_id
    : thName || enName || user.ref_id;
}

export function getAvatarFallback(user: CurrentUser | null): string {
  if (!user) {
    return "GU";
  }

  const initials = [user.firstname_th, user.surname_th]
    .map((part) => part.trim().charAt(0))
    .filter(Boolean)
    .join("");

  return (initials || user.ref_id.slice(0, 2)).toUpperCase();
}
