export type APIError = {
  code: string;
  message: string;
  status: number;
};

export type APIResponse<T> = {
  data: T | null;
  error: APIError | null;
  meta: unknown;
};
