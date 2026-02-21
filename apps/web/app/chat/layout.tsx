import { Suspense } from "react";
import { Gem } from "lucide-react";

function ChatLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white animate-pulse">
          <Gem className="h-6 w-6" />
        </div>
        <p className="text-sm text-muted-foreground">Loading JewelAI...</p>
      </div>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<ChatLoading />}>{children}</Suspense>;
}
