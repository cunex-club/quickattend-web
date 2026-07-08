import type { APIResponse } from "@customTypes/events";

export interface UserByRefIdRes {
  ref_id: string;
  firstname_th: string;
  surname_th: string;
  title_th: string;
  faculty_name_th: string;
  firstname_en: string;
  surname_en: string;
  title_en: string;
  faculty_name_en: string;
  profile_image_url: string;
}

export type UserByRefIdAPIResponse = APIResponse<UserByRefIdRes>;
