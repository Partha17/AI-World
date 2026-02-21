"use client";

import Image from "next/image";
import { Heart, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    currency?: string;
    thumbnail_url: string;
    category: string;
    materials?: Record<string, unknown>;
    description?: string;
  };
  onViewDetails?: (id: string) => void;
  onFindSimilar?: (id: string) => void;
}

export function ProductCard({
  product,
  onViewDetails,
  onFindSimilar,
}: ProductCardProps) {
  const primaryMaterial =
    (product.materials?.primary as string) || "";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 w-[220px] shrink-0">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.thumbnail_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="220px"
        />
        <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white">
          <Heart className="h-4 w-4 text-accent" />
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs font-medium text-primary/70 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {product.name}
        </h3>
        {primaryMaterial && (
          <p className="text-xs text-muted-foreground">{primaryMaterial}</p>
        )}
        <p className="text-base font-bold text-primary">
          {formatPrice(product.price, product.currency || "INR")}
        </p>
        <div className="flex gap-1.5 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-7"
            onClick={() => onViewDetails?.(product.id)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Details
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-7 px-2"
            onClick={() => onFindSimilar?.(product.id)}
          >
            <Sparkles className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="w-[220px] shrink-0 rounded-xl border border-border/50 bg-white overflow-hidden">
      <div className="aspect-square bg-muted shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-16 rounded bg-muted shimmer" />
        <div className="h-4 w-full rounded bg-muted shimmer" />
        <div className="h-4 w-2/3 rounded bg-muted shimmer" />
        <div className="h-5 w-20 rounded bg-muted shimmer" />
      </div>
    </div>
  );
}
