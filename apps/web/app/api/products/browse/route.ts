import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  try {
    const response = await fetch(
      `${AGENT_URL}/products/browse?${params.toString()}`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Agent service unavailable" },
      { status: 502 }
    );
  }
}
