"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <nav className="w-full border-b border-zinc-800 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-5xl font-bold">EKA</h1>
        </Link>

        <div className="flex items-center gap-8 text-xl">
          <Link href="/">Home</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/messages">Messages</Link>

          <Link
            href="/admin"
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-semibold"
          >
            Admin
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-200"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}