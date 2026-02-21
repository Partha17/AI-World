"use client";

import { cn } from "@/lib/utils";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function SuggestionChips({
  suggestions,
  onSelect,
  className,
}: SuggestionChipsProps) {
  if (!suggestions.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 px-4 py-2", className)}>
      {suggestions.map((suggestion, i) => (
        <button
          key={i}
          onClick={() => onSelect(suggestion)}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/40 hover:shadow-sm active:scale-95"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
