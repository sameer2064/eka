"use client";

import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="border-b border-zinc-800 bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <Link
          href="/"
          className="text-5xl font-black"
        >
          EKA
        </Link>

        <div className="flex items-center gap-4">

          <Link
            href="/"
            className="hover:text-red-500 transition text-lg"
          >
            Home
          </Link>

          <Link
            href="/providers"
            className="hover:text-red-500 transition text-lg"
          >
            Providers
          </Link>

          <Link
            href="/jobs"
            className="hover:text-red-500 transition text-lg"
          >
            Jobs
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-red-500 transition text-lg"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/messages"
            className="hover:text-red-500 transition text-lg"
          >
            Messages
          </Link>

          <Link
            href="/admin"
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-2xl font-bold transition"
          >
            Admin
          </Link>

          <Link
            href="/login"
            className="bg-white text-black hover:bg-zinc-200 px-5 py-3 rounded-2xl font-bold transition"
          >
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}