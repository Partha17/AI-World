import { apiGet } from "@/lib/api";
import type { BuildingDetail, CategoryCount, ProductCard } from "@/types";
import { BuildingHome } from "@/components/search/building-home";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BuildingHomePage({ params }: Props) {
  const { slug } = await params;

  const [detail, categoriesData, featuredData] = await Promise.all([
    apiGet<BuildingDetail>(`/buildings/${slug}`),
    apiGet<{ categories: CategoryCount[] }>(`/buildings/${slug}/categories`),
    apiGet<{ products: ProductCard[] }>(`/buildings/${slug}/featured?limit=8`),
  ]);

  return (
    <BuildingHome
      building={detail.building}
      vendors={detail.vendors}
      categories={categoriesData.categories}
      featuredProducts={featuredData.products}
    />
  );
}
