import { APIRequestError, type APIErrorData } from "@services/events";
import type { APIResponse } from "@customTypes/events";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const TOKEN = process.env.NEXT_PUBLIC_LOG_IN_TOKEN;

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

export async function fetchUserByRefId(
  refId: string,
): Promise<UserByRefIdAPIResponse> {
  const res = await fetch(`${API_HOST}/users/${encodeURIComponent(refId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    let parsedError: APIErrorData | null = null;

    try {
      const body = (await res.json()) as APIResponse<null>;
      parsedError = body.error;
    } catch {
      parsedError = null;
    }

    if (parsedError) {
      throw new APIRequestError(
        parsedError.message,
        parsedError.code,
        parsedError.status,
      );
    }

    throw new APIRequestError(
      `Failed to fetch user ${refId}: ${res.status}`,
      "FETCH_USER_FAILED",
      res.status,
    );
  }

  return res.json();
}
