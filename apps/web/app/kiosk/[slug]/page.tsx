import { apiGet } from "@/lib/api";
import type { BuildingDetail, CategoryCount, ProductCard } from "@/types";
import { KioskHome } from "@/components/kiosk/kiosk-home";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function KioskHomePage({ params }: Props) {
  const { slug } = await params;

  const [detail, categoriesData, featuredData] = await Promise.all([
    apiGet<BuildingDetail>(`/buildings/${slug}`),
    apiGet<{ categories: CategoryCount[] }>(`/buildings/${slug}/categories`),
    apiGet<{ products: ProductCard[] }>(`/buildings/${slug}/featured?limit=8`),
  ]);

  return (
    <KioskHome
      building={detail.building}
      vendors={detail.vendors}
      categories={categoriesData.categories}
      featuredProducts={featuredData.products}
    />
  );
}
