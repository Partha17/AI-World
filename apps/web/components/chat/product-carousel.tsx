"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  productIds: string[];
  onSendMessage?: (msg: string) => void;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  currency: string;
  thumbnail_url: string;
  category: string;
  materials?: Record<string, unknown>;
  description?: string;
}

export function ProductCarousel({
  productIds,
  onSendMessage,
}: ProductCarouselProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const fetched: ProductData[] = [];

      await Promise.all(
        productIds.slice(0, 8).map(async (id) => {
          try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
              const data = await res.json();
              fetched.push(data);
            }
          } catch {
            // Skip failed fetches
          }
        })
      );

      setProducts(fetched);
      setLoading(false);
    }

    if (productIds.length > 0) {
      fetchProducts();
    }
  }, [productIds]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleViewDetails = (id: string) => {
    onSendMessage?.(`Tell me more about product ${id}`);
  };

  const handleFindSimilar = (id: string) => {
    onSendMessage?.(`Show me similar products to ${id}`);
  };

  if (!productIds.length) return null;

  return (
    <div className="relative mx-4 my-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Showing {productIds.length} result{productIds.length !== 1 && "s"}
        </p>
        {products.length > 2 && (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {loading
          ? productIds
              .slice(0, 4)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => (
              <div key={product.id} style={{ scrollSnapAlign: "start" }}>
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                  onFindSimilar={handleFindSimilar}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
