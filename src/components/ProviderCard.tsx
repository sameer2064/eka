import Link from "next/link";

export default function ProviderCard({
  provider,
}: any) {
  return (
    <Link
      href={`/providers/${provider.id}`}
    >

      <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500 transition cursor-pointer relative">

        {provider.premium && (

          <div className="absolute top-5 left-5 z-10 bg-yellow-500 text-black px-5 py-2 rounded-full text-lg font-black">
            PREMIUM
          </div>

        )}

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

              <p className="text-red-500 mt-3 text-xl">
                {
                  provider.service_category
                }
              </p>

              <p className="text-zinc-500 mt-3 text-lg">
                📍 {provider.city}
              </p>

            </div>

            <div className="bg-red-500 px-4 py-2 rounded-full text-lg font-bold">
              ⭐{" "}
              {provider.average_rating ||
                0}
            </div>

          </div>

          <p className="text-zinc-500 mt-5 text-xl">
            {provider.phone}
          </p>

          <div className="flex gap-4 mt-8">

            <a
              href={`tel:${provider.phone}`}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl text-center text-2xl font-bold transition"
            >
              Call
            </a>

            <a
              href={`https://wa.me/${provider.phone}`}
              target="_blank"
              className="flex-1 bg-red-500 hover:bg-red-600 py-4 rounded-2xl text-center text-2xl font-bold transition"
            >
              WhatsApp
            </a>

          </div>

        </div>

      </div>

    </Link>
  );
}