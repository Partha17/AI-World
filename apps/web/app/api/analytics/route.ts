import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const endpoint = body.type === "click" ? "/analytics/click" : "/analytics/search";

  // Fire and forget — don't block the response
  fetch(`${AGENT_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});

  return NextResponse.json({ status: "ok" });
}
