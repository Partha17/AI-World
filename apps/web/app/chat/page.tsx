"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Gem, RotateCcw, LogIn, User, LogOut } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useAuth } from "@/hooks/use-auth";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ProductCarousel } from "@/components/chat/product-carousel";
import { SuggestionChips } from "@/components/chat/suggestion-chips";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [initialQuerySent, setInitialQuerySent] = useState(false);
  const { user, signOut } = useAuth();

  const {
    messages,
    isLoading,
    sendMessage,
    stopStreaming,
    clearMessages,
  } = useChatStream({ userId: user?.id });

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQuerySent && messages.length === 0) {
      setInitialQuerySent(true);
      sendMessage(q);
    }
  }, [searchParams, initialQuerySent, messages.length, sendMessage]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && !m.isStreaming);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <Gem className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground font-serif">
              JewelAI
            </h1>
            <p className="text-[11px] text-muted-foreground leading-none">
              Your personal jewelry consultant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              New chat
            </Button>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/auth/signin")}
            >
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign in
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          <div className="py-4 space-y-1">
            {messages.map((message) => (
              <div key={message.id}>
                <MessageBubble message={message} />
                {message.role === "assistant" &&
                  message.productIds &&
                  message.productIds.length > 0 && (
                    <ProductCarousel
                      productIds={message.productIds}
                      onSendMessage={sendMessage}
                    />
                  )}
                {message.role === "assistant" &&
                  !message.isStreaming &&
                  message.suggestions && (
                    <SuggestionChips
                      suggestions={message.suggestions}
                      onSelect={sendMessage}
                    />
                  )}
              </div>
            ))}

            {!isLoading &&
              lastAssistantMessage &&
              !lastAssistantMessage.suggestions && (
                <SuggestionChips
                  suggestions={[
                    "Show me something different",
                    "What's trending?",
                    "Help me choose a gift",
                  ]}
                  onSelect={sendMessage}
                />
              )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-white/80 backdrop-blur-sm p-4">
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isLoading={isLoading}
        />
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          JewelAI may make mistakes. Verify important details with the seller.
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (msg: string) => void;
}) {
  const suggestions = [
    {
      text: "Show me engagement rings under ₹2 lakh",
      icon: "💍",
    },
    {
      text: "I need a gift for my wife's birthday",
      icon: "🎁",
    },
    {
      text: "Traditional jewelry for a South Indian wedding",
      icon: "✨",
    },
    {
      text: "Minimalist everyday earrings in gold",
      icon: "👂",
    },
    {
      text: "What are the best investment pieces?",
      icon: "📈",
    },
    {
      text: "Show me lab-grown diamond options",
      icon: "🌱",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 mb-6">
        <Gem className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground font-serif mb-2">
        Welcome to JewelAI
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
        Tell me what you&apos;re looking for and I&apos;ll find the perfect
        piece. I understand styles, occasions, budgets, and materials.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 text-left text-sm text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
          >
            <span className="text-lg">{s.icon}</span>
            <span className="leading-snug">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
