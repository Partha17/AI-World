"use client";

import { useState, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  productIds?: string[];
  suggestions?: string[];
  isStreaming?: boolean;
}

interface UseChatStreamOptions {
  conversationId?: string;
  userId?: string;
  onConversationCreated?: (id: string) => void;
}

export function useChatStream(options: UseChatStreamOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(
    options.conversationId
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
      };

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            conversation_id: conversationId,
            user_id: options.userId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to connect to agent");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let collectedProducts: string[] = [];
        let collectedSuggestions: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              const eventType = line.slice(6).trim();
              continue;
            }

            if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);

                if (data.content !== undefined) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: last.content + data.content,
                      };
                    }
                    return updated;
                  });
                }

                if (data.conversation_id) {
                  setConversationId(data.conversation_id);
                  options.onConversationCreated?.(data.conversation_id);
                }

                if (data.product_ids) {
                  collectedProducts = [
                    ...collectedProducts,
                    ...data.product_ids,
                  ];
                }

                if (data.suggestions) {
                  collectedSuggestions = data.suggestions;
                }
              } catch {
                // Incomplete JSON chunk, will be completed in next iteration
              }
            }
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              isStreaming: false,
              productIds:
                collectedProducts.length > 0 ? collectedProducts : undefined,
              suggestions:
                collectedSuggestions.length > 0
                  ? collectedSuggestions
                  : undefined,
            };
          }
          return updated;
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content:
                "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
              isStreaming: false,
            };
          }
          return updated;
        });
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, isLoading, options]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
  }, []);

  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}
