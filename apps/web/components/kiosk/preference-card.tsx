"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PreferenceCardProps {
  label: string;
  icon?: string;
  imageUrl?: string;
  selected: boolean;
  onSelect: () => void;
  size?: "md" | "lg";
}

export function PreferenceCard({
  label,
  icon,
  imageUrl,
  selected,
  onSelect,
  size = "md",
}: PreferenceCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all duration-200 overflow-hidden touch-target",
        size === "lg" ? "p-5 min-h-[100px]" : "p-4 min-h-[80px]",
        selected
          ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
          : "border-border/60 bg-white active:border-primary/40 active:bg-primary/5"
      )}
    >
      {imageUrl && (
        <div className="absolute inset-0 opacity-20">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <span
          className={cn(
            "text-sm font-semibold leading-tight text-center",
            selected ? "text-primary" : "text-foreground"
          )}
        >
          {label}
        </span>
      </div>
      {selected && (
        <motion.div
          layoutId="check"
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
