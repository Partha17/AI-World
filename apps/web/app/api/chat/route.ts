import { NextRequest } from "next/server";

export const runtime = "edge";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const agentResponse = await fetch(`${AGENT_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: body.message,
      conversation_id: body.conversation_id || null,
      user_id: body.user_id || null,
    }),
  });

  if (!agentResponse.ok || !agentResponse.body) {
    return new Response(
      JSON.stringify({ error: "Agent service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(agentResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
