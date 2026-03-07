import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { BuildingDetail } from "@/types";
import { KioskShell } from "@/components/kiosk/kiosk-shell";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await apiGet<BuildingDetail>(`/buildings/${slug}`);
    return {
      title: `${data.building.name} — JewelAI Kiosk`,
      description:
        data.building.branding.welcome_message ||
        `Discover jewelry at ${data.building.name}`,
    };
  } catch {
    return { title: "JewelAI Kiosk" };
  }
}

export default async function KioskLayout({ params, children }: Props) {
  const { slug } = await params;

  let detail: BuildingDetail;
  try {
    detail = await apiGet<BuildingDetail>(`/buildings/${slug}`);
  } catch {
    notFound();
  }

  return (
    <KioskShell building={detail.building} vendors={detail.vendors}>
      {children}
    </KioskShell>
  );
}
