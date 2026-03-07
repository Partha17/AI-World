"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Store, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/search/product-grid";
import type {
  Building,
  BuildingVendor,
  CategoryCount,
  ProductCard,
} from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  Rings: "💍",
  Necklaces: "📿",
  Earrings: "✨",
  Bracelets: "⌚",
  Bangles: "🪬",
  "Bridal Sets": "👰",
  Anklets: "🦶",
  "Nose Pins": "💎",
  "Head Jewelry": "👑",
  Accessories: "🎩",
};

export function BuildingHome({
  building,
  vendors,
  categories,
  featuredProducts,
}: {
  building: Building;
  vendors: BuildingVendor[];
  categories: CategoryCount[];
  featuredProducts: ProductCard[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const primaryColor = building.branding.primary_color || "#B8860B";

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(
        `/${building.slug}/search?q=${encodeURIComponent(query.trim())}`
      );
    }
  }, [query, building.slug, router]);

  return (
    <div>
      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="absolute top-32 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Jewelry Search
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight mb-4">
            {building.branding.welcome_message ||
              `Discover Jewelry at ${building.name}`}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Search across {vendors.length} vendors in natural language. Find the
            perfect piece by describing what you&apos;re looking for.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-5">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-xl shadow-primary/5">
              <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Try: gold jhumka under 30k, diamond engagement ring, bridal set..."
                className="flex-1 bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                onClick={handleSearch}
                className="rounded-xl px-5 shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick queries */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Gold jhumkas for wedding",
              "Diamond ring under 1 lakh",
              "Daily wear earrings",
              "Bridal necklace set",
              "Men's gold chain",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuery(q);
                  router.push(
                    `/${building.slug}/search?q=${encodeURIComponent(q)}`
                  );
                }}
                className="rounded-full border border-border bg-white/80 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="px-4 sm:px-6 py-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() =>
                    router.push(
                      `/${building.slug}/category/${encodeURIComponent(cat.category)}`
                    )
                  }
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {CATEGORY_ICONS[cat.category] || "💎"}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {cat.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cat.count} items
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif text-foreground">
                Latest Arrivals
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(`/${building.slug}/search?q=`)
                }
                className="text-primary"
              >
                View All
              </Button>
            </div>
            <ProductGrid
              products={featuredProducts}
              buildingSlug={building.slug}
            />
          </div>
        </section>
      )}

      {/* Vendors */}
      <section className="px-4 sm:px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold font-serif text-foreground mb-6">
            Our Vendors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => (
              <button
                key={v.seller_id}
                onClick={() =>
                  router.push(
                    `/${building.slug}/search?q=&seller=${v.seller_id}`
                  )
                }
                className="flex items-start gap-4 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Store className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {v.brand_name}
                    </span>
                    {v.verified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0" />
                    )}
                  </div>
                  {v.shop_name && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.shop_name}
                    </p>
                  )}
                  {v.floor_number && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {v.floor_number}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
