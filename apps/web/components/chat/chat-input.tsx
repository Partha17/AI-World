"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isLoading = false,
  placeholder = "Describe the jewelry you're looking for...",
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [input, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-white p-2 shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-xl focus-within:shadow-primary/10">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={onStop}
            className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
