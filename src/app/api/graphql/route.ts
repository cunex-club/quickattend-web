import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_COOKIE_NAME = "jwt";

export async function POST(request: Request) {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value?.trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const apiBase = process.env.BACKEND_PROXY_URL
    ? `${process.env.BACKEND_PROXY_URL}/api`
    : process.env.NEXT_PUBLIC_API_HOST;
  if (!apiBase) {
    return NextResponse.json(
      { error: "Backend API is not configured" },
      { status: 500 },
    );
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase.replace(/\/$/, "")}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Backend API is unreachable" },
      { status: 502 },
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
