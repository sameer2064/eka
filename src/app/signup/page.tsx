"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSignup(
    e: any
  ) {
    e.preventDefault();

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);

      setLoading(false);

      return;
    }

    if (data.user) {

      await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name:
              fullName,
            role: "customer",
          },
        ]);

      alert(
        "Account created successfully"
      );

      window.location.href =
        "/login";
    }

    setLoading(false);
  }

  return (
    <main className="bg-black min-h-screen text-white">

      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-24">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-5xl font-bold mb-4">
            Create Account
          </h1>

          <p className="text-zinc-400 text-xl mb-10">
            Join Nepal’s trusted service marketplace
          </p>

          <form
            onSubmit={
              handleSignup
            }
            className="space-y-6"
          >

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 py-5 rounded-2xl text-2xl font-bold transition"
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}