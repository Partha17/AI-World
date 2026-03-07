"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/search/product-grid";
import { useBuilding } from "@/components/search/building-shell";
import type { ProductCard } from "@/types";
import { use } from "react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; name: string }>;
}) {
  const { slug, name } = use(params);
  const category = decodeURIComponent(name);
  const router = useRouter();
  const { building } = useBuilding();

  const [products, setProducts] = useState<ProductCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = useCallback(
    async (sort: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/browse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_id: building.id,
            category,
            sort_by: sort,
            limit: 40,
          }),
        });
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [building.id, category]
  );

  useEffect(() => {
    fetchProducts(sortBy);
  }, [fetchProducts, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${slug}`)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-serif text-foreground">
            {category}
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${total} products`}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                `/${slug}/search?q=${encodeURIComponent(category)}`
              )
            }
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-white overflow-hidden"
            >
              <div className="aspect-square bg-muted shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded shimmer w-3/4" />
                <div className="h-4 bg-muted rounded shimmer w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={products} buildingSlug={slug} />
      )}
    </div>
  );
}
