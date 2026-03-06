"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Send, Square, Mic, MicOff, User } from "lucide-react";
import { useChatStream, type ChatMessage } from "@/hooks/use-chat-stream";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, stopStreaming, clearMessages } = useChatStream();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(true);
      if (detail?.prefill) {
        setPrefill(detail.prefill);
      }
    };
    window.addEventListener("kiosk:open-chat", handleOpen);
    return () => window.removeEventListener("kiosk:open-chat", handleOpen);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClose = () => {
    setIsOpen(false);
    setPrefill("");
  };

  const handleNewChat = () => {
    clearMessages();
    setPrefill("");
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && !m.isStreaming);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none lg:pointer-events-none"
          />

          {/* Panel - bottom sheet on mobile/tablet, right panel on large */}
          <motion.div
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-50 flex flex-col bg-white shadow-2xl overflow-hidden",
              "inset-x-0 bottom-0 h-[85dvh] rounded-t-3xl",
              "lg:inset-x-auto lg:bottom-auto lg:top-0 lg:right-0 lg:h-full lg:w-[420px] lg:rounded-none lg:rounded-l-3xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                  <Gem className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground font-serif">JewelAI</h2>
                  <p className="text-[10px] text-muted-foreground">Your jewelry consultant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={handleNewChat}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground active:bg-muted transition-colors"
                  >
                    New Chat
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl active:bg-muted transition-colors touch-target"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto kiosk-scrollbar">
              {messages.length === 0 ? (
                <ChatEmptyState onSuggestionClick={sendMessage} />
              ) : (
                <div className="py-4 space-y-1">
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  {!isLoading && lastAssistant?.suggestions && (
                    <div className="flex flex-wrap gap-2 px-4 py-2">
                      {lastAssistant.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-medium text-primary active:bg-primary/10 transition-colors touch-target"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <ChatPanelInput
              onSend={sendMessage}
              onStop={stopStreaming}
              isLoading={isLoading}
              prefill={prefill}
              onPrefillConsumed={() => setPrefill("")}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-4 py-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary/10 text-primary"
            : "bg-gradient-to-br from-secondary/20 to-accent/20 text-primary-dark"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Gem className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[80%]", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-primary text-white"
              : "rounded-tl-md bg-muted text-foreground"
          )}
        >
          {message.content ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.isStreaming ? (
            <div className="flex items-center gap-1 py-1 px-1">
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChatEmptyState({ onSuggestionClick }: { onSuggestionClick: (msg: string) => void }) {
  const suggestions = [
    { text: "Show me engagement rings", icon: "💍" },
    { text: "Gold necklaces for wedding", icon: "✨" },
    { text: "Something minimalist for daily wear", icon: "☀️" },
    { text: "Gift ideas under ₹25,000", icon: "🎁" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 mb-4">
        <Gem className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-lg font-bold font-serif text-foreground mb-1">Ask me anything</h3>
      <p className="text-xs text-muted-foreground text-center mb-6 max-w-xs">
        I can help you find the perfect piece, answer questions about materials, or suggest gifts.
      </p>
      <div className="w-full space-y-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 text-left text-sm text-foreground active:border-primary/30 active:bg-primary/5 transition-all touch-target"
          >
            <span className="text-lg">{s.icon}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatPanelInput({
  onSend,
  onStop,
  isLoading,
  prefill,
  onPrefillConsumed,
}: {
  onSend: (msg: string) => void;
  onStop: () => void;
  isLoading: boolean;
  prefill: string;
  onPrefillConsumed: () => void;
}) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      onPrefillConsumed();
    }
  }, [prefill, onPrefillConsumed]);

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  }, [input, isLoading, onSend]);

  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="border-t border-border/50 bg-white p-3">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2">
        <button
          onClick={toggleVoice}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors touch-target",
            isListening
              ? "bg-destructive/10 text-destructive"
              : "text-muted-foreground active:bg-muted"
          )}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about jewelry..."
          rows={1}
          className="flex-1 resize-none bg-transparent py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={isLoading}
        />

        {isLoading ? (
          <button
            onClick={onStop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground active:bg-muted transition-colors touch-target"
          >
            <Square className="h-4 w-4 fill-current" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-40 active:bg-primary-dark transition-colors touch-target"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
