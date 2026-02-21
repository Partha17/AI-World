import { NextRequest } from "next/server";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${AGENT_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: body.message,
      conversation_id: body.conversation_id || null,
      user_id: body.user_id || null,
    }),
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Agent service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        // Stream interrupted
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
