"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function JobsPage() {
  const [jobs, setJobs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [city, setCity] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [customerName,
    setCustomerName] =
    useState("");

  const [customerPhone,
    setCustomerPhone] =
    useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const { data } =
      await supabase
        .from("jobs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    setJobs(data || []);

    setLoading(false);
  }

  async function createJob(
    e: any
  ) {
    e.preventDefault();

    const { error } =
      await supabase
        .from("jobs")
        .insert([
          {
            customer_name:
              customerName,
            customer_phone:
              customerPhone,
            title,
            description,
            city,
            budget:
              Number(budget),
            status: "open",
          },
        ]);

    if (error) {
      alert("Job creation failed");
    } else {
      alert("Job posted");

      setTitle("");
      setDescription("");
      setCity("");
      setBudget("");
      setCustomerName("");
      setCustomerPhone("");

      fetchJobs();
    }
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
              Marketplace Jobs
            </h1>

            <p className="text-zinc-400 text-xl mt-4">
              Customers post jobs. Providers compete.
            </p>

          </div>

          <div className="bg-red-500 px-6 py-3 rounded-full text-xl font-bold">
            LIVE MARKETPLACE
          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-20">

          <h2 className="text-5xl font-bold mb-10">
            Post a Job
          </h2>

          <form
            onSubmit={createJob}
            className="space-y-5"
          >

            <input
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
              placeholder="Your Name"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <input
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(
                  e.target.value
                )
              }
              placeholder="Phone Number"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Job Title"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe the work needed"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none h-40"
              required
            />

            <input
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              placeholder="City"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(
                  e.target.value
                )
              }
              placeholder="Budget"
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 py-5 rounded-2xl text-2xl font-bold"
            >
              Post Job
            </button>

          </form>

        </div>

        <div className="space-y-8">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-5xl font-bold">
                    {job.title}
                  </h2>

                  <p className="text-zinc-400 text-xl mt-5">
                    📍 {job.city}
                  </p>

                </div>

                <div className="bg-green-500 text-black px-5 py-2 rounded-full font-black text-xl">
                  Rs. {job.budget}
                </div>

              </div>

              <p className="text-zinc-300 text-2xl mt-8 leading-10">
                {job.description}
              </p>

              <div className="mt-10">

                <a
                  href={`/jobs/${job.id}`}
                  className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-2xl text-2xl font-bold inline-block"
                >
                  View Job
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}