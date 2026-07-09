// "use server";

// import { APIRequestError, type APIErrorData } from "@services/events";
// import { getAuthToken } from "@services/events.actions";
// import type { APIResponse } from "@customTypes/events";
// import type { UserByRefIdAPIResponse } from "@services/users";

// const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

// export async function fetchUserByRefId(
//   refId: string,
// ): Promise<UserByRefIdAPIResponse> {
//   const token = await getAuthToken();
//   const res = await fetch(`${API_HOST}/users/${encodeURIComponent(refId)}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     let parsedError: APIErrorData | null = null;

//     try {
//       const body = (await res.json()) as APIResponse<null>;
//       parsedError = body.error;
//     } catch {
//       parsedError = null;
//     }

//     if (parsedError) {
//       throw new APIRequestError(
//         parsedError.message,
//         parsedError.code,
//         parsedError.status,
//       );
//     }

//     throw new APIRequestError(
//       `Failed to fetch user ${refId}: ${res.status}`,
//       "FETCH_USER_FAILED",
//       res.status,
//     );
//   }

//   return res.json();
// }
