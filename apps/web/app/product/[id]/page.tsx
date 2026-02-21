import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Shield, Star, Heart, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const AGENT_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${AGENT_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const primaryMaterial = product.materials?.primary || "";
  const gemType = product.gemstones?.type || "";

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-white/80 backdrop-blur-sm px-6 py-3">
        <Link
          href="/chat"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to chat
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary/70 uppercase tracking-wide mb-1">
                {product.category}
                {product.subcategory && ` / ${product.subcategory}`}
              </p>
              <h1 className="text-3xl font-bold font-serif text-foreground mb-3">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {primaryMaterial && (
                <SpecBadge label="Material" value={primaryMaterial} />
              )}
              {gemType && <SpecBadge label="Gemstone" value={gemType} />}
              {product.karat && (
                <SpecBadge label="Karat" value={`${product.karat}K`} />
              )}
              {product.weight_grams && (
                <SpecBadge label="Weight" value={`${product.weight_grams}g`} />
              )}
            </div>

            {/* Gemstone details */}
            {product.gemstones && (
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Gemstone Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.gemstones).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>{" "}
                      <span className="text-foreground font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller */}
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {product.seller_name}
                  </p>
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
                    <span className="text-xs text-muted-foreground">
                      {product.seller_rating}/5
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {product.style_tags?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Style
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.style_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.occasion_tags?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Perfect for
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.occasion_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/5 border border-primary/10 px-2.5 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link
                href={`/chat?q=Tell me more about ${encodeURIComponent(product.name)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white h-12 text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Ask JewelAI About This
              </Link>
              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors">
                <Heart className="h-5 w-5 text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 border border-border/50 p-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
