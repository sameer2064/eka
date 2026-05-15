"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful");
    }
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-md mx-auto py-24 px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-5xl font-bold mb-10">
            Login
          </h1>

          <div className="space-y-6">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-red-500 hover:bg-red-600 transition py-5 rounded-2xl text-2xl font-bold"
            >
              Login
            </button>

            <button
              onClick={handleSignup}
              className="w-full bg-zinc-800 hover:bg-zinc-700 transition py-5 rounded-2xl text-2xl font-bold"
            >
              Create Account
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}