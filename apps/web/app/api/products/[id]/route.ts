import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${AGENT_URL}/products/${id}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 502 }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Agent service unavailable" },
      { status: 502 }
    );
  }
}
