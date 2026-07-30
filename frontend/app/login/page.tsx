"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display px-4">
      <div className="w-full max-w-md bg-white dark:bg-white/5 rounded-2xl p-10 shadow-xl border border-neutral/40 dark:border-neutral/20">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-12 text-primary">
            <svg fill="none" viewBox="0 0 48 48">
              <path
                fill="currentColor"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-3">Welcome Back</h2>
          <p className="text-text-subtle dark:text-gray-400 mt-1">Login to continue your learning</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="h-12 rounded-lg border border-neutral/40 dark:border-neutral/20 bg-background-light dark:bg-background-dark/30 px-4 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="h-12 rounded-lg border border-neutral/40 dark:border-neutral/20 bg-background-light dark:bg-background-dark/30 px-4 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="h-12 w-full bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition disabled:bg-neutral/60 dark:disabled:bg-neutral/40"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-text-subtle dark:text-gray-400">
            Don't have an account?
            <a href="/signup" className="text-primary font-medium hover:underline ml-1">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
