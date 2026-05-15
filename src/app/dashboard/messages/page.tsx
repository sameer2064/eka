export default function DashboardMessagesPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Messages
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
        <h2 className="text-xl font-semibold mb-2">
          No messages yet
        </h2>

        <p className="text-zinc-400">
          Customer and provider conversations will appear here.
        </p>
      </div>
    </main>
  );
}