export type CurrentUser = {
  id: string;
  ref_id: string;
  user_type: "student" | "staff";
  firstname_th: string | null;
  surname_th: string | null;
  title_th: string | null;
  firstname_en: string | null;
  surname_en: string | null;
  title_en: string | null;
};
