"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import ProviderCard from "@/components/ProviderCard";

export default function ProviderDetails() {
  const params = useParams();

  const [provider, setProvider] =
    useState<any>(null);

  const [portfolio,
    setPortfolio] =
    useState<any[]>([]);

  const [recommendedProviders,
    setRecommendedProviders] =
    useState<any[]>([]);

  const [verified,
    setVerified] =
    useState(false);

  const [reportName,
    setReportName] =
    useState("");

  const [reportReason,
    setReportReason] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    initializePage();
  }, []);

  async function initializePage() {
    await fetchProvider();
    await fetchPortfolio();
    await fetchVerification();
    await increaseViews();
  }

  async function fetchProvider() {
    const { data } =
      await supabase
        .from("providers")
        .select("*")
        .eq("id", params.slug)
        .single();

    if (data) {
      setProvider(data);

      fetchRecommendedProviders(
        data.service_category,
        data.id
      );
    }

    setLoading(false);
  }

  async function fetchVerification() {
    const { data } =
      await supabase
        .from(
          "provider_verifications"
        )
        .select("*")
        .eq(
          "provider_id",
          params.slug
        )
        .eq("verified", true)
        .single();

    setVerified(!!data);
  }

  async function fetchPortfolio() {
    const { data } =
      await supabase
        .from("provider_portfolio")
        .select("*")
        .eq(
          "provider_id",
          params.slug
        );

    setPortfolio(data || []);
  }

  async function increaseViews() {
    const { data } = await supabase
      .from("providers")
      .select("total_views")
      .eq("id", params.slug)
      .single();

    if (!data) return;

    await supabase
      .from("providers")
      .update({
        total_views:
          (data.total_views || 0) + 1,
      })
      .eq("id", params.slug);
  }

  async function fetchRecommendedProviders(
    category: string,
    currentId: string
  ) {
    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("approved", true)
      .eq(
        "service_category",
        category
      )
      .neq("id", currentId)
      .order(
        "premium",
        {
          ascending: false,
        }
      )
      .limit(3);

    setRecommendedProviders(
      data || []
    );
  }

  async function submitBooking(
    e: any
  ) {
    e.preventDefault();

    const form =
      new FormData(e.target);

    const { error } =
      await supabase
        .from("bookings")
        .insert([
          {
            provider_id:
              params.slug,
            customer_name:
              form.get(
                "customer_name"
              ),
            customer_phone:
              form.get(
                "customer_phone"
              ),
            message:
              form.get("message"),
            status: "pending",
          },
        ]);

    if (error) {
      alert("Booking failed");
    } else {
      alert(
        "Booking request sent"
      );

      e.target.reset();
    }
  }

  async function submitReport(
    e: any
  ) {
    e.preventDefault();

    const { error } =
      await supabase
        .from("reports")
        .insert([
          {
            provider_id:
              params.slug,
            reporter_name:
              reportName,
            reason:
              reportReason,
          },
        ]);

    if (error) {
      alert("Report failed");
    } else {
      alert(
        "Report submitted"
      );

      setReportName("");
      setReportReason("");
    }
  }

  if (loading || !provider) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center text-4xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-14">

          <div>

            <img
              src={
                provider.profile_image
              }
              className="w-full h-[700px] object-cover rounded-3xl"
            />

          </div>

          <div>

            <div className="flex items-center gap-4 mb-6">

              {provider.premium && (

                <div className="bg-yellow-500 text-black px-5 py-2 rounded-full font-black">
                  PREMIUM
                </div>

              )}

              {verified && (

                <div className="bg-green-500 text-black px-5 py-2 rounded-full font-black">
                  VERIFIED
                </div>

              )}

              <div className="bg-red-500 px-5 py-2 rounded-full font-bold">
                ⭐{" "}
                {provider.average_rating ||
                  0}
              </div>

            </div>

            <h1 className="text-7xl font-bold">
              {provider.full_name}
            </h1>

            <p className="text-red-500 text-3xl mt-6">
              {
                provider.service_category
              }
            </p>

            <p className="text-zinc-400 text-2xl mt-5">
              📍 {provider.city}
            </p>

            <p className="text-zinc-400 text-2xl mt-4">
              📞 {provider.phone}
            </p>

            <div className="grid grid-cols-2 gap-5 mt-10">

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

                <p className="text-zinc-500 text-xl">
                  Profile Views
                </p>

                <h3 className="text-5xl font-bold mt-4">
                  {
                    provider.total_views ||
                    0
                  }
                </h3>

              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

                <p className="text-zinc-500 text-xl">
                  Leads
                </p>

                <h3 className="text-5xl font-bold mt-4">
                  {
                    provider.total_bookings ||
                    0
                  }
                </h3>

              </div>

            </div>

            <div className="flex gap-5 mt-10">

              <a
                href={`tel:${provider.phone}`}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-5 rounded-2xl text-center text-2xl font-bold"
              >
                Call
              </a>

              <a
                href={`https://wa.me/${provider.phone}`}
                target="_blank"
                className="flex-1 bg-red-500 hover:bg-red-600 py-5 rounded-2xl text-center text-2xl font-bold"
              >
                WhatsApp
              </a>

            </div>

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

              <h2 className="text-4xl font-bold mb-8">
                Request Service
              </h2>

              <form
                onSubmit={
                  submitBooking
                }
                className="space-y-5"
              >

                <input
                  name="customer_name"
                  placeholder="Your Name"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
                  required
                />

                <input
                  name="customer_phone"
                  placeholder="Your Phone"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
                  required
                />

                <textarea
                  name="message"
                  placeholder="Describe your issue"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none h-40"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 py-5 rounded-2xl text-2xl font-bold"
                >
                  Send Request
                </button>

              </form>

            </div>

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

              <h2 className="text-4xl font-bold mb-8">
                Report Provider
              </h2>

              <form
                onSubmit={
                  submitReport
                }
                className="space-y-5"
              >

                <input
                  value={reportName}
                  onChange={(e) =>
                    setReportName(
                      e.target.value
                    )
                  }
                  placeholder="Your Name"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
                  required
                />

                <textarea
                  value={reportReason}
                  onChange={(e) =>
                    setReportReason(
                      e.target.value
                    )
                  }
                  placeholder="Describe issue or fraud"
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none h-40"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-5 rounded-2xl text-2xl font-black"
                >
                  Submit Report
                </button>

              </form>

            </div>

          </div>

        </div>

        <section className="mt-24">

          <h2 className="text-6xl font-bold mb-12">
            Work Portfolio
          </h2>

          {portfolio.length === 0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-14 text-center">

              <h3 className="text-4xl font-bold">
                No Portfolio Yet
              </h3>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {portfolio.map(
                (item) => (

                  <img
                    key={item.id}
                    src={item.image_url}
                    className="w-full h-[350px] object-cover rounded-3xl"
                  />

                )
              )}

            </div>

          )}

        </section>

        <section className="mt-24">

          <h2 className="text-6xl font-bold mb-12">
            Similar Providers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {recommendedProviders.map(
              (provider) => (

                <ProviderCard
                  key={provider.id}
                  provider={provider}
                />

              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}