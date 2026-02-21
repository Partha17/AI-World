"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function SignInPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMagicLink = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithMagicLink(email.trim());
      setMagicLinkSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white mx-auto mb-4">
            <Gem className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-foreground mb-2">
            Welcome to JewelAI
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to save preferences and get personalized recommendations
          </p>
        </div>

        {magicLinkSent ? (
          <div className="rounded-xl border border-success/20 bg-success/5 p-6 text-center">
            <Mail className="h-8 w-8 text-success mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Check your email
            </h3>
            <p className="text-xs text-muted-foreground">
              We sent a magic link to <strong>{email}</strong>. Click it to
              sign in.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center gap-2 h-11"
              onClick={handleGoogle}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground">
                  or use email
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
              />
              <Button
                className="w-full"
                onClick={handleMagicLink}
                disabled={loading || !email.trim()}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          You can also shop as a guest.{" "}
          <button
            onClick={() => router.push("/chat")}
            className="text-primary hover:underline"
          >
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}
