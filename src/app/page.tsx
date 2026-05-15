"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProviderCard from "@/components/ProviderCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HomePage() {
  const [featuredProviders, setFeaturedProviders] =
    useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedProviders();
  }, []);

  async function fetchFeaturedProviders() {
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("approved", true)
      .eq("featured", true)
      .limit(3);

    if (error) {
      console.log(error);
    } else {
      setFeaturedProviders(data || []);
    }
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Navbar />

      <Hero />

      <Categories />

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex justify-between items-center mb-14">

          <div>

            <h2 className="text-6xl font-bold">
              Featured Providers
            </h2>

            <p className="text-zinc-400 text-xl mt-4">
              Trusted professionals recommended by EKA
            </p>

          </div>

          <Link
            href="/providers"
            className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-2xl text-xl font-bold transition"
          >
            View All
          </Link>

        </div>

        {featuredProviders.length === 0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-14 text-center">

            <h3 className="text-4xl font-bold">
              No Featured Providers Yet
            </h3>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {featuredProviders.map(
              (provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                />
              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}