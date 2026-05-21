"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-(--color-error-container) text-(--color-on-error-container) font-technical text-[12px] p-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-(--color-primary) text-white py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="font-body text-base text-(--color-on-surface-variant) text-center">
        No account?{" "}
        <Link href={`/auth/signup?redirect=${redirect}`} className="text-(--color-primary) underline underline-offset-4">
          Create one
        </Link>
      </p>

      <div className="border-t border-(--color-outline-variant)/30 pt-4">
        <Link
          href={redirect}
          className="font-technical text-[12px] text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors text-center block"
        >
          Continue as guest →
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-2">Welcome back.</h1>
          <p className="font-body text-base text-(--color-on-surface-variant)">Sign in to your Westside account.</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
