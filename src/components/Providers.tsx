"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Providers() {
  const [providers, setProviders] = useState<any[]>([]);

  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  useEffect(() => {
    fetchProviders();
  }, [search]);

  async function fetchProviders() {
    let query = supabase
      .from("providers")
      .select("*");

    if (search) {
      query = query.ilike(
        "service_category",
        `%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.log(error);
    } else {
      setProviders(data || []);
    }
  }

  return (
    <section className="bg-black text-white px-6 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-bold mb-4">
          Trusted Providers
        </h1>

        {search ? (
          <p className="text-red-400 text-2xl mb-12">
            Results for: {search}
          </p>
        ) : (
          <p className="text-zinc-400 text-xl mb-12">
            Verified professionals across Nepal
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-10">

          {providers.map((provider) => (

            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
            >
              <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500 transition cursor-pointer">

                <img
                  src={
                    provider.profile_image ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                  }
                  className="w-full h-[340px] object-cover"
                />

                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>
                      <h2 className="text-4xl font-bold">
                        {provider.full_name}
                      </h2>

                      <p className="text-red-400 mt-3 text-xl">
                        {provider.service_category}
                      </p>

                      <p className="text-zinc-500 mt-2">
                        {provider.phone}
                      </p>
                    </div>

                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
                      Verified
                    </div>

                  </div>

                  <div className="flex gap-4 mt-8">

                    <a
                      href={`tel:${provider.phone}`}
                      className="bg-zinc-800 hover:bg-zinc-700 px-6 py-4 rounded-2xl flex-1 text-center font-semibold"
                    >
                      Call
                    </a>

                    <a
                      href={`https://wa.me/${provider.phone}`}
                      target="_blank"
                      className="bg-red-500 hover:bg-red-600 px-6 py-4 rounded-2xl flex-1 text-center font-semibold"
                    >
                      WhatsApp
                    </a>

                  </div>

                </div>

              </div>
            </Link>

          ))}

        </div>

        {providers.length === 0 && (
          <div className="text-center text-zinc-500 text-3xl mt-20">
            No providers found.
          </div>
        )}

      </div>
    </section>
  );
}