"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, MessageCircle, ChevronDown } from "lucide-react";
import { ProductGrid } from "@/components/kiosk/product-grid";

const BUDGET_MAP: Record<string, { min?: number; max?: number }> = {
  "under-10k": { max: 10000 },
  "10k-25k": { min: 10000, max: 25000 },
  "25k-50k": { min: 25000, max: 50000 },
  "50k-1l": { min: 50000, max: 100000 },
  "1l-plus": { min: 100000 },
  any: {},
};

const CATEGORY_OPTIONS = [
  "Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Bangles", "Bridal Sets",
];

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  subcategory?: string | null;
  thumbnail_url: string;
  materials: Record<string, unknown>;
  style_tags?: string[];
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const occasion = searchParams.get("occasion") || undefined;
  const style = searchParams.get("style") || undefined;
  const budgetKey = searchParams.get("budget") || undefined;
  const material = searchParams.get("material") || undefined;
  const category = searchParams.get("category") || undefined;

  const budget = budgetKey ? BUDGET_MAP[budgetKey] : undefined;

  const activeFilters: { key: string; label: string; param: string }[] = [];
  if (occasion) activeFilters.push({ key: "occasion", label: occasion, param: "occasion" });
  if (style) activeFilters.push({ key: "style", label: style, param: "style" });
  if (budgetKey && budgetKey !== "any") activeFilters.push({ key: "budget", label: budgetKey.replace(/-/g, " "), param: "budget" });
  if (material) activeFilters.push({ key: "material", label: material, param: "material" });
  if (category) activeFilters.push({ key: "category", label: category, param: "category" });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (occasion) params.set("occasion", occasion);
      if (style) params.set("style", style);
      if (budget?.min) params.set("min_price", String(budget.min));
      if (budget?.max) params.set("max_price", String(budget.max));
      if (material) params.set("materials", material);
      if (category) params.set("category", category);
      params.set("limit", "24");

      const res = await fetch(`/api/products/browse?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [occasion, style, budget?.min, budget?.max, material, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const removeFilter = (param: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(param);
    router.push(`/catalog?${params.toString()}`);
  };

  const addCategoryFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    setShowCategoryFilter(false);
    router.push(`/catalog?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/catalog");
  };

  const openChat = () => {
    setShowChatPanel(true);
    window.dispatchEvent(new CustomEvent("kiosk:open-chat"));
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Filter bar */}
      <div className="flex-shrink-0 border-b border-border/50 bg-white/80 backdrop-blur-sm pt-16 pb-3 px-4">
        <div className="flex items-center gap-2 overflow-x-auto kiosk-scrollbar pb-1">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-foreground active:bg-muted transition-colors touch-target whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Category
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showCategoryFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 mt-2 z-20 rounded-2xl bg-white border border-border shadow-xl p-2 min-w-[160px]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => addCategoryFilter(cat)}
                      className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-foreground active:bg-primary/10 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active filter chips */}
          {activeFilters.map((f) => (
            <motion.button
              key={f.key}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => removeFilter(f.param)}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-medium text-primary whitespace-nowrap touch-target"
            >
              {f.label}
              <X className="h-3 w-3" />
            </motion.button>
          ))}

          {activeFilters.length > 1 && (
            <button
              onClick={clearAll}
              className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground active:text-foreground whitespace-nowrap touch-target"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto kiosk-scrollbar">
        <ProductGrid
          products={products}
          onSelectProduct={(id) => router.push(`/product/${id}`)}
          isLoading={isLoading}
        />

        {!isLoading && products.length > 0 && (
          <div ref={loadMoreRef} className="py-8 text-center">
            <p className="text-xs text-muted-foreground">
              Showing {products.length} pieces
            </p>
          </div>
        )}
      </div>

      {/* Floating AI chat button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 15 }}
        onClick={openChat}
        className="absolute bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-white shadow-2xl shadow-primary/30 active:shadow-lg transition-shadow touch-target"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold">Ask JewelAI</span>
      </motion.button>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
