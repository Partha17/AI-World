"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { ProductDetail, SimilarProduct } from "@/types";

export function ProductView({
  product,
  similar,
  buildingSlug,
}: {
  product: ProductDetail;
  similar: SimilarProduct[];
  buildingSlug: string;
}) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images?.length > 0 ? product.images : [product.thumbnail_url];

  const materials = product.materials as Record<string, string> | undefined;
  const gemstones = product.gemstones as Record<string, unknown> | undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to results
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((i) => (i > 0 ? i - 1 : images.length - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((i) => (i < images.length - 1 ? i + 1 : 0))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? "border-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="mb-1">
            <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {product.category}
              {product.subcategory ? ` · ${product.subcategory}` : ""}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground mb-2">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-foreground mb-4">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {materials?.primary && (
              <SpecItem label="Material" value={materials.primary} />
            )}
            {product.karat && (
              <SpecItem label="Karat" value={`${product.karat}K`} />
            )}
            {product.weight_grams && (
              <SpecItem label="Weight" value={`${product.weight_grams}g`} />
            )}
            {gemstones?.type ? (
              <SpecItem
                label="Gemstone"
                value={`${String(gemstones.type)}${gemstones.carat ? ` (${String(gemstones.carat)} ct)` : ""}`}
              />
            ) : null}
            {gemstones?.clarity ? (
              <SpecItem label="Clarity" value={String(gemstones.clarity)} />
            ) : null}
            {gemstones?.certification ? (
              <SpecItem
                label="Certification"
                value={String(gemstones.certification)}
              />
            ) : null}
          </div>

          {/* Tags */}
          {(product.style_tags?.length > 0 ||
            product.occasion_tags?.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {product.style_tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {product.occasion_tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Vendor card */}
          <div className="rounded-xl border border-border p-4 bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Available at
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">
                    {product.seller_name || "Vendor"}
                  </span>
                  {product.seller_verified && (
                    <ShieldCheck className="h-4 w-4 text-success" />
                  )}
                  {product.seller_rating && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {product.seller_rating}/5
                    </span>
                  )}
                </div>
                {product.shop_name && (
                  <p className="text-xs text-muted-foreground">
                    {product.shop_name}
                  </p>
                )}
                {product.floor_number && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.floor_number}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold font-serif text-foreground mb-4">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {similar.map((p) => (
              <Link
                key={p.id}
                href={`/${buildingSlug}/product/${p.id}`}
                className="group rounded-xl border border-border bg-white overflow-hidden hover:border-primary/20 hover:shadow-md transition-all"
              >
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={p.thumbnail_url}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {p.name}
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {formatPrice(p.price, p.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
