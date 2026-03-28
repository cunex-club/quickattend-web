export const JWT_COOKIE_NAME = "jwt";

export const AUTH_USER_URL = process.env.BACKEND_PROXY_URL
  ? `${process.env.BACKEND_PROXY_URL}/api/auth/user`
  : process.env.NEXT_PUBLIC_API_HOST
    ? `${process.env.NEXT_PUBLIC_API_HOST}/auth/user`
    : null;
