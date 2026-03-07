"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BuildingVendor } from "@/types";

interface Filters {
  category: string;
  min_price: string;
  max_price: string;
  seller_id: string;
  sort_by: string;
}

const CATEGORIES = [
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Bangles",
  "Bridal Sets",
  "Anklets",
  "Nose Pins",
  "Head Jewelry",
  "Accessories",
];

const PRICE_RANGES = [
  { label: "Under ₹10K", min: "", max: "10000" },
  { label: "₹10K - ₹50K", min: "10000", max: "50000" },
  { label: "₹50K - ₹1L", min: "50000", max: "100000" },
  { label: "₹1L - ₹5L", min: "100000", max: "500000" },
  { label: "Above ₹5L", min: "500000", max: "" },
];

export function FilterPanel({
  filters,
  vendors,
  onChange,
}: {
  filters: Filters;
  vendors: BuildingVendor[];
  onChange: (filters: Filters) => void;
}) {
  const hasActiveFilters =
    filters.category ||
    filters.min_price ||
    filters.max_price ||
    filters.seller_id;

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() =>
            onChange({
              category: "",
              min_price: "",
              max_price: "",
              seller_id: "",
              sort_by: filters.sort_by,
            })
          }
        >
          Clear all filters
        </Button>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                onChange({
                  ...filters,
                  category: filters.category === cat ? "" : cat,
                })
              }
              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                filters.category === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              filters.min_price === range.min &&
              filters.max_price === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  onChange({
                    ...filters,
                    min_price: isActive ? "" : range.min,
                    max_price: isActive ? "" : range.max,
                  })
                }
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Custom range */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={(e) =>
              onChange({ ...filters, min_price: e.target.value })
            }
            className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <span className="text-xs text-muted-foreground">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={(e) =>
              onChange({ ...filters, max_price: e.target.value })
            }
            className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </FilterSection>

      {/* Vendors */}
      {vendors.length > 0 && (
        <FilterSection title="Vendor">
          <div className="space-y-1">
            {vendors.map((v) => (
              <button
                key={v.seller_id}
                onClick={() =>
                  onChange({
                    ...filters,
                    seller_id:
                      filters.seller_id === v.seller_id ? "" : v.seller_id,
                  })
                }
                className={`w-full flex items-center gap-1.5 text-left text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                  filters.seller_id === v.seller_id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="truncate">{v.brand_name}</span>
                {v.verified && (
                  <ShieldCheck className="h-3 w-3 text-success shrink-0" />
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
