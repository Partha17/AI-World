"use client";

import "./globals.css";
import { useEffect } from "react";
import { KioskSessionProvider } from "@/providers/kiosk-session-provider";
import { ChatPanel } from "@/components/kiosk/chat-panel";
import { Gem, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      document.removeEventListener("click", enterFullscreen);
    };
    document.addEventListener("click", enterFullscreen, { once: true });
    return () => document.removeEventListener("click", enterFullscreen);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-dvh w-dvw overflow-hidden">
        <KioskSessionProvider>
          <div className="relative h-full w-full">
            {/* Persistent kiosk chrome */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 opacity-60">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <Gem className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold font-serif text-foreground">
                JewelAI
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="absolute top-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/50 px-3 py-1.5 text-xs text-muted-foreground opacity-60 active:opacity-100 transition-opacity touch-target"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start Over
            </button>

            {children}
            <ChatPanel />
          </div>
        </KioskSessionProvider>
      </body>
    </html>
  );
}
