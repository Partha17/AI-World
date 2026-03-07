"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { trackClick } from "@/lib/analytics";
import { useBuilding } from "@/components/search/building-shell";
import type { ProductCard } from "@/types";

export function ProductGrid({
  products,
  buildingSlug,
}: {
  products: ProductCard[];
  buildingSlug: string;
}) {
  const { building } = useBuilding();

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try a different search or browse categories
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCardItem
          key={product.id}
          product={product}
          buildingSlug={buildingSlug}
          buildingId={building.id}
        />
      ))}
    </div>
  );
}

function ProductCardItem({
  product,
  buildingSlug,
  buildingId,
}: {
  product: ProductCard;
  buildingSlug: string;
  buildingId: string;
}) {
  const primaryMaterial = product.materials?.primary as string | undefined;

  return (
    <Link
      href={`/${buildingSlug}/product/${product.id}`}
      onClick={() => trackClick(buildingId, product.id)}
      className="group rounded-xl border border-border bg-white overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Image
          src={product.thumbnail_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2">
          <span className="inline-block rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-base font-bold text-foreground mb-2">
          {formatPrice(product.price, product.currency)}
        </p>

        {primaryMaterial && (
          <p className="text-[11px] text-muted-foreground mb-2 truncate">
            {primaryMaterial}
            {product.gemstones?.type
              ? ` · ${String(product.gemstones.type)}`
              : ""}
          </p>
        )}

        {/* Vendor badge */}
        {product.seller_name && (
          <div className="flex items-start gap-1.5 pt-2 border-t border-border">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-foreground truncate">
                  {product.seller_name}
                </span>
                {product.seller_verified && (
                  <ShieldCheck className="h-3 w-3 text-success shrink-0" />
                )}
              </div>
              {product.floor_number && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  {product.floor_number}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
