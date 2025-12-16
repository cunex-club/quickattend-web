"use server";

import type { UserRole } from "@context/RoleContext";

export async function getUserRole(): Promise<UserRole> {
  return "owner"; // Mock value for now
}
