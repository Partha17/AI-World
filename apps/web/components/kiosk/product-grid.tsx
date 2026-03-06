"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface ProductGridItem {
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

interface ProductGridProps {
  products: ProductGridItem[];
  onSelectProduct: (id: string) => void;
  isLoading?: boolean;
}

export function ProductGrid({ products, onSelectProduct, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-xl font-semibold font-serif text-foreground mb-2">
          No pieces found
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or ask our AI assistant for help finding what you need.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {products.map((product, i) => (
        <motion.button
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          onClick={() => onSelectProduct(product.id)}
          className="group text-left rounded-2xl bg-white border border-border/50 overflow-hidden shadow-sm active:shadow-md active:border-primary/20 transition-all"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-active:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {typeof product.materials?.primary === "string" && (
              <div className="absolute bottom-2 left-2 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-primary-dark">
                {product.materials.primary}
              </div>
            )}
          </div>
          <div className="p-3 space-y-1">
            <p className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
              {product.category}
              {product.subcategory && ` · ${product.subcategory}`}
            </p>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {product.name}
            </h3>
            <p className="text-base font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-white border border-border/50 overflow-hidden"
    >
      <div className="aspect-square bg-muted shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-16 rounded bg-muted shimmer" />
        <div className="h-3.5 w-full rounded bg-muted shimmer" />
        <div className="h-3.5 w-2/3 rounded bg-muted shimmer" />
        <div className="h-4 w-20 rounded bg-muted shimmer" />
      </div>
    </motion.div>
  );
}
