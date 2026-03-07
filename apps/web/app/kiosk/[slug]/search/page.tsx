"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/kiosk/product-grid";
import { FilterPanel } from "@/components/kiosk/filter-panel";
import { useKiosk } from "@/components/kiosk/kiosk-shell";
import { trackSearch } from "@/lib/analytics";
import type { ProductCard, SearchResponse, ParsedQuery } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { building, vendors } = useKiosk();

  const initialQuery = searchParams.get("q") || "";
  const initialSeller = searchParams.get("seller") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [parsed, setParsed] = useState<ParsedQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    min_price: "",
    max_price: "",
    seller_id: initialSeller,
    sort_by: "relevance" as string,
  });

  const doSearch = useCallback(
    async (searchQuery: string, currentFilters: typeof filters) => {
      setLoading(true);
      try {
        const body: Record<string, unknown> = {
          building_id: building.id,
          query: searchQuery || "",
          limit: 40,
        };

        if (currentFilters.category)
          body.category = currentFilters.category;
        if (currentFilters.min_price)
          body.min_price = Number(currentFilters.min_price);
        if (currentFilters.max_price)
          body.max_price = Number(currentFilters.max_price);
        if (currentFilters.seller_id)
          body.seller_id = currentFilters.seller_id;
        if (
          currentFilters.sort_by &&
          currentFilters.sort_by !== "relevance"
        )
          body.sort_by = currentFilters.sort_by;

        const hasQuery = searchQuery.trim().length > 0;
        const endpoint = hasQuery ? "/api/search" : "/api/browse";

        if (!hasQuery) {
          delete body.query;
          const sortMap: Record<string, string> = {
            relevance: "newest",
            price_asc: "price_asc",
            price_desc: "price_desc",
            newest: "newest",
          };
          body.sort_by = sortMap[currentFilters.sort_by] || "newest";
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data: SearchResponse = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setParsed(data.parsed || null);
        if (searchQuery.trim()) {
          trackSearch(building.id, searchQuery, data.total || 0);
        }
      } catch (err) {
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [building.id]
  );

  useEffect(() => {
    doSearch(initialQuery, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filters.seller_id) params.set("seller", filters.seller_id);
    router.replace(
      `/kiosk/${building.slug}/search?${params.toString()}`
    );
    doSearch(query, filters);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    doSearch(query, newFilters);
  };

  const activeSeller = vendors.find(
    (v) => v.seller_id === filters.seller_id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back + Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/kiosk/${building.slug}`)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-white p-1.5">
          <Search className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search jewelry..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            onClick={handleSearch}
            size="sm"
            className="rounded-lg"
          >
            Search
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* AI-parsed info */}
      {parsed && (
        <div className="flex flex-wrap gap-2 mb-4">
          {parsed.category && (
            <Tag label={`Category: ${parsed.category}`} />
          )}
          {parsed.subcategory && (
            <Tag label={`Type: ${parsed.subcategory}`} />
          )}
          {parsed.min_price && (
            <Tag label={`Min: ₹${parsed.min_price.toLocaleString("en-IN")}`} />
          )}
          {parsed.max_price && (
            <Tag label={`Max: ₹${parsed.max_price.toLocaleString("en-IN")}`} />
          )}
          {parsed.occasion && <Tag label={parsed.occasion} />}
          {parsed.style && <Tag label={parsed.style} />}
        </div>
      )}

      {/* Active vendor filter */}
      {activeSeller && (
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-xs text-foreground">
            Showing products from{" "}
            <strong>{activeSeller.brand_name}</strong>
          </span>
          <button
            onClick={() =>
              handleFilterChange({ ...filters, seller_id: "" })
            }
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <div
          className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}
        >
          <FilterPanel
            filters={filters}
            vendors={vendors}
            onChange={handleFilterChange}
          />
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching..." : `${total} results`}
              {query && !loading && (
                <span>
                  {" "}
                  for &ldquo;{query}&rdquo;
                </span>
              )}
            </p>

            <select
              value={filters.sort_by}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  sort_by: e.target.value,
                })
              }
              className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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
            <ProductGrid
              products={products}
              buildingSlug={building.slug}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary/5 border border-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
      {label}
    </span>
  );
}
