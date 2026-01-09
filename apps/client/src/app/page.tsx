"use client";

import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data, isLoading, error } = trpc.health.ping.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">ArreglaTodo - Client</h1>

        <div className="bg-white/10 p-8 rounded-lg border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">tRPC Health Check</h2>

          {isLoading && <p>Loading...</p>}

          {error && (
            <div className="text-red-400">
              <p>Error: {error.message}</p>
            </div>
          )}

          {data && (
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className={data.ok ? "text-green-400" : "text-red-400"}>
                  {data.ok ? "OK" : "Error"}
                </span>
              </p>
              <p>
                <strong>Time:</strong> {data.time.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Server time: {data.time.toISOString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
