import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_COOKIE_NAME = "jwt";
const EXPORT_TIMEOUT_MS = 45_000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value?.trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { eventId } = await params;
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
    response = await fetch(
      `${apiBase.replace(/\/$/, "")}/events/${encodeURIComponent(eventId)}/export`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(EXPORT_TIMEOUT_MS),
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to export participants" },
      { status: 504 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to export participants" },
      { status: response.status },
    );
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition":
        response.headers.get("content-disposition") ??
        `attachment; filename="participants-${eventId}.xlsx"`,
    },
  });
}
