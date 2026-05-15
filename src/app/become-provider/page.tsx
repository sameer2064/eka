"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function BecomeProviderPage() {
  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [serviceCategory,
    setServiceCategory] =
    useState("");

  const [city, setCity] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");

      window.location.href =
        "/login";

      return;
    }

    setUser(user);
  }

  async function handleSubmit(
    e: any
  ) {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select image");
      return;
    }

    if (!user) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}-${imageFile.name}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("providers")
      .upload(
        fileName,
        imageFile
      );

    if (uploadError) {
      console.log(uploadError);

      alert(
        "Image upload failed"
      );

      setLoading(false);

      return;
    }

    const { data } =
      supabase.storage
        .from("providers")
        .getPublicUrl(fileName);

    const imageUrl =
      data.publicUrl;

    const { error } =
      await supabase
        .from("providers")
        .insert([
          {
            full_name:
              fullName,

            phone: phone,

            service_category:
              serviceCategory,

            city: city,

            profile_image:
              imageUrl,

            user_id: user.id,

            approved: false,
          },
        ]);

    if (error) {
      console.log(error);

      alert(
        "Error adding provider"
      );
    } else {
      alert(
        "Provider submitted for approval"
      );

      window.location.href =
        "/dashboard";
    }

    setLoading(false);
  }

  if (!user) {
    return (
      <div className="bg-black min-h-screen"></div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">

      <Navbar />

      <div className="max-w-2xl mx-auto py-20 px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-5xl font-bold mb-4">
            Become a Provider
          </h1>

          <p className="text-zinc-400 text-xl mb-10">
            Your profile will be reviewed before approval.
          </p>

          <form
            onSubmit={
              handleSubmit
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
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            />

            <select
              value={
                serviceCategory
              }
              onChange={(e) =>
                setServiceCategory(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            >

              <option value="">
                Select Service
              </option>

              <option>
                Electrician
              </option>

              <option>
                Plumber
              </option>

              <option>
                Mechanic
              </option>

              <option>
                CCTV
              </option>

              <option>
                Painter
              </option>

              <option>
                Carpenter
              </option>

            </select>

            <select
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-xl outline-none"
              required
            >

              <option value="">
                Select City
              </option>

              <option>
                Kathmandu
              </option>

              <option>
                Lalitpur
              </option>

              <option>
                Bhaktapur
              </option>

              <option>
                Pokhara
              </option>

              <option>
                Butwal
              </option>

            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(
                e: any
              ) =>
                setImageFile(
                  e.target.files[0]
                )
              }
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 transition py-5 rounded-2xl text-2xl font-bold"
            >
              {loading
                ? "Uploading..."
                : "Submit For Approval"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}