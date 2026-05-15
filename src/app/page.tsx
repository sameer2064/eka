import Navbar from "@/components/Navbar";

export default function HomePage() {

  return (
    <main className="bg-black text-white min-h-screen">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

        <div>

          <div className="bg-red-950 text-red-400 inline-block px-5 py-3 rounded-full mb-8">
            Trusted by 10,000+ Nepali homes
          </div>

          <h1 className="text-7xl font-black leading-tight">

            Trusted home{" "}

            <span className="text-red-500">
              services
            </span>

            , verified for Nepal.

          </h1>

          <p className="text-zinc-400 text-2xl mt-8 leading-relaxed">

            Book plumbers, electricians,
            CCTV installers and verified
            professionals instantly.

          </p>

          <div className="flex gap-5 mt-10">

            <a
              href="/providers"
              className="bg-red-500 hover:bg-red-600 px-8 py-5 rounded-2xl text-xl font-bold transition"
            >
              Explore Providers
            </a>

            <a
              href="/jobs"
              className="border border-zinc-700 hover:border-zinc-500 px-8 py-5 rounded-2xl text-xl font-bold transition"
            >
              Post a Job
            </a>

          </div>

        </div>

        <div>

          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop"
            className="rounded-[40px] w-full h-[700px] object-cover"
          />

        </div>

      </section>

    </main>
  );
}