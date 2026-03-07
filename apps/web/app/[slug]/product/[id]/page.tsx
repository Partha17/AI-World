import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { BuildingDetail, ProductDetail, SimilarProduct } from "@/types";
import { ProductView } from "@/components/search/product-view";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug, id } = await params;

  let detail: BuildingDetail;
  try {
    detail = await apiGet<BuildingDetail>(`/buildings/${slug}`);
  } catch {
    notFound();
  }

  let product: ProductDetail;
  try {
    product = await apiGet<ProductDetail>(
      `/products/${id}?building_id=${detail.building.id}`
    );
  } catch {
    notFound();
  }

  let similar: SimilarProduct[] = [];
  try {
    const data = await apiGet<{ products: SimilarProduct[] }>(
      `/products/${id}/similar?count=6`
    );
    similar = data.products;
  } catch {
    // non-critical
  }

  return (
    <ProductView
      product={product}
      similar={similar}
      buildingSlug={slug}
    />
  );
}
