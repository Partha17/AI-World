"use client";

import { createContext, useContext } from "react";
import Link from "next/link";
import { Gem, MapPin } from "lucide-react";
import type { Building, BuildingVendor } from "@/types";

interface BuildingContextValue {
  building: Building;
  vendors: BuildingVendor[];
}

const BuildingContext = createContext<BuildingContextValue | null>(null);

export function useBuilding() {
  const ctx = useContext(BuildingContext);
  if (!ctx) throw new Error("useBuilding must be used within BuildingShell");
  return ctx;
}

export function BuildingShell({
  building,
  vendors,
  children,
}: {
  building: Building;
  vendors: BuildingVendor[];
  children: React.ReactNode;
}) {
  const primaryColor = building.branding.primary_color || "#B8860B";

  return (
    <BuildingContext.Provider value={{ building, vendors }}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
            <Link
              href={`/${building.slug}`}
              className="flex items-center gap-2.5"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Gem className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold font-serif text-foreground leading-tight">
                  {building.name}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {building.city}
                  {building.state ? `, ${building.state}` : ""}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">
                {vendors.length} Vendors
              </span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="font-medium" style={{ color: primaryColor }}>
                JewelAI
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4" style={{ color: primaryColor }} />
              <span className="text-sm font-serif font-semibold text-foreground">
                {building.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by JewelAI Search
            </p>
          </div>
        </footer>
      </div>
    </BuildingContext.Provider>
  );
}
