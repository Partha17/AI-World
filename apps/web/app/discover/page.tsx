"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { PreferenceCard } from "@/components/kiosk/preference-card";
import { useKioskSession } from "@/providers/kiosk-session-provider";

const STEPS = [
  {
    key: "occasion",
    title: "What's the occasion?",
    subtitle: "Select one that fits",
    options: [
      { value: "wedding", label: "Wedding", icon: "💒" },
      { value: "engagement", label: "Engagement", icon: "💍" },
      { value: "daily", label: "Daily Wear", icon: "☀️" },
      { value: "gifting", label: "Gifting", icon: "🎁" },
      { value: "festival", label: "Festival", icon: "🪔" },
      { value: "party", label: "Party", icon: "🥂" },
    ],
  },
  {
    key: "style",
    title: "What's your style?",
    subtitle: "Pick what resonates",
    options: [
      { value: "traditional", label: "Traditional", icon: "🏛️" },
      { value: "modern", label: "Modern", icon: "✨" },
      { value: "minimalist", label: "Minimalist", icon: "◻️" },
      { value: "statement", label: "Statement", icon: "💎" },
      { value: "fusion", label: "Fusion", icon: "🎨" },
      { value: "vintage", label: "Vintage", icon: "🕰️" },
    ],
  },
  {
    key: "budgetRange",
    title: "What's your budget?",
    subtitle: "A rough range is fine",
    options: [
      { value: "under-10k", label: "Under ₹10K", icon: "💰" },
      { value: "10k-25k", label: "₹10K – ₹25K", icon: "💰" },
      { value: "25k-50k", label: "₹25K – ₹50K", icon: "💰" },
      { value: "50k-1l", label: "₹50K – ₹1L", icon: "💎" },
      { value: "1l-plus", label: "₹1 Lakh+", icon: "👑" },
      { value: "any", label: "No Limit", icon: "🌟" },
    ],
  },
  {
    key: "material",
    title: "Preferred material?",
    subtitle: "Choose your favorite",
    options: [
      { value: "gold", label: "Gold", icon: "🥇" },
      { value: "silver", label: "Silver", icon: "🥈" },
      { value: "diamond", label: "Diamond", icon: "💎" },
      { value: "platinum", label: "Platinum", icon: "⚪" },
      { value: "pearl", label: "Pearl", icon: "🤍" },
      { value: "kundan", label: "Kundan", icon: "✨" },
    ],
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function DiscoverPage() {
  const router = useRouter();
  const { setPreferences } = useKioskSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const step = STEPS[currentStep];

  const handleSelect = (value: string) => {
    const key = step.key;
    setSelections((prev) => {
      if (prev[key] === value) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleFinish = () => {
    setPreferences({
      occasion: selections.occasion,
      style: selections.style,
      budgetRange: selections.budgetRange,
      material: selections.material,
    });

    const params = new URLSearchParams();
    if (selections.occasion) params.set("occasion", selections.occasion);
    if (selections.style) params.set("style", selections.style);
    if (selections.budgetRange) params.set("budget", selections.budgetRange);
    if (selections.material) params.set("material", selections.material);

    router.push(`/catalog?${params.toString()}`);
  };

  const handleSkip = () => {
    setPreferences({});
    router.push("/catalog");
  };

  const isLast = currentStep === STEPS.length - 1;
  const hasAnySelection = Object.keys(selections).length > 0;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-40 h-1 bg-border/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        />
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8 text-center">
              <p className="text-xs font-medium text-primary/60 uppercase tracking-widest mb-2">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-2">
                {step.title}
              </h2>
              <p className="text-muted-foreground">{step.subtitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {step.options.map((option) => (
                <PreferenceCard
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  selected={selections[step.key] === option.value}
                  onSelect={() => handleSelect(option.value)}
                  size="lg"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-6 pb-8 pt-4">
        <div>
          {currentStep > 0 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-muted-foreground active:bg-muted transition-colors touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="rounded-full px-6 py-3 text-sm font-medium text-muted-foreground active:text-foreground transition-colors touch-target"
            >
              Skip All
            </button>
          )}
        </div>

        <button
          onClick={goNext}
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 active:bg-primary-dark transition-colors touch-target"
        >
          {isLast ? (
            <>
              <Sparkles className="h-4 w-4" />
              {hasAnySelection ? "Show Me Jewelry" : "Browse All"}
            </>
          ) : (
            <>
              {selections[step.key] ? "Next" : "Skip"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
