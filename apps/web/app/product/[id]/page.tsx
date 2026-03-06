"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL || "";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  subcategory?: string;
  materials?: Record<string, string>;
  gemstones?: Record<string, string>;
  weight_grams?: number;
  karat?: number;
  images: string[];
  thumbnail_url: string;
  style_tags?: string[];
  occasion_tags?: string[];
  seller_name?: string;
  seller_verified?: boolean;
  seller_rating?: number;
}

interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  thumbnail_url: string;
  category: string;
  similarity: number;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [similar, setSimilar] = useState<SimilarProduct[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch {
        /* ignore */
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const allImages = product
    ? [product.thumbnail_url, ...(product.images || []).filter((img) => img !== product.thumbnail_url)]
    : [];

  const nextImage = () => setActiveImage((i) => (i + 1) % allImages.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + allImages.length) % allImages.length);

  const openChat = () => {
    window.dispatchEvent(
      new CustomEvent("kiosk:open-chat", {
        detail: { prefill: `Tell me more about ${product?.name}` },
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="text-lg text-muted-foreground">Product not found</p>
        <button
          onClick={() => router.back()}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white touch-target"
        >
          Go Back
        </button>
      </div>
    );
  }

  const primaryMaterial = product.materials?.primary || "";
  const gemType = product.gemstones?.type || "";

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto kiosk-scrollbar">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="absolute top-4 left-16 z-30 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/50 px-4 py-2 text-sm text-foreground active:bg-white transition-colors touch-target"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      <div className="flex flex-col lg:flex-row flex-1 pt-14">
        {/* Image gallery */}
        <div className="relative lg:w-1/2 flex-shrink-0">
          <div className="relative aspect-square lg:h-full overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={allImages[activeImage] || product.thumbnail_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg active:bg-white transition-colors touch-target"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg active:bg-white transition-colors touch-target"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === activeImage
                        ? "w-6 bg-white"
                        : "w-2.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="hidden lg:flex gap-2 p-3 overflow-x-auto kiosk-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === activeImage
                      ? "border-primary"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 px-6 py-6 lg:overflow-y-auto lg:py-8 lg:px-10 kiosk-scrollbar space-y-6"
        >
          <div>
            <p className="text-xs font-semibold text-primary/60 uppercase tracking-widest mb-1">
              {product.category}
              {product.subcategory && ` · ${product.subcategory}`}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold font-serif text-foreground mb-3">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Spec badges */}
          <div className="grid grid-cols-2 gap-3">
            {primaryMaterial && <SpecBadge label="Material" value={primaryMaterial} />}
            {gemType && <SpecBadge label="Gemstone" value={gemType} />}
            {product.karat && <SpecBadge label="Karat" value={`${product.karat}K`} />}
            {product.weight_grams && <SpecBadge label="Weight" value={`${product.weight_grams}g`} />}
          </div>

          {/* Gemstone details */}
          {product.gemstones && Object.keys(product.gemstones).length > 0 && (
            <div className="rounded-2xl border border-border p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Gemstone Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.gemstones).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>{" "}
                    <span className="text-foreground font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller */}
          {product.seller_name && (
            <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{product.seller_name}</p>
                  {product.seller_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {product.seller_rating && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-xs text-muted-foreground">{product.seller_rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.style_tags && product.style_tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Style</p>
              <div className="flex flex-wrap gap-1.5">
                {product.style_tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.occasion_tags && product.occasion_tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Perfect for</p>
              <div className="flex flex-wrap gap-1.5">
                {product.occasion_tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/5 border border-primary/10 px-3 py-1.5 text-xs text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ask AI CTA */}
          <button
            onClick={openChat}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 active:bg-primary-dark transition-colors touch-target"
          >
            <MessageCircle className="h-5 w-5" />
            Ask JewelAI About This Piece
          </button>

          <div className="h-6" />
        </motion.div>
      </div>
    </div>
  );
}

function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border/50 p-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
