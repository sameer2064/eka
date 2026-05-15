"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";

export default function ProvidersPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("rating");

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {

    try {

      const response =
        await fetch(
          "/api/providers"
        );

      const result =
        await response.json();

      if (result.success) {

        let data =
          result.providers || [];

        if (sortBy === "rating") {

          data.sort(
            (a: any, b: any) =>
              (b.average_rating ||
                0) -
              (a.average_rating ||
                0)
          );
        }

        if (sortBy === "views") {

          data.sort(
            (a: any, b: any) =>
              (b.total_views || 0) -
              (a.total_views ||
                0)
          );
        }

        if (
          sortBy === "bookings"
        ) {

          data.sort(
            (a: any, b: any) =>
              (b.total_bookings ||
                0) -
              (a.total_bookings ||
                0)
          );
        }

        setProviders(data);
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  }

  const filteredProviders =
    providers.filter(
      (provider: any) =>
        provider.full_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        provider.service_category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        provider.city
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {

    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center text-4xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center flex-wrap gap-8 mb-14">

          <div>

            <h1 className="text-7xl font-bold">
              Marketplace
            </h1>

            <p className="text-zinc-400 text-2xl mt-4">
              Nepal’s intelligent service marketplace
            </p>

          </div>

          <div className="bg-green-500 text-black px-6 py-3 rounded-full text-xl font-black">
            API POWERED
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-14">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search providers..."
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
          >

            <option value="rating">
              Top Rated
            </option>

            <option value="views">
              Most Viewed
            </option>

            <option value="bookings">
              Most Booked
            </option>

          </select>

        </div>

        {filteredProviders.length ===
        0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-20 text-center">

            <h2 className="text-5xl font-bold">
              No Providers Found
            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProviders.map(
              (provider: any) => (

                <ProviderCard
                  key={provider.id}
                  provider={provider}
                />

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}