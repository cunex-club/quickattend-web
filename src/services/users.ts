import type { APIResponse } from "@customTypes/events";

export interface UserByRefIdRes {
  ref_id: string;
  user_type: "student" | "staff";
  firstname_th: string | null;
  surname_th: string | null;
  title_th: string | null;
  faculty_name_th: string | null;
  firstname_en: string | null;
  surname_en: string | null;
  title_en: string | null;
  faculty_name_en: string | null;
}

export type UserByRefIdAPIResponse = APIResponse<UserByRefIdRes>;
