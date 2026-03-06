"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { SessionTimeoutModal } from "@/components/kiosk/session-timeout-modal";

export interface KioskPreferences {
  occasion?: string;
  style?: string;
  budgetRange?: string;
  material?: string;
}

interface KioskSessionContextValue {
  preferences: KioskPreferences;
  setPreferences: (prefs: KioskPreferences) => void;
  resetSession: () => void;
}

const KioskSessionContext = createContext<KioskSessionContextValue | null>(null);

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const WARNING_DURATION_S = 30;

export function KioskSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [preferences, setPreferencesState] = useState<KioskPreferences>({});

  const isAttractScreen = pathname === "/";

  const resetSession = useCallback(() => {
    setPreferencesState({});
    router.push("/");
  }, [router]);

  const setPreferences = useCallback((prefs: KioskPreferences) => {
    setPreferencesState(prefs);
  }, []);

  const { showWarning, countdown, dismissWarning } = useInactivityTimer({
    idleTimeout: IDLE_TIMEOUT_MS,
    warningDuration: WARNING_DURATION_S,
    onIdle: resetSession,
    enabled: !isAttractScreen,
  });

  const value = useMemo(
    () => ({ preferences, setPreferences, resetSession }),
    [preferences, setPreferences, resetSession]
  );

  return (
    <KioskSessionContext.Provider value={value}>
      {children}
      <SessionTimeoutModal
        show={showWarning}
        countdown={countdown}
        onDismiss={dismissWarning}
      />
    </KioskSessionContext.Provider>
  );
}

export function useKioskSession() {
  const ctx = useContext(KioskSessionContext);
  if (!ctx) throw new Error("useKioskSession must be used within KioskSessionProvider");
  return ctx;
}
