"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, SupabaseClient } from "@supabase/supabase-js";

function tryCreateClient(): SupabaseClient | null {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => tryCreateClient(), []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) throw error;
  }, [supabase]);

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, [supabase]);

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
  };
}
