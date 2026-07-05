import type { CurrentUser } from "@customTypes/auth";

export function formatFullName(user: CurrentUser | null): string {
  if (!user) {
    return "Guest";
  }

  return (
    [user.title_th, user.firstname_th, user.surname_th]
      .filter(Boolean)
      .join(" ") ||
    [user.title_en, user.firstname_en, user.surname_en]
      .filter(Boolean)
      .join(" ") ||
    user.ref_id
  );
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
