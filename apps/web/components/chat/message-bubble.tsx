"use client";

import { cn } from "@/lib/utils";
import { Gem, User } from "lucide-react";
import type { ChatMessage } from "@/hooks/use-chat-stream";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3 px-4 py-3", {
        "flex-row-reverse": isUser,
      })}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary/10 text-primary"
            : "bg-gradient-to-br from-secondary/20 to-accent/20 text-primary-dark"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Gem className="h-4 w-4" />
        )}
      </div>
      <div
        className={cn("max-w-[80%] space-y-1", {
          "text-right": isUser,
        })}
      >
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-primary text-white"
              : "rounded-tl-md bg-white text-foreground shadow-sm border border-border/50"
          )}
        >
          {message.content ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.isStreaming ? (
            <TypingIndicator />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
