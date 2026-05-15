"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  const [reports, setReports] =
    useState<any[]>([]);

  const [verifications,
    setVerifications] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>({
      providers: 0,
      jobs: 0,
      bookings: 0,
      reports: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {

    await fetchProviders();

    await fetchReports();

    await fetchVerifications();

    await fetchStats();

    setLoading(false);
  }

  async function fetchProviders() {

    const { data } =
      await supabase
        .from("providers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setProviders(data || []);
  }

  async function fetchReports() {

    const { data } =
      await supabase
        .from("reports")
        .select("*")
        .eq("resolved", false)
        .order("created_at", {
          ascending: false,
        });

    setReports(data || []);
  }

  async function fetchVerifications() {

    const { data } =
      await supabase
        .from(
          "provider_verifications"
        )
        .select("*")
        .eq("verified", false)
        .eq("rejected", false);

    setVerifications(
      data || []
    );
  }

  async function fetchStats() {

    const providersCount =
      await supabase
        .from("providers")
        .select("*", {
          count: "exact",
          head: true,
        });

    const jobsCount =
      await supabase
        .from("jobs")
        .select("*", {
          count: "exact",
          head: true,
        });

    const bookingsCount =
      await supabase
        .from("bookings")
        .select("*", {
          count: "exact",
          head: true,
        });

    const reportsCount =
      await supabase
        .from("reports")
        .select("*", {
          count: "exact",
          head: true,
        });

    setStats({
      providers:
        providersCount.count || 0,
      jobs:
        jobsCount.count || 0,
      bookings:
        bookingsCount.count || 0,
      reports:
        reportsCount.count || 0,
    });
  }

  async function approveProvider(
    id: string
  ) {

    await supabase
      .from("providers")
      .update({
        approved: true,
      })
      .eq("id", id);

    fetchProviders();
  }

  async function banProvider(
    id: string
  ) {

    await supabase
      .from("providers")
      .update({
        approved: false,
      })
      .eq("id", id);

    fetchProviders();
  }

  async function resolveReport(
    id: string
  ) {

    await supabase
      .from("reports")
      .update({
        resolved: true,
      })
      .eq("id", id);

    fetchReports();
  }

  async function approveVerification(
    verification: any
  ) {

    await supabase
      .from(
        "provider_verifications"
      )
      .update({
        verified: true,
      })
      .eq("id", verification.id);

    await supabase
      .from("providers")
      .update({
        verified: true,
        trust_score: 100,
      })
      .eq(
        "id",
        verification.provider_id
      );

    fetchVerifications();
  }

  async function rejectVerification(
    id: string
  ) {

    await supabase
      .from(
        "provider_verifications"
      )
      .update({
        rejected: true,
      })
      .eq("id", id);

    fetchVerifications();
  }

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

        <div className="flex justify-between items-center mb-16">

          <div>

            <h1 className="text-7xl font-bold">
              Admin Control Center
            </h1>

            <p className="text-zinc-400 text-2xl mt-4">
              Marketplace operations & moderation
            </p>

          </div>

          <div className="bg-red-500 px-6 py-3 rounded-full text-xl font-black">
            SUPER ADMIN
          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-20">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Providers
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {stats.providers}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Jobs
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {stats.jobs}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Bookings
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {stats.bookings}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Reports
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {stats.reports}
            </h2>

          </div>

        </div>

        <section className="mb-24">

          <h2 className="text-5xl font-bold mb-10">
            Verification Requests
          </h2>

          <div className="space-y-6">

            {verifications.map(
              (verification) => (

                <div
                  key={verification.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                >

                  <div className="grid md:grid-cols-3 gap-5 mb-8">

                    <img
                      src={
                        verification.citizenship_front
                      }
                      className="rounded-2xl h-[250px] object-cover w-full"
                    />

                    <img
                      src={
                        verification.citizenship_back
                      }
                      className="rounded-2xl h-[250px] object-cover w-full"
                    />

                    <img
                      src={
                        verification.selfie_image
                      }
                      className="rounded-2xl h-[250px] object-cover w-full"
                    />

                  </div>

                  <div className="flex gap-4">

                    <button
                      onClick={() =>
                        approveVerification(
                          verification
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-xl font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectVerification(
                          verification.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-2xl text-xl font-bold"
                    >
                      Reject
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        <section className="mb-24">

          <h2 className="text-5xl font-bold mb-10">
            Fraud Reports
          </h2>

          <div className="space-y-6">

            {reports.map(
              (report) => (

                <div
                  key={report.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                >

                  <h3 className="text-3xl font-bold">
                    {
                      report.reporter_name
                    }
                  </h3>

                  <p className="text-zinc-300 text-xl mt-5">
                    {report.reason}
                  </p>

                  <button
                    onClick={() =>
                      resolveReport(
                        report.id
                      )
                    }
                    className="mt-8 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl text-lg font-bold"
                  >
                    Resolve
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        <section>

          <h2 className="text-5xl font-bold mb-10">
            Provider Management
          </h2>

          <div className="space-y-6">

            {providers.map(
              (provider) => (

                <div
                  key={provider.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex justify-between items-center"
                >

                  <div>

                    <h3 className="text-3xl font-bold">
                      {
                        provider.full_name
                      }
                    </h3>

                    <p className="text-zinc-400 text-xl mt-3">
                      {
                        provider.service_category
                      }
                    </p>

                  </div>

                  <div className="flex gap-4">

                    {!provider.approved ? (

                      <button
                        onClick={() =>
                          approveProvider(
                            provider.id
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl text-lg font-bold"
                      >
                        Approve
                      </button>

                    ) : (

                      <button
                        onClick={() =>
                          banProvider(
                            provider.id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl text-lg font-bold"
                      >
                        Ban
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </main>
  );
}