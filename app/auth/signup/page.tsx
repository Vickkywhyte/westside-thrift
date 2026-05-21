"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col gap-6 text-center py-4">
        <div className="w-14 h-14 bg-(--color-primary) rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl text-white">mail</span>
        </div>
        <div>
          <h2 className="font-headline text-2xl font-medium text-(--color-on-surface) mb-2">Check your inbox.</h2>
          <p className="font-body text-base text-(--color-on-surface-variant) leading-relaxed">
            We sent a confirmation link to <strong className="text-(--color-on-surface)">{email}</strong>. Click it to activate your account.
          </p>
        </div>
        <p className="font-technical text-[12px] text-(--color-on-surface-variant)/60">
          Didn&rsquo;t receive it? Check your spam folder or{" "}
          <button onClick={() => setConfirmed(false)} className="text-(--color-primary) underline underline-offset-4">try again</button>.
        </p>
        <Link href={redirect} className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant) hover:text-(--color-primary) transition-colors">
          Continue browsing →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-(--color-error-container) text-(--color-on-error-container) font-technical text-[12px] p-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-label text-xs tracking-widest uppercase text-(--color-on-surface-variant)">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
          placeholder="Your name"
        />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          className="border border-(--color-outline-variant) bg-white px-4 py-3 font-body text-base focus:outline-none focus:border-(--color-primary) transition-colors"
          placeholder="Min. 8 characters"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-(--color-primary) text-white py-4 font-label text-xs tracking-widest uppercase hover:bg-(--color-primary-container) transition-colors disabled:opacity-60 mt-2"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="font-body text-base text-(--color-on-surface-variant) text-center">
        Already have an account?{" "}
        <Link href={`/auth/login?redirect=${redirect}`} className="text-(--color-primary) underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-medium text-(--color-on-surface) mb-2">Join Westside.</h1>
          <p className="font-body text-base text-(--color-on-surface-variant)">Create your Westside account.</p>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
