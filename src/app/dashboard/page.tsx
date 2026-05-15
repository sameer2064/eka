"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [provider, setProvider] =
    useState<any>(null);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [notifications,
    setNotifications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  async function initializeDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href =
        "/login";

      return;
    }

    const { data } =
      await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!data) {
      setLoading(false);
      return;
    }

    setProvider(data);

    await fetchBookings(data.id);

    await fetchNotifications(
      data.id
    );

    setupRealtime(data.id);

    setLoading(false);
  }

  async function fetchBookings(
    providerId: string
  ) {
    const { data } =
      await supabase
        .from("bookings")
        .select("*")
        .eq(
          "provider_id",
          providerId
        )
        .order("created_at", {
          ascending: false,
        });

    setBookings(data || []);
  }

  async function fetchNotifications(
    providerId: string
  ) {
    const { data } =
      await supabase
        .from("notifications")
        .select("*")
        .eq(
          "provider_id",
          providerId
        )
        .order("created_at", {
          ascending: false,
        });

    setNotifications(
      data || []
    );
  }

  function setupRealtime(
    providerId: string
  ) {

    supabase
      .channel(
        "provider-bookings"
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `provider_id=eq.${providerId}`,
        },
        () => {
          fetchBookings(
            providerId
          );
        }
      )
      .subscribe();

    supabase
      .channel(
        "provider-notifications"
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "notifications",
          filter: `provider_id=eq.${providerId}`,
        },
        () => {
          fetchNotifications(
            providerId
          );
        }
      )
      .subscribe();
  }

  async function updateBookingStatus(
    bookingId: string,
    status: string
  ) {

    await supabase
      .from("bookings")
      .update({
        status,
      })
      .eq("id", bookingId);
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

        <div className="flex justify-between items-center mb-14">

          <div>

            <h1 className="text-6xl font-bold">
              Live Dashboard
            </h1>

            <p className="text-zinc-400 text-xl mt-4">
              Real-time provider operations
            </p>

          </div>

          <div className="bg-green-500 text-black px-6 py-3 rounded-full text-xl font-black animate-pulse">
            LIVE
          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Live Leads
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {bookings.length}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Notifications
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {
                notifications.length
              }
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Rating
            </p>

            <h2 className="text-6xl font-bold mt-4">
              ⭐{" "}
              {provider.average_rating ||
                0}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <p className="text-zinc-500 text-xl">
              Views
            </p>

            <h2 className="text-6xl font-bold mt-4">
              {provider.total_views ||
                0}
            </h2>

          </div>

        </div>

        <section className="mb-20">

          <h2 className="text-5xl font-bold mb-10">
            Live Notifications
          </h2>

          {notifications.length ===
          0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">

              <h3 className="text-4xl font-bold">
                No Notifications
              </h3>

            </div>

          ) : (

            <div className="space-y-5">

              {notifications.map(
                (notification) => (

                  <div
                    key={
                      notification.id
                    }
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                  >

                    <h3 className="text-3xl font-bold">
                      {
                        notification.title
                      }
                    </h3>

                    <p className="text-zinc-300 text-xl mt-4">
                      {
                        notification.message
                      }
                    </p>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        <section>

          <h2 className="text-5xl font-bold mb-10">
            Live Customer Leads
          </h2>

          {bookings.length ===
          0 ? (

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">

              <h3 className="text-4xl font-bold">
                No Leads Yet
              </h3>

            </div>

          ) : (

            <div className="space-y-6">

              {bookings.map(
                (booking) => (

                  <div
                    key={booking.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="text-4xl font-bold">
                          {
                            booking.customer_name
                          }
                        </h3>

                        <p className="text-zinc-400 text-xl mt-3">
                          {
                            booking.customer_phone
                          }
                        </p>

                        <p className="text-zinc-300 text-xl mt-6">
                          {
                            booking.message
                          }
                        </p>

                      </div>

                      <div className="bg-red-500 px-5 py-2 rounded-full text-lg font-bold">
                        {
                          booking.status
                        }
                      </div>

                    </div>

                    <div className="flex gap-4 mt-8">

                      <button
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "accepted"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl text-lg font-bold"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "completed"
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl text-lg font-bold"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "rejected"
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl text-lg font-bold"
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}