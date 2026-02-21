"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Gem,
  Sparkles,
  Shield,
  MessageCircle,
  ArrowRight,
  Search,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      const params = new URLSearchParams({ q: query.trim() });
      router.push(`/chat?${params.toString()}`);
    } else {
      router.push("/chat");
    }
  }, [query, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <Gem className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold font-serif text-foreground">
            JewelAI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/chat")}
          >
            Start Shopping
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/signin")}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 max-w-7xl mx-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Jewelry Discovery
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-foreground leading-tight mb-6">
            Find Your Perfect Piece{" "}
            <span className="text-gradient">Through Conversation</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Skip the endless scrolling. Tell our AI jewelry consultant what
            you&apos;re looking for — occasion, style, budget — and discover
            curated pieces that match your taste.
          </p>

          {/* Hero Search */}
          <div className="relative max-w-xl mx-auto mb-6">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-xl shadow-primary/5">
              <Search className="h-5 w-5 text-muted-foreground ml-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Describe the jewelry you're looking for..."
                className="flex-1 bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                onClick={handleSearch}
                className="rounded-xl px-5"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask JewelAI
              </Button>
            </div>
          </div>

          {/* Example queries */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Engagement ring under ₹2L",
              "Gold jhumkas for wedding",
              "Minimalist daily wear",
              "Gift for anniversary",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuery(q);
                  const params = new URLSearchParams({ q });
                  router.push(`/chat?${params.toString()}`);
                }}
                className="rounded-full border border-border bg-white/80 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold font-serif text-foreground mb-3">
              Shopping, Reimagined
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              No more browsing hundreds of pages. Just have a conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Describe, Don't Browse"
              description="Tell JewelAI about the occasion, your style, and budget. It understands context — 'something elegant for my sister's engagement' is all you need."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI That Learns You"
              description="JewelAI remembers your preferences across conversations. It gets better at finding pieces you'll love over time."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Verified & Trusted"
              description="Every seller is verified. Gemstone certifications, hallmark details, and craftsmanship info — all transparent."
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
                Explore Collections
              </h2>
              <p className="text-muted-foreground text-sm">
                Or ask JewelAI to find something specific
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/chat")}
              className="text-primary"
            >
              Ask AI Instead <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Rings", emoji: "💍", query: "Show me rings" },
              {
                name: "Necklaces",
                emoji: "📿",
                query: "Show me necklaces",
              },
              {
                name: "Earrings",
                emoji: "✨",
                query: "Show me earrings",
              },
              {
                name: "Bracelets",
                emoji: "⌚",
                query: "Show me bracelets and bangles",
              },
              {
                name: "Bridal Sets",
                emoji: "👰",
                query: "Show me bridal jewelry sets",
              },
              {
                name: "Men's",
                emoji: "🤵",
                query: "Show me men's jewelry",
              },
              {
                name: "Under ₹10K",
                emoji: "🏷️",
                query: "Show me jewelry under 10000 rupees",
              },
              {
                name: "Investment",
                emoji: "📈",
                query: "Show me investment-grade jewelry",
              },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  const params = new URLSearchParams({ q: cat.query });
                  router.push(`/chat?${params.toString()}`);
                }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-white to-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-3">
            Why Trust JewelAI?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-12">
            We&apos;re building transparency into every interaction
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stat: "100%",
                label: "Verified Sellers",
                sub: "Every jeweler is vetted",
              },
              {
                stat: "BIS",
                label: "Hallmark Certified",
                sub: "Gold purity guaranteed",
              },
              {
                stat: "GIA/IGI",
                label: "Certified Diamonds",
                sub: "Third-party grading",
              },
              {
                stat: "24/7",
                label: "AI Assistance",
                sub: "Always here to help",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-white p-6"
              >
                <p className="text-2xl font-bold text-primary mb-1">
                  {item.stat}
                </p>
                <p className="text-sm font-medium text-foreground mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10 p-12">
            <Gem className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-serif text-foreground mb-4">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start a conversation with JewelAI and discover jewelry that
              matches your style, occasion, and budget.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/chat")}
              className="rounded-xl px-8"
            >
              Start Conversation
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-primary" />
            <span className="text-sm font-serif font-semibold text-foreground">
              JewelAI
            </span>
            <span className="text-xs text-muted-foreground">
              — Agentic Jewelry Commerce
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with AI. Curated with care.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-6 transition-all hover:border-primary/20 hover:shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
